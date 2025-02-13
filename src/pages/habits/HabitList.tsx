import { Habit } from "@/types/habits";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HabitItem } from "./components/HabitItem";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface HabitListProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
}

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const { toast } = useToast();
  const [runningTimers, setRunningTimers] = useState<{ [key: string]: number }>({});
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    Object.keys(runningTimers).forEach(habitId => {
      timers[habitId] = setInterval(() => {
        setElapsedTimes(prev => ({
          ...prev,
          [habitId]: (prev[habitId] || 0) + 1
        }));
      }, 60000); // Update every minute
    });

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, [runningTimers]);

  const toggleHabitCheck = async (habitId: string, date: string, tracking_type: string, increment: boolean = true) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const todayCheck = habit.checks.find(c => c.timestamp.startsWith(date));
    let completed;
    let failed;

    if (tracking_type === 'task') {
      if (!todayCheck || (!todayCheck.completed && !todayCheck.failed)) {
        completed = true;
        failed = false;
      } else if (todayCheck.completed) {
        completed = false;
        failed = true;
      } else {
        completed = false;
        failed = false;
      }
    } else {
      completed = true;
      failed = false;
    }

    let amount = undefined;
    let time = undefined;

    if (tracking_type === 'amount') {
      amount = (todayCheck?.amount || 0) + (increment ? 1 : -1);
      if (amount < 0) {
        amount = 0;
      }
      completed = amount >= (habit.amount_target || 0);
    }

    if (tracking_type === 'time') {
      if (runningTimers[habitId]) {
        time = (todayCheck?.time || 0) + elapsedTimes[habitId];
        completed = time >= (habit.time_target || 0);
        setRunningTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[habitId];
          return newTimers;
        });
        setElapsedTimes(prev => {
          const newTimes = { ...prev };
          delete newTimes[habitId];
          return newTimes;
        });
      } else {
        time = todayCheck?.time || 0;
        setRunningTimers(prev => ({
          ...prev,
          [habitId]: Date.now()
        }));
        setElapsedTimes(prev => ({
          ...prev,
          [habitId]: 0
        }));
        return;
      }
    }

    const { error } = await supabase
      .from("habit_history")
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
        failed,
        amount,
        time
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar hábito",
        variant: "destructive"
      });
      return;
    }

    setHabits(currentHabits => 
      currentHabits.map(h => {
        if (h.id === habitId) {
          let newChecks = h.checks.filter(check => !check.timestamp.startsWith(date));
          newChecks.push({
            timestamp: `${date}T00:00:00.000Z`,
            completed,
            failed,
            amount,
            time
          });
          
          return {
            ...h,
            checks: newChecks
          };
        }
        return h;
      })
    );

    const message = 
      tracking_type === 'task' ? (completed ? "Hábito concluído!" : failed ? "Hábito não concluído" : "Hábito neutro") :
      tracking_type === 'amount' ? `${amount}/${habit.amount_target} concluídos` :
      tracking_type === 'time' ? `${time}/${habit.time_target} minutos registrados` : "";

    toast({
      title: message,
      description: completed ? "Continue assim!" : "Continue tentando!",
    });
  };

  const removeHabit = async (habitId: string) => {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover hábito",
        variant: "destructive"
      });
      return;
    }

    setHabits(currentHabits => currentHabits.filter(habit => habit.id !== habitId));
    setIsDeleteMode(false);
    toast({
      title: "Sucesso",
      description: "Hábito removido com sucesso!"
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = habits.findIndex((habit) => habit.id === active.id);
    const newIndex = habits.findIndex((habit) => habit.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newHabits = arrayMove(habits, oldIndex, newIndex);
      setHabits(newHabits);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Atualiza a ordem mantendo todos os campos necessários
      const updates = newHabits.map((habit, index) => ({
        id: habit.id,
        title: habit.title,
        type: habit.type,
        tracking_type: habit.tracking_type,
        emoji: habit.emoji,
        color: habit.color,
        amount_target: habit.amount_target,
        time_target: habit.time_target,
        repeat_days: habit.repeat_days,
        checks_per_day: habit.checksPerDay,
        user_id: user.id,
        order: index
      }));

      const { error } = await supabase
        .from('habits')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        toast({
          title: "Erro ao salvar ordem",
          description: "Não foi possível salvar a nova ordem dos hábitos",
          variant: "destructive"
        });
        return;
      }
    }
  };

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                date={date}
                runningTimers={runningTimers}
                elapsedTimes={elapsedTimes}
                onToggleHabit={toggleHabitCheck}
                onRemoveHabit={removeHabit}
                isDeleteMode={isDeleteMode}
              />
            ))}
            
            {habits.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhum hábito cadastrado
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {habits.length > 0 && (
        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className="mt-6 text-destructive hover:text-destructive/90 underline underline-offset-4 text-sm mx-auto block"
        >
          {isDeleteMode ? "Cancelar" : "Excluir hábito"}
        </button>
      )}
    </>
  );
};
