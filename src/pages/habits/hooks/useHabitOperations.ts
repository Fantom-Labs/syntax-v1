
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

    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      toast({
        title: "Erro",
        description: "Hábito não encontrado",
        variant: "destructive"
      });
      return;
    }

    // Encontra o check atual para o dia
    const { data: existingCheck, error: checkError } = await supabase
      .from("habit_history")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", date)
      .maybeSingle(); // Alterado de .single() para .maybeSingle()

    if (checkError) {
      console.error("Erro ao buscar histórico:", checkError);
      toast({
        title: "Erro",
        description: "Erro ao verificar estado do hábito",
        variant: "destructive"
      });
      return;
    }

    // Define o próximo estado com base no estado atual
    let nextState;
    if (!existingCheck) {
      // Se não existir check, marca como concluído
      nextState = { completed: true, failed: false };
    } else if (existingCheck.completed && !existingCheck.failed) {
      // Se estiver concluído, marca como não concluído
      nextState = { completed: false, failed: true };
    } else if (existingCheck.failed) {
      // Se estiver não concluído, remove o registro (estado neutro)
      nextState = null;
    } else {
      // Estado indefinido, marca como concluído
      nextState = { completed: true, failed: false };
    }

    console.log('Estado atual:', existingCheck);
    console.log('Próximo estado:', nextState);

    try {
      if (nextState === null) {
        // Remove o registro para voltar ao estado neutro
        const { error } = await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);

        if (error) throw error;
      } else {
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

      // Mensagem de sucesso apropriada
      const message = nextState === null ? "Estado neutro" :
                     nextState.completed ? "Hábito concluído!" :
                     "Hábito não concluído";
      
      toast({
        title: message,
        description: "Status atualizado com sucesso!"
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
