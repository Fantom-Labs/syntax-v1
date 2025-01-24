import { Button } from "@/components/ui/button";
import { Task } from "@/types/tasks";
import { Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskList = ({ tasks, onToggleTask, onDeleteTask }: TaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTask(task.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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