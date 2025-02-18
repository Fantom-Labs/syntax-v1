
import { Habit } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHabitOperations = (
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  setIsDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const toggleHabitCheck = async (habitId: string, date: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: habit } = await supabase
        .from("habit_history")
        .select("*")
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      // Estado atual e próximo estado
      let newState;

      if (!habit) {
        // Sem registro -> Concluído
        newState = { completed: true, failed: false };
      } else if (habit.completed) {
        // Concluído -> Não concluído
        newState = { completed: false, failed: true };
      } else {
        // Não concluído -> Sem registro (neutro)
        const { error: deleteError } = await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);

        if (deleteError) throw deleteError;

        // Atualiza estado local
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              checks: h.checks.filter(check => !check.timestamp.startsWith(date))
            };
          }
          return h;
        }));

        return;
      }

      // Se chegou aqui, precisa criar ou atualizar o registro
      const { error: upsertError } = await supabase
        .from("habit_history")
        .upsert({
          habit_id: habitId,
          user_id: user.id,
          date,
          completed: newState.completed,
          failed: newState.failed
        });

      if (upsertError) throw upsertError;

      // Atualiza estado local
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          const newChecks = [
            ...h.checks.filter(check => !check.timestamp.startsWith(date)),
            {
              timestamp: `${date}T00:00:00.000Z`,
              completed: newState.completed,
              failed: newState.failed
            }
          ];
          return { ...h, checks: newChecks };
        }
        return h;
      }));
    } catch (error) {
      console.error("Erro ao atualizar hábito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hábito",
        variant: "destructive"
      });
    }
  };

  const removeHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      setIsDeleteMode(false);
      
      toast({
        title: "Sucesso",
        description: "Hábito removido com sucesso"
      });
    } catch (error) {
      console.error("Erro ao remover hábito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o hábito",
        variant: "destructive"
      });
    }
  };

  return {
    toggleHabitCheck,
    removeHabit
  };
};
