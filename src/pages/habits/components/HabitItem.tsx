
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2 } from "lucide-react";
import { getProgressText } from "../utils/habitUtils";
import { HabitAction } from "./HabitAction";

interface HabitItemProps {
  habit: Habit;
  date: Date;
  runningTimers: { [key: string]: number };
  elapsedTimes: { [key: string]: number };
  onToggleHabit: (habitId: string, date: string, tracking_type: string) => void;
  onRemoveHabit: (habitId: string) => void;
}

export const HabitItem = ({
  habit,
  date,
  runningTimers,
  elapsedTimes,
  onToggleHabit,
  onRemoveHabit
}: HabitItemProps) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm"
      style={{ backgroundColor: `${habit.color}10` }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div 
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-medium"
          style={{ backgroundColor: habit.color }}
        >
          {habit.emoji || habit.title[0].toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-medium text-base truncate">{habit.title}</span>
          <span className="text-sm text-muted-foreground truncate">
            {getProgressText(habit, date, elapsedTimes, runningTimers)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <HabitAction
          habit={habit}
          date={date}
          runningTimers={runningTimers}
          onToggleHabit={onToggleHabit}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveHabit(habit.id)}
          className="text-destructive hover:text-destructive/90 rounded-full w-8 h-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
