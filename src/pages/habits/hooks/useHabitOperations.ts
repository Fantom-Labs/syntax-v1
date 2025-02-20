
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
      // Busca o registro atual
      const { data: currentCheck } = await supabase
        .from("habit_history")
        .select("*")
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      // Lógica de alternância simplificada
      if (!currentCheck) {
        // Sem registro -> Criar como completo
        await supabase.from("habit_history").insert({
          habit_id: habitId,
          user_id: user.id,
          date,
          completed: true,
          failed: false
        });

        // Atualiza estado local
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              checks: [
                ...h.checks,
                {
                  timestamp: `${date}T00:00:00.000Z`,
                  completed: true,
                  failed: false
                }
              ]
            };
          }
          return h;
        }));
      } 
      else if (currentCheck.completed) {
        // Completo -> Marcar como falha
        await supabase
          .from("habit_history")
          .update({ completed: false, failed: true })
          .eq("habit_id", habitId)
          .eq("date", date);

        // Atualiza estado local
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              checks: h.checks.map(check => {
                if (check.timestamp.startsWith(date)) {
                  return { ...check, completed: false, failed: true };
                }
                return check;
              })
            };
          }
          return h;
        }));
      }
      else {
        // Falha ou outro estado -> Remover registro
        await supabase
          .from("habit_history")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date);

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
      // Remove o hábito
      await supabase.from("habits").delete().eq("id", habitId);
      
      // Remove todos os registros históricos do hábito
      await supabase.from("habit_history").delete().eq("habit_id", habitId);

      // Atualiza estado local
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
