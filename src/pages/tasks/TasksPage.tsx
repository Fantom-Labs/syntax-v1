
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { TaskInput } from "@/components/tasks/TaskInput";
import { TaskList } from "@/components/tasks/TaskList";
import { Task } from "@/types/tasks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useState } from "react";

export const TasksPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showArchived, setShowArchived] = useState(false);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', { archived: showArchived }],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('archived', showArchived)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar tarefas",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed || false,
        archived: task.archived || false,
        user_id: task.user_id
      }));
    },
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          title,
          user_id: user.user.id,
          archived: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Tarefa adicionada",
        description: "Sua tarefa foi salva com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed, archived: completed })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Tarefa removida",
        description: "Sua tarefa foi removida com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTask = (title: string) => {
    if (title.trim()) {
      addTaskMutation.mutate(title);
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTaskMutation.mutate({ id, completed: !task.completed });
    }
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  return (
    <PageTemplate title="Tarefas">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            {showArchived ? "Voltar às tarefas" : "Ver arquivadas"}
          </Button>
        </div>

        {!showArchived && <TaskInput onAddTask={handleAddTask} />}
        
        <TaskList 
          tasks={tasks}
          onToggleTask={toggleTask}
        />

        {isLoading && (
          <p className="text-center text-muted-foreground">
            Carregando tarefas...
          </p>
        )}
      </div>
    </PageTemplate>
  );
};
