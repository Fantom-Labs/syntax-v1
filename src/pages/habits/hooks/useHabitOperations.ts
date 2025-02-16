
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
    if (!todayCheck) {
      // Se não houver check, marca como completado
      completed = true;
      failed = false;
    } else if (todayCheck.completed && !todayCheck.failed) {
      // Se estiver completado, marca como falhou
      completed = false;
      failed = true;
    } else if (todayCheck.failed) {
      // Se estiver falhou, volta para neutro
      completed = false;
      failed = false;
    } else {
      // Se estiver neutro, marca como completado
      completed = true;
      failed = false;
    }

    console.log('Estado atual:', { todayCheck, completed, failed }); // Debug

    // Se estiver voltando para o estado neutro, deletamos o registro
    if (!completed && !failed) {
      const { error } = await supabase
        .from("habit_history")
        .delete()
        .eq('habit_id', habitId)
        .eq('date', date);

      if (error) {
        console.error('Erro ao deletar:', error); // Debug
        toast({
          title: "Erro",
          description: "Erro ao atualizar hábito",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Caso contrário, atualizamos ou inserimos o registro
      const updateData = {
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
        failed
      };

      console.log('Salvando dados:', updateData); // Debug

      const { error } = await supabase
        .from("habit_history")
        .upsert(updateData);

      if (error) {
        console.error('Erro ao salvar:', error); // Debug
        toast({
          title: "Erro",
          description: "Erro ao atualizar hábito",
          variant: "destructive"
        });
        return;
      }
    }

    // Atualiza o estado local
    setHabits(currentHabits => 
      currentHabits.map(h => {
        if (h.id === habitId) {
          let newChecks = h.checks.filter(check => !check.timestamp.startsWith(date));
          if (completed || failed) {
            newChecks.push({
              timestamp: `${date}T00:00:00.000Z`,
              completed,
              failed
            });
          }
          
          return {
            ...h,
            checks: newChecks
          };
        }
        return h;
      })
    );

    const message = completed ? "Hábito concluído!" : failed ? "Hábito não concluído" : "Hábito neutro";
    console.log('Estado final:', message); // Debug

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
