import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { TaskInput } from "@/components/tasks/TaskInput";
import { TaskList } from "@/components/tasks/TaskList";
import { DateNavigation } from "@/components/tasks/DateNavigation";
import { Task } from "@/types/tasks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const TasksPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
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
      }));
    },
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title }])
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
        .update({ completed })
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

  const navigateDay = (direction: 'next' | 'prev') => {
    setDate(currentDate => direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <PageTemplate title="Tarefas">
      <div className="grid gap-6">
        <div className="space-y-4">
          <TaskInput onAddTask={handleAddTask} />
          <DateNavigation date={date} onNavigate={navigateDay} />
          <TaskList 
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
          {isLoading && (
            <p className="text-center text-muted-foreground">
              Carregando tarefas...
            </p>
          )}
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border bg-card w-full max-w-[350px] mx-auto"
        />
      </div>
    </PageTemplate>
  );
};