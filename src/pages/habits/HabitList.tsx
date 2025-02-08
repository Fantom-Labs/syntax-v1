
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2, Play, Plus } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HabitListProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
}

type CheckStatus = "unchecked" | "completed" | "failed";

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 0 });
  
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const day = addDays(startOfCurrentWeek, index);
    return format(day, "yyyy-MM-dd");
  });

  const getCheckStatus = (habit: Habit, date: string): CheckStatus => {
    const check = habit.checks.find(c => c.timestamp.startsWith(date));
    if (!check) return "unchecked";
    return check.completed ? "completed" : "failed";
  };

  const toggleHabitCheck = async (habitId: string, date: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentStatus = getCheckStatus(habit, date);
    const completed = currentStatus === "unchecked";

    let amount = undefined;
    let time = undefined;

    if (completed && habit.tracking_type === 'amount' && habit.amount_target) {
      amount = habit.amount_target;
    }
    if (completed && habit.tracking_type === 'time' && habit.time_target) {
      time = habit.time_target;
    }

    const { error } = await supabase
      .from("habit_history")
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
        amount,
        time
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar hábito",
        variant: "destructive"
      });
      return;
    }

    setHabits(currentHabits => 
      currentHabits.map(h => {
        if (h.id === habitId) {
          let newChecks = h.checks.filter(check => !check.timestamp.startsWith(date));
          newChecks.push({
            timestamp: `${date}T00:00:00.000Z`,
            completed,
            amount,
            time
          });
          
          return {
            ...h,
            checks: newChecks
          };
        }
        return h;
      })
    );
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
    toast({
      title: "Sucesso",
      description: "Hábito removido com sucesso!"
    });
  };

  const getHabitColor = (habit: Habit) => {
    return habit.color || (habit.type === 'build' ? '#7BFF8B' : '#ea384c');
  };

  const getProgressText = (habit: Habit) => {
    const todayCheck = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
    
    if (habit.tracking_type === 'task') {
      return todayCheck?.completed ? 'Completed' : 'Not completed';
    } else if (habit.tracking_type === 'amount') {
      const current = todayCheck?.amount || 0;
      return `${current}/${habit.amount_target} ${habit.title.toLowerCase()}`;
    } else if (habit.tracking_type === 'time') {
      const current = todayCheck?.time || 0;
      return `${current}:00/${habit.time_target}:00`;
    }
  };

  const renderHabitAction = (habit: Habit) => {
    const check = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
    const isCompleted = check?.completed;

    switch (habit.tracking_type) {
      case 'task':
        return (
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isCompleted ? 'bg-primary' : 'bg-secondary'}`}
            onClick={() => toggleHabitCheck(habit.id, format(date, "yyyy-MM-dd"))}
          >
            {isCompleted ? '✓' : ''}
          </Button>
        );
      case 'time':
        return (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary hover:bg-secondary/80"
          >
            <Play className="h-4 w-4" />
          </Button>
        );
      case 'amount':
        return (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div
          key={habit.id}
          className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/5 transition-colors`}
          style={{ backgroundColor: `${getHabitColor(habit)}15` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: getHabitColor(habit) }}
            >
              {habit.emoji || habit.title[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{habit.title}</span>
              <span className="text-sm text-muted-foreground">
                {getProgressText(habit)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {renderHabitAction(habit)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHabit(habit.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {habits.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Nenhum hábito cadastrado
        </p>
      )}
    </div>
  );
};
