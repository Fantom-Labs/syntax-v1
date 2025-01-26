import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

export const HabitsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Acordar cedo",
      icon: <Activity className="w-5 h-5 text-primary" />,
      checksPerDay: 1,
      checks: []
    },
    {
      id: "2",
      title: "Passear com Katana",
      icon: <Activity className="w-5 h-5 text-primary" />,
      checksPerDay: 2,
      checks: []
    },
    {
      id: "3",
      title: "Beber 2L de água",
      icon: <Activity className="w-5 h-5 text-primary" />,
      checksPerDay: 1,
      checks: []
    }
  ]);

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [checksPerDay, setChecksPerDay] = useState(1);
  const { toast } = useToast();

  const addHabit = () => {
    if (!newHabitTitle.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para o hábito",
        variant: "destructive"
      });
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle,
      icon: <Activity className="w-5 h-5 text-primary" />,
      checksPerDay,
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

  return (
    <PageTemplate title="Hábitos">
      <div className="grid gap-6 md:grid-cols-[1fr]">
        <div className="space-y-6">
          <DateNavigation date={date} setDate={setDate} />
          <HabitList habits={habits} setHabits={setHabits} date={date} />
          
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
      </div>
    </PageTemplate>
  );
};