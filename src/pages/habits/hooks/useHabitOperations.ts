
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
      // Busca o estado atual do hábito para a data específica
      const { data: existingCheck } = await supabase
        .from("habit_history")
        .select("*")
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      // Determina o próximo estado baseado no estado atual
      let nextState;

      if (!existingCheck) {
        // Se não existe registro, marca como concluído
        nextState = { completed: true, failed: false };
      } else if (existingCheck.completed) {
        // Se está concluído, marca como falhou
        nextState = { completed: false, failed: true };
      } else {
        // Se está marcado como falha ou outro estado, remove o registro
        nextState = null;
      }

      // Aplica a mudança no banco de dados
      if (nextState === null) {
        await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);
      } else {
        await supabase
          .from("habit_history")
          .upsert({
            habit_id: habitId,
            user_id: user.id,
            date,
            completed: nextState.completed,
            failed: nextState.failed
          });
      }

      // Atualiza o estado local
      setHabits(currentHabits => 
        currentHabits.map(h => {
          if (h.id === habitId) {
            const updatedChecks = h.checks.filter(c => !c.timestamp.startsWith(date));
            if (nextState) {
              updatedChecks.push({
                timestamp: `${date}T00:00:00.000Z`,
                completed: nextState.completed,
                failed: nextState.failed
              });
            }
            return { ...h, checks: updatedChecks };
          }
          return h;
        })
      );

      // Feedback para o usuário
      const message = nextState === null ? "Estado removido" :
                     nextState.completed ? "Hábito concluído!" :
                     "Hábito não concluído";
      
      toast({
        title: message,
        description: "Status atualizado com sucesso"
      });

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
