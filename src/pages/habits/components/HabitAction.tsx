
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { getCheckStatus } from "../utils/habitUtils";

interface HabitActionProps {
  habit: Habit;
  date: Date;
  onToggleHabit: (habitId: string, date: string, tracking_type: string) => void;
}

export const HabitAction = ({ habit, date, onToggleHabit }: HabitActionProps) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const checkStatus = getCheckStatus(habit, formattedDate);

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
      onClick={() => onToggleHabit(habit.id, formattedDate, 'task')}
    >
      {checkStatus === "completed" && <Check className="h-4 w-4" />}
      {checkStatus === "failed" && <X className="h-4 w-4" />}
    </Button>
  );
};
