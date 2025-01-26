import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2 } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface HabitListProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
}

type CheckStatus = "unchecked" | "completed" | "failed";

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const isMobile = useIsMobile();
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

  const toggleHabitCheck = (habitId: string, date: string) => {
    setHabits(currentHabits => 
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const currentStatus = getCheckStatus(habit, date);
          let newChecks = habit.checks.filter(check => !check.timestamp.startsWith(date));
          
          if (currentStatus === "unchecked") {
            newChecks.push({
              timestamp: `${date}T00:00:00.000Z`,
              completed: true
            });
          } else if (currentStatus === "completed") {
            newChecks.push({
              timestamp: `${date}T00:00:00.000Z`,
              completed: false
            });
          }
          
          return {
            ...habit,
            checks: newChecks
          };
        }
        return habit;
      })
    );
  };

  const removeHabit = (habitId: string) => {
    setHabits(currentHabits => currentHabits.filter(habit => habit.id !== habitId));
  };

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div
          key={habit.id}
          className={`flex ${isMobile ? 'flex-col' : 'items-center'} justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors gap-4`}
        >
          <div className="flex items-center gap-3 min-w-[200px]">
            {habit.icon}
            <span className="font-medium">{habit.title}</span>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {weekDays.map((day) => {
                const status = getCheckStatus(habit, day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleHabitCheck(habit.id, day)}
                    className={`w-8 h-8 rounded transition-colors flex-shrink-0 ${
                      status === "completed"
                        ? "bg-[#7BFF8B] hover:bg-[#6AEE7A]"
                        : status === "failed"
                        ? "bg-[#ea384c] hover:bg-[#d9293d]"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  />
                );
              })}
            </div>
            
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