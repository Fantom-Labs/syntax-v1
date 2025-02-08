
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Habit, HabitType, TrackingType } from "@/types/habits";
import { HabitList } from "./HabitList";
import { DateNavigation } from "./DateNavigation";
import { HabitsDashboard } from "./HabitsDashboard";
import { supabase } from "@/integrations/supabase/client";

export const HabitsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [habitType, setHabitType] = useState<HabitType>("build");
  const [trackingType, setTrackingType] = useState<TrackingType>("task");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#7BFF8B");
  const [amountTarget, setAmountTarget] = useState(1);
  const [timeTarget, setTimeTarget] = useState(30);
  const [userId, setUserId] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      if (user?.id) {
        const { data: habits, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching habits:", error);
          return;
        }

        const { data: history, error: historyError } = await supabase
          .from("habit_history")
          .select("*")
          .eq("user_id", user.id);

        if (historyError) {
          console.error("Error fetching habit history:", historyError);
          return;
        }

        setHabits(habits.map(habit => ({
          id: habit.id,
          title: habit.title,
          type: habit.type as HabitType,
          tracking_type: habit.tracking_type as TrackingType,
          emoji: habit.emoji,
          color: habit.color,
          amount_target: habit.amount_target,
          time_target: habit.time_target,
          repeat_days: habit.repeat_days,
          checksPerDay: habit.checks_per_day || 1,
          checks: history
            ?.filter(h => h.habit_id === habit.id)
            .map(h => ({
              timestamp: h.date,
              completed: h.completed,
              amount: h.amount,
              time: h.time
            })) || []
        })));
      }
    };

    checkAuth();
  }, []);

  const addHabit = async () => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar hábitos",
        variant: "destructive"
      });
      return;
    }

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
      tracking_type: trackingType,
      emoji: emoji || undefined,
      color: color || undefined,
      amount_target: trackingType === 'amount' ? amountTarget : undefined,
      time_target: trackingType === 'time' ? timeTarget : undefined,
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
      tracking_type: habit.tracking_type as TrackingType,
      emoji: habit.emoji,
      color: habit.color,
      amount_target: habit.amount_target,
      time_target: habit.time_target,
      repeat_days: habit.repeat_days,
      checksPerDay: habit.checks_per_day || 1,
      checks: []
    };

    setHabits([...habits, newHabit]);
    resetForm();
    setIsAddingHabit(false);
    toast({
      title: "Sucesso",
      description: "Hábito adicionado com sucesso!"
    });
  };

  const resetForm = () => {
    setNewHabitTitle("");
    setHabitType("build");
    setTrackingType("task");
    setEmoji("");
    setColor("#7BFF8B");
    setAmountTarget(1);
    setTimeTarget(30);
  };

  if (!userId) {
    return (
      <PageTemplate title="Hábitos">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Crie sua conta e configure seus hábitos diários!
          </h2>
          <p className="text-muted-foreground text-center">
            Acompanhe seu progresso e desenvolva hábitos positivos.
          </p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Hábitos">
      <div className="grid gap-6 md:grid-cols-[1fr]">
        <div className="space-y-6">
          <DateNavigation date={date} setDate={setDate} />
          <HabitList habits={habits} setHabits={setHabits} date={date} />
          
          <div className="flex justify-center">
            <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                    <Label>Tipo de Acompanhamento</Label>
                    <Select value={trackingType} onValueChange={(value) => setTrackingType(value as TrackingType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Tarefa (Sim/Não)</SelectItem>
                        <SelectItem value="amount">Quantidade (repetições)</SelectItem>
                        <SelectItem value="time">Tempo (minutos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {trackingType === 'amount' && (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Meta de Repetições</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={amountTarget}
                        onChange={(e) => setAmountTarget(Number(e.target.value))}
                      />
                    </div>
                  )}

                  {trackingType === 'time' && (
                    <div className="space-y-2">
                      <Label htmlFor="time">Meta de Tempo (minutos)</Label>
                      <Input
                        id="time"
                        type="number"
                        min="1"
                        value={timeTarget}
                        onChange={(e) => setTimeTarget(Number(e.target.value))}
                      />
                    </div>
                  )}

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
          </div>

          <HabitsDashboard userId={userId} />
        </div>
      </div>
    </PageTemplate>
  );
};
