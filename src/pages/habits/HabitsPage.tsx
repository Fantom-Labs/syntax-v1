import { useState, useEffect } from "react";
import { Activity, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Habit } from "@/types/habits";
import { HabitList } from "./HabitList";
import { DateNavigation } from "./DateNavigation";
import { HabitsDashboard } from "./HabitsDashboard";
import { supabase } from "@/integrations/supabase/client";

export const HabitsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [checksPerDay, setChecksPerDay] = useState(1);
  const [userId, setUserId] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      if (user?.id) {
        const { data: userHabits, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching habits:", error);
          return;
        }

        setHabits(userHabits.map(habit => ({
          id: habit.id,
          title: habit.title,
          icon: <Activity className="w-5 h-5 text-primary" />,
          checksPerDay: habit.checks_per_day,
          checks: []
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

    const { data: habit, error } = await supabase
      .from("habits")
      .insert({
        title: newHabitTitle,
        checks_per_day: checksPerDay,
        user_id: userId
      })
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
      icon: <Activity className="w-5 h-5 text-primary" />,
      checksPerDay: habit.checks_per_day,
      checks: []
    };

    setHabits([...habits, newHabit]);
    setNewHabitTitle("");
    setChecksPerDay(1);
    setIsAddingHabit(false);
    toast({
      title: "Sucesso",
      description: "Hábito adicionado com sucesso!"
    });
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
                    <Label htmlFor="title">Título do Hábito</Label>
                    <Input
                      id="title"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      placeholder="Ex: Beber água"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checks">Marcações por dia</Label>
                    <Input
                      id="checks"
                      type="number"
                      min="1"
                      max="10"
                      value={checksPerDay}
                      onChange={(e) => setChecksPerDay(Number(e.target.value))}
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