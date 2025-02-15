
import { Habit } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHabitOperations = (
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  setIsDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const toggleHabitCheck = async (habitId: string, date: string, tracking_type: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const todayCheck = habit.checks.find(c => c.timestamp.startsWith(date));
    let completed = false;
    let failed = false;

    // Ciclo de estados: neutro -> completado -> falhou -> neutro
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

    // Salva o estado do hábito no banco de dados
    const { error } = await supabase
      .from("habit_history")
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
        failed
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar hábito",
        variant: "destructive"
      });
      return;
    }

    // Atualiza o estado local
    setHabits(currentHabits => 
      currentHabits.map(h => {
        if (h.id === habitId) {
          let newChecks = h.checks.filter(check => !check.timestamp.startsWith(date));
          newChecks.push({
            timestamp: `${date}T00:00:00.000Z`,
            completed,
            failed
          });
          
          return {
            ...h,
            checks: newChecks
          };
        }
        return h;
      })
    );

    const message = completed ? "Hábito concluído!" : failed ? "Hábito não concluído" : "Hábito neutro";

    toast({
      title: message,
      description: "Status atualizado com sucesso!",
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
