import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { TaskInput } from "@/components/tasks/TaskInput";
import { TaskList } from "@/components/tasks/TaskList";
import { DateNavigation } from "@/components/tasks/DateNavigation";
import { Task } from "@/types/tasks";

export const TasksPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Fazer compras no supermercado", completed: false },
    { id: 2, title: "Preparar apresentação", completed: true },
    { id: 3, title: "Agendar consulta médica", completed: false },
  ]);
  const { toast } = useToast();

  const handleAddTask = (title: string) => {
    if (title.trim()) {
      setTasks([...tasks, { id: Date.now(), title, completed: false }]);
      toast({
        title: "Tarefa adicionada",
        description: title,
      });
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tarefa removida",
      variant: "destructive",
    });
  };

  const navigateDay = (direction: 'next' | 'prev') => {
    setDate(currentDate => direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
  };

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