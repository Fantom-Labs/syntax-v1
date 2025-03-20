
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Edit2, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Task {
  time: string;
  task: string;
}

interface RoutineTimeBlockProps {
  title: string;
  subtitle: string;
  tasks: Task[];
  accentColor: string;
  isEditable?: boolean;
}

export const RoutineTimeBlock = ({
  title,
  subtitle,
  tasks: initialTasks,
  accentColor,
  isEditable = false
}: RoutineTimeBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editedTasks, setEditedTasks] = useState<Task[]>(initialTasks);

  const handleStartEditing = () => {
    setEditedTasks([...tasks]);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setTasks(editedTasks);
    setIsEditing(false);
    toast.success(`Rotina de ${title.toLowerCase()} atualizada`);
  };

  const handleCancelEditing = () => {
    setEditedTasks([...tasks]);
    setIsEditing(false);
  };

  const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = [...editedTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setEditedTasks(updatedTasks);
  };

  const handleAddTask = () => {
    setEditedTasks([...editedTasks, { time: "", task: "" }]);
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = [...editedTasks];
    updatedTasks.splice(index, 1);
    setEditedTasks(updatedTasks);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          {isEditable && !isEditing && (
            <Button variant="ghost" size="sm" onClick={handleStartEditing}>
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {subtitle}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {isEditing ? (
            editedTasks.map((task, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={task.time}
                      onChange={(e) => handleTaskChange(index, "time", e.target.value)}
                      className="w-24 flex-shrink-0"
                    />
                    <Input
                      value={task.task}
                      onChange={(e) => handleTaskChange(index, "task", e.target.value)}
                      placeholder="Descreva sua atividade"
                    />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleRemoveTask(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            tasks.map((task, index) => (
              <div key={index} className="routine-item">
                <div 
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0", 
                    accentColor
                  )}
                >
                  <Check className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{task.time}</span>
                  </div>
                  <p className="text-sm">{task.task}</p>
                </div>
              </div>
            ))
          )}

          {isEditing && (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleAddTask}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar atividade
            </Button>
          )}
        </div>
      </CardContent>

      {isEditing && (
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={handleCancelEditing}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
