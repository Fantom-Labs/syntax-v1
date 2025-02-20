
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Habit, HabitType } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const resetForm = () => {
    setNewHabitTitle("");
    setHabitType("build");
    setEmoji("");
    setColor("#7BFF8B");
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
      user_id: userId
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
      checks: []
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
          <div className="space-y-2">
            <Label>Tipo de Hábito</Label>
            <RadioGroup
              value={habitType}
              onValueChange={(value) => setHabitType(value as HabitType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="build" id="build" />
                <Label htmlFor="build">Construir</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quit" id="quit" />
                <Label htmlFor="quit">Abandonar</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Hábito</Label>
            <Input
              id="title"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="Ex: Beber água"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emoji">Emoji (opcional)</Label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Ex: 💧"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <Button onClick={addHabit} className="w-full">
            Adicionar Hábito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
