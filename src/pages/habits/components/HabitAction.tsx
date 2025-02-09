
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Check, Play, Plus, Pause } from "lucide-react";
import { format } from "date-fns";
import { getCheckStatus } from "../utils/habitUtils";

interface HabitActionProps {
  habit: Habit;
  date: Date;
  runningTimers: { [key: string]: number };
  onToggleHabit: (habitId: string, date: string, tracking_type: string) => void;
}

export const HabitAction = ({ habit, date, runningTimers, onToggleHabit }: HabitActionProps) => {
  const check = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
  const isCompleted = check?.completed;
  const habitId = habit.id;
  const isRunning = !!runningTimers[habitId];

  switch (habit.tracking_type) {
    case 'task':
      return (
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full w-8 h-8 border ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}
          onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'task')}
        >
          {isCompleted && <Check className="h-4 w-4" />}
        </Button>
      );
    case 'time':
      return (
        <Button
          variant={isCompleted ? "default" : isRunning ? "default" : "ghost"}
          size="icon"
          onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'time')}
          className={`rounded-full w-8 h-8 border 
            ${isCompleted 
              ? 'bg-primary border-primary text-primary-foreground' 
              : isRunning 
                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                : 'border-muted-foreground hover:bg-accent'}`}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      );
    case 'amount':
      return (
        <Button
          variant={isCompleted ? "default" : "ghost"}
          size="icon"
          onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'amount')}
          className={`rounded-full w-8 h-8 border ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:bg-accent'}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      );
  }
};
