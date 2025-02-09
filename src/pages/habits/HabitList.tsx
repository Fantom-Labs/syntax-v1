
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2, Play, Plus, Check, Pause } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface HabitListProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
}

type CheckStatus = "unchecked" | "completed" | "failed";

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [runningTimers, setRunningTimers] = useState<{ [key: string]: number }>({});
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});

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

  const getCheckStatus = (habit: Habit, date: string): CheckStatus => {
    const check = habit.checks.find(c => c.timestamp.startsWith(date));
    if (!check) return "unchecked";
    return check.completed ? "completed" : "failed";
  };

  const toggleHabitCheck = async (habitId: string, date: string, tracking_type: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentStatus = getCheckStatus(habit, date);
    const todayCheck = habit.checks.find(c => c.timestamp.startsWith(date));
    let completed = tracking_type === 'task' ? currentStatus === "unchecked" : true;

    let amount = undefined;
    let time = undefined;

    if (tracking_type === 'amount') {
      amount = (todayCheck?.amount || 0) + 1;
      completed = amount >= (habit.amount_target || 0);
    }

    if (tracking_type === 'time') {
      if (runningTimers[habitId]) {
        // Stop timer
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
        // Start timer
        time = todayCheck?.time || 0;
        setRunningTimers(prev => ({
          ...prev,
          [habitId]: Date.now()
        }));
        setElapsedTimes(prev => ({
          ...prev,
          [habitId]: 0
        }));
        return; // Don't update the database when starting the timer
      }
    }

    const { error } = await supabase
      .from("habit_history")
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
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
      tracking_type === 'task' ? (completed ? "Hábito concluído!" : "Hábito desmarcado") :
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
    toast({
      title: "Sucesso",
      description: "Hábito removido com sucesso!"
    });
  };

  const getProgressText = (habit: Habit) => {
    const todayCheck = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
    const habitId = habit.id;
    
    if (habit.tracking_type === 'task') {
      return todayCheck?.completed ? 'Concluído' : 'Não concluído';
    } else if (habit.tracking_type === 'amount') {
      const current = todayCheck?.amount || 0;
      return `${current}/${habit.amount_target} ${habit.title.toLowerCase()}`;
    } else if (habit.tracking_type === 'time') {
      const current = todayCheck?.time || 0;
      const running = runningTimers[habitId];
      const elapsed = running ? (current + (elapsedTimes[habitId] || 0)) : current;
      return `${elapsed}min/${habit.time_target}min`;
    }
  };

  const renderHabitAction = (habit: Habit) => {
    const check = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
    const isCompleted = check?.completed;
    const habitId = habit.id;
    const isRunning = !!runningTimers[habitId];

    switch (habit.tracking_type) {
      case 'task':
        return (
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full w-8 h-8 border ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}
            onClick={() => toggleHabitCheck(habit.id, format(date, "yyyy-MM-dd"), 'task')}
          >
            {isCompleted && <Check className="h-4 w-4" />}
          </Button>
        );
      case 'time':
        return (
          <Button
            variant={isCompleted ? "default" : isRunning ? "default" : "ghost"}
            size="icon"
            onClick={() => toggleHabitCheck(habit.id, format(date, "yyyy-MM-dd"), 'time')}
            className={`rounded-full w-8 h-8 border 
              ${isCompleted 
                ? 'bg-primary border-primary text-primary-foreground' 
                : isRunning 
                  ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                  : 'border-muted-foreground hover:bg-accent'}`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        );
      case 'amount':
        return (
          <Button
            variant={isCompleted ? "default" : "ghost"}
            size="icon"
            onClick={() => toggleHabitCheck(habit.id, format(date, "yyyy-MM-dd"), 'amount')}
            className={`rounded-full w-8 h-8 border ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:bg-accent'}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        );
    }
  };

  return (
    <div className="space-y-2">
      {habits.map(habit => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm"
          style={{ backgroundColor: `${habit.color}10` }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div 
              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-medium"
              style={{ backgroundColor: habit.color }}
            >
              {habit.emoji || habit.title[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-base truncate">{habit.title}</span>
              <span className="text-sm text-muted-foreground truncate">
                {getProgressText(habit)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {renderHabitAction(habit)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHabit(habit.id)}
              className="text-destructive hover:text-destructive/90 rounded-full w-8 h-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {habits.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Nenhum hábito cadastrado
        </p>
      )}
    </div>
  );
};
