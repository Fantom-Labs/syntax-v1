import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Trash2, GripVertical, Flame } from "lucide-react";
import { getProgressText, getConsecutiveDays } from "../utils/habitUtils";
import { HabitAction } from "./HabitAction";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface HabitItemProps {
  habit: Habit;
  date: Date;
  onToggleHabit: (habitId: string, date: string) => void;
  onRemoveHabit: (habitId: string) => void;
  isDeleteMode: boolean;
}
export const HabitItem = ({
  habit,
  date,
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
    isDragging
  } = useSortable({
    id: habit.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const consecutiveDays = getConsecutiveDays(habit);
  const showStreak = consecutiveDays >= 3; // Mudado de 5 para 3 dias

  return <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-2 md:p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm w-full max-w-full overflow-hidden ${isDeleteMode ? 'md:animate-none sm:animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`} {...attributes}>
      <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0 overflow-hidden">
        <button className="touch-none p-1 hover:bg-accent rounded-lg cursor-grab active:cursor-grabbing flex-shrink-0" {...listeners}>
          <GripVertical className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
        </button>
        
        <div className="w-7 h-7 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm md:text-base font-medium" style={{
        backgroundColor: habit.color
      }}>
          {habit.emoji || habit.title[0].toUpperCase()}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
            <span className="font-medium truncate md:text-lg text-base">{habit.title}</span>
            {showStreak && <div className="flex items-center gap-0.5 md:gap-1 text-amber-500 flex-shrink-0">
                <Flame className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-medium">{consecutiveDays}</span>
              </div>}
          </div>
          <span className="text-xs md:text-sm text-muted-foreground truncate">
            {getProgressText(habit, date)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 ml-1.5 md:ml-2 flex-shrink-0">
        <HabitAction habit={habit} date={date} onToggleHabit={onToggleHabit} />
        {isDeleteMode && <Button variant="ghost" size="icon" onClick={() => onRemoveHabit(habit.id)} className="text-destructive hover:text-destructive/90 rounded-full w-7 h-7 md:w-8 md:h-8">
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>}
      </div>
    </div>;
};