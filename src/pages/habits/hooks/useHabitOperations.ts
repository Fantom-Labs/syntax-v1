
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
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      // Busca o estado atual do hábito
      const { data: existingCheck } = await supabase
        .from("habit_history")
        .select("completed, failed")
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      // Define o próximo estado no loop infinito: neutro -> concluído -> não concluído -> neutro
      let nextState;

      if (!existingCheck) {
        // Se não existe registro (neutro) -> concluído
        nextState = { completed: true, failed: false };
      } else if (existingCheck.completed) {
        // Se está concluído -> não concluído
        nextState = { completed: false, failed: true };
      } else if (existingCheck.failed) {
        // Se está não concluído -> neutro (deleta o registro)
        const { error } = await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);

        if (error) throw error;

        // Atualiza estado local removendo o check
        setHabits(currentHabits => 
          currentHabits.map(h => {
            if (h.id === habitId) {
              return {
                ...h,
                checks: h.checks.filter(c => !c.timestamp.startsWith(date))
              };
            }
            return h;
          })
        );

        toast({
          title: "Estado removido",
          description: "Status atualizado com sucesso"
        });

        return;
      }

      if (nextState) {
        // Insere ou atualiza o registro com o novo estado
        const { error } = await supabase
          .from("habit_history")
          .upsert({
            habit_id: habitId,
            user_id: user.id,
            date,
            completed: nextState.completed,
            failed: nextState.failed
          });

        if (error) throw error;

        // Atualiza o estado local
        setHabits(currentHabits => 
          currentHabits.map(h => {
            if (h.id === habitId) {
              return {
                ...h,
                checks: [
                  ...h.checks.filter(c => !c.timestamp.startsWith(date)),
                  {
                    timestamp: `${date}T00:00:00.000Z`,
                    completed: nextState.completed,
                    failed: nextState.failed
                  }
                ]
              };
            }
            return h;
          })
        );

        toast({
          title: nextState.completed ? "Hábito concluído!" : "Hábito não concluído",
          description: "Status atualizado com sucesso"
        });
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o hábito",
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

      setHabits(currentHabits => currentHabits.filter(habit => habit.id !== habitId));
      setIsDeleteMode(false);
      
      toast({
        title: "Sucesso",
        description: "Hábito removido com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao remover hábito:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover hábito",
        variant: "destructive"
      });
    }
  };

  return {
    toggleHabitCheck,
    removeHabit
  };
};
