import { format } from "date-fns";
import { CheckSquare, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { useToast } from "@/hooks/use-toast";

type HabitListProps = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
};

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const { toast } = useToast();

  const toggleHabitCheck = (habitId: string) => {
    setHabits((currentHabits: Habit[]) =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const today = format(date, 'yyyy-MM-dd');
          const todayChecks = habit.checks.filter(check => 
            check.timestamp.startsWith(today)
          );

          if (todayChecks.length >= habit.checksPerDay) {
            toast({
              title: "Erro",
              description: "Você já completou todas as marcações para hoje!",
              variant: "destructive"
            });
            return habit;
          }

          const newCheck = {
            timestamp: new Date().toISOString(),
            completed: true
          };

          return {
            ...habit,
            checks: [...habit.checks, newCheck]
          };
        }
        return habit;
      })
    );
  };

  const removeHabitCheck = (habitId: string) => {
    setHabits((currentHabits: Habit[]) =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const today = format(date, 'yyyy-MM-dd');
          const updatedChecks = habit.checks.filter(check => 
            !check.timestamp.startsWith(today)
          );
          return {
            ...habit,
            checks: updatedChecks
          };
        }
        return habit;
      })
    );
  };

  const removeHabit = (habitId: string) => {
    setHabits((currentHabits: Habit[]) => 
      currentHabits.filter(habit => habit.id !== habitId)
    );
    toast({
      title: "Sucesso",
      description: "Hábito removido com sucesso!"
    });
  };

  const getCompletedChecksToday = (habit: Habit) => {
    const today = format(date, 'yyyy-MM-dd');
    return habit.checks.filter(check => 
      check.timestamp.startsWith(today)
    ).length;
  };

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {habit.icon}
            <span className="font-medium">{habit.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: habit.checksPerDay }).map((_, index) => {
              const isCompleted = index < getCompletedChecksToday(habit);
              return (
                <button
                  key={index}
                  onClick={() => isCompleted ? removeHabitCheck(habit.id) : toggleHabitCheck(habit.id)}
                  className="p-1 hover:bg-accent/50 rounded transition-colors"
                >
                  {isCompleted ? (
                    <CheckSquare className="w-6 h-6 text-primary" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHabit(habit.id)}
              className="ml-2 text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};