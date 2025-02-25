
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { supabase } from "@/integrations/supabase/client";

export const TaskCard = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks-preview"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(3);

      return data || [];
    }
  });

  const handleToggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    await supabase
      .from("tasks")
      .update({ completed: !taskToUpdate.completed })
      .eq("id", id);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <ListTodo className="w-4 h-4" />
        Tarefas Pendentes
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando tarefas...</p>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
          <Button asChild variant="outline" className="w-full">
            <Link to="/tasks">Ver todas as tarefas</Link>
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhuma tarefa pendente
        </p>
      )}
    </Card>
  );
};
