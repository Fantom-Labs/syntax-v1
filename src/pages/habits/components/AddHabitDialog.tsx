
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Habit, HabitType } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";
import { HabitFormFields } from "./HabitFormFields";
import { HabitNotificationField } from "./HabitNotificationField";

interface AddHabitDialogProps {
  userId: string;
  onHabitAdded: (habit: Habit) => void;
}

export const AddHabitDialog = ({ userId, onHabitAdded }: AddHabitDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [habitType, setHabitType] = useState<HabitType>("build");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#7BFF8B");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const { toast } = useToast();

  const resetForm = () => {
    setNewHabitTitle("");
    setHabitType("build");
    setEmoji("");
    setColor("#7BFF8B");
    setNotificationEnabled(false);
    setNotificationTime("08:00");
  };

  const addHabit = async () => {
    if (!newHabitTitle.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para o hábito",
        variant: "destructive"
      });
      return;
    }

    const habitData = {
      title: newHabitTitle,
      type: habitType,
      tracking_type: 'task',
      emoji: emoji || undefined,
      color: color || undefined,
      user_id: userId,
      notification_enabled: notificationEnabled,
      notification_time: notificationEnabled ? notificationTime : null
    };

    const { data: habit, error } = await supabase
      .from("habits")
      .insert(habitData)
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar hábito",
        variant: "destructive"
      });
      return;
    }

    const newHabit: Habit = {
      id: habit.id,
      title: habit.title,
      type: habit.type as HabitType,
      tracking_type: 'task',
      emoji: habit.emoji,
      color: habit.color,
      repeat_days: habit.repeat_days,
      checksPerDay: habit.checks_per_day || 1,
      checks: [],
      notification_enabled: habit.notification_enabled,
      notification_time: habit.notification_time
    };

    onHabitAdded(newHabit);
    resetForm();
    setIsOpen(false);
    toast({
      title: "Sucesso",
      description: "Hábito adicionado com sucesso!"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Hábito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <HabitFormFields 
            habitTitle={newHabitTitle}
            onTitleChange={setNewHabitTitle}
            habitType={habitType}
            onTypeChange={setHabitType}
            emoji={emoji}
            onEmojiChange={setEmoji}
            color={color}
            onColorChange={setColor}
          />

          <HabitNotificationField
            notificationEnabled={notificationEnabled}
            notificationTime={notificationTime}
            onNotificationEnabledChange={setNotificationEnabled}
            onNotificationTimeChange={setNotificationTime}
          />

          <Button onClick={addHabit} className="w-full">
            Adicionar Hábito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
