
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
      const { data: existingHabit } = await supabase
        .from("habit_history")
        .select("*")
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      console.log('Estado atual:', existingHabit);

      // Define o próximo estado baseado no estado atual
      let nextState = null;
      
      if (!existingHabit) {
        // Se não existe registro -> marca como completo
        nextState = { completed: true, failed: false };
      } else if (existingHabit.completed) {
        // Se está completo -> marca como falhou
        nextState = { completed: false, failed: true };
      } else if (existingHabit.failed) {
        // Se falhou -> remove o registro (estado neutro)
        const { error: deleteError } = await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);

        if (deleteError) throw deleteError;

        // Atualiza estado local removendo o check
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              checks: h.checks.filter(check => !check.timestamp.startsWith(date))
            };
          }
          return h;
        }));

        console.log('Registro removido - estado neutro');
        return;
      }

      // Se temos um próximo estado, atualiza ou insere
      if (nextState !== null) {
        console.log('Próximo estado:', nextState);
        const { error: upsertError } = await supabase
          .from("habit_history")
          .upsert({
            habit_id: habitId,
            user_id: user.id,
            date,
            ...nextState
          });

        if (upsertError) throw upsertError;

        // Atualiza estado local
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            const newChecks = [
              ...h.checks.filter(check => !check.timestamp.startsWith(date)),
              {
                timestamp: `${date}T00:00:00.000Z`,
                ...nextState
              }
            ];
            return { ...h, checks: newChecks };
          }
          return h;
        }));
      }

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
