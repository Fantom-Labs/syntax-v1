
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#7BFF8B");
  const [userId, setUserId] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const loadHabits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      if (user?.id) {
        const { data: habits, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .order('order', { ascending: true });

        if (error) {
          console.error("Error fetching habits:", error);
          return;
        }

        // Busca o histórico dos últimos 42 dias (6 semanas)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 42);
        const formattedStartDate = startDate.toISOString().split('T')[0];

        const { data: history, error: historyError } = await supabase
          .from("habit_history")
          .select("*")
          .eq("user_id", user.id)
          .gte('date', formattedStartDate);

        if (historyError) {
          console.error("Error fetching habit history:", historyError);
          return;
        }

        // Criar um Map de habits para evitar duplicatas
        const habitsMap = new Map();
        habits.forEach(habit => {
          const habitChecks = history
            ?.filter(h => h.habit_id === habit.id)
            .map(h => ({
              timestamp: `${h.date}T00:00:00.000Z`,
              completed: h.completed,
              failed: h.failed || false
            })) || [];

          habitsMap.set(habit.id, {
            id: habit.id,
            title: habit.title,
            type: habit.type as HabitType,
            tracking_type: "task" as TrackingType,
            emoji: habit.emoji,
            color: habit.color,
            repeat_days: habit.repeat_days,
            checksPerDay: habit.checks_per_day || 1,
            checks: habitChecks
          });
        });

        // Converter o Map para array
        const uniqueHabits = Array.from(habitsMap.values());
        setHabits(uniqueHabits);
      }
    };

    loadHabits();
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
    setEmoji("");
    setColor("#7BFF8B");
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
      <div className="grid gap-6">
        <div className="space-y-6 max-w-full">
          <DateNavigation date={date} setDate={setDate} />
          <HabitList habits={habits} setHabits={setHabits} date={date} />
          
          <div className="flex justify-center mt-4">
            <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
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
          </div>

          <HabitsDashboard userId={userId} />
        </div>
      </div>
    </PageTemplate>
  );
};
