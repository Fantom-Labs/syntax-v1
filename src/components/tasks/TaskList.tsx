
import { Button } from "@/components/ui/button";
import { Task } from "@/types/tasks";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.title}
          </span>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleTask(task.id)}
            className="h-5 w-5"
          />
        </div>
      ))}
      {tasks.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Nenhuma tarefa cadastrada
        </p>
      )}
    </div>
  );
};
