
import { Habit } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const useHabitOperations = (
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  runningTimers: { [key: string]: number },
  setRunningTimers: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>,
  elapsedTimes: { [key: string]: number },
  setElapsedTimes: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>,
  setIsDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

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

  return {
    toggleHabitCheck,
    removeHabit
  };
};
