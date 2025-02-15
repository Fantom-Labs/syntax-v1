
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Habit } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHabitDragAndDrop = (
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
) => {
  const { toast } = useToast();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = habits.findIndex((habit) => habit.id === active.id);
    const newIndex = habits.findIndex((habit) => habit.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newHabits = arrayMove(habits, oldIndex, newIndex);
      setHabits(newHabits);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = newHabits.map((habit, index) => ({
        id: habit.id,
        title: habit.title,
        type: habit.type,
        tracking_type: habit.tracking_type,
        emoji: habit.emoji,
        color: habit.color,
        repeat_days: habit.repeat_days,
        checks_per_day: habit.checksPerDay,
        user_id: user.id,
        order: index
      }));

      const { error } = await supabase
        .from('habits')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        toast({
          title: "Erro ao salvar ordem",
          description: "Não foi possível salvar a nova ordem dos hábitos",
          variant: "destructive"
        });
        return;
      }
    }
  };

  return { handleDragEnd };
};
