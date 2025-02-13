
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2, GripVertical, Fire } from "lucide-react";
import { getProgressText, getConsecutiveDays } from "../utils/habitUtils";
import { HabitAction } from "./HabitAction";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HabitItemProps {
  habit: Habit;
  date: Date;
  runningTimers: { [key: string]: number };
  elapsedTimes: { [key: string]: number };
  onToggleHabit: (habitId: string, date: string, tracking_type: string) => void;
  onRemoveHabit: (habitId: string) => void;
  isDeleteMode: boolean;
}

export const HabitItem = ({
  habit,
  date,
  runningTimers,
  elapsedTimes,
  onToggleHabit,
  onRemoveHabit,
  isDeleteMode
}: HabitItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const consecutiveDays = getConsecutiveDays(habit);
  const showStreak = consecutiveDays >= 5;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm ${
        isDeleteMode ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''
      }`}
      {...attributes}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          className="touch-none p-1 hover:bg-accent rounded-lg cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div 
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-medium"
          style={{ backgroundColor: habit.color }}
        >
          {habit.emoji || habit.title[0].toUpperCase()}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-base truncate">{habit.title}</span>
            {showStreak && (
              <div className="flex items-center gap-1 text-amber-500">
                <Fire className="h-4 w-4" />
                <span className="text-sm font-medium">{consecutiveDays}</span>
              </div>
            )}
          </div>
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
        {isDeleteMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveHabit(habit.id)}
            className="text-destructive hover:text-destructive/90 rounded-full w-8 h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
