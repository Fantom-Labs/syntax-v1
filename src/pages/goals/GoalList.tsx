
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/goals";
import { Check, Trash2 } from "lucide-react";

interface GoalListProps {
  title: string;
  goals: Goal[];
  onToggleGoal: (id: string) => void;
  onRemoveGoal: (id: string) => void;
}

export const GoalList = ({ title, goals, onToggleGoal, onRemoveGoal }: GoalListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleGoal(goal.id)}
                className={goal.completed ? "text-green-500" : "text-muted-foreground"}
              >
                <Check className="h-4 w-4" />
              </Button>
              <span className={goal.completed ? "line-through text-muted-foreground" : ""}>
                {goal.title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveGoal(goal.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {goals.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Nenhuma meta cadastrada
          </p>
        )}
      </div>
    </div>
  );
};
