
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Check, Play, Plus, Pause, X, Minus } from "lucide-react";
import { format } from "date-fns";
import { getCheckStatus } from "../utils/habitUtils";

interface HabitActionProps {
  habit: Habit;
  date: Date;
  runningTimers: { [key: string]: number };
  onToggleHabit: (habitId: string, date: string, tracking_type: string, increment?: boolean) => void;
}

export const HabitAction = ({ habit, date, runningTimers, onToggleHabit }: HabitActionProps) => {
  const check = habit.checks.find(c => c.timestamp === `${format(date, "yyyy-MM-dd")}T00:00:00.000Z`);
  const isCompleted = check?.completed;
  const habitId = habit.id;
  const isRunning = !!runningTimers[habitId];
  const checkStatus = getCheckStatus(habit, format(date, "yyyy-MM-dd"));

  switch (habit.tracking_type) {
    case 'task':
      return (
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full w-8 h-8 border transition-colors duration-200 
            ${checkStatus === "completed" 
              ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
              : checkStatus === "failed"
                ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                : 'border-muted-foreground hover:bg-accent'}`}
          onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'task')}
        >
          {checkStatus === "completed" && <Check className="h-4 w-4" />}
          {checkStatus === "failed" && <X className="h-4 w-4" />}
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'amount', false)}
            className={`rounded-full w-8 h-8 border border-muted-foreground hover:bg-accent`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant={isCompleted ? "default" : "ghost"}
            size="icon"
            onClick={() => onToggleHabit(habit.id, format(date, "yyyy-MM-dd"), 'amount', true)}
            className={`rounded-full w-8 h-8 border ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:bg-accent'}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );
  }
};
