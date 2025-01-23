import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays, subDays } from "date-fns";
import { CalendarIcon, Clock, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { Check, Dog, Sun, Droplets, Plus as PlusIcon, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export const Agenda = () => {
  const [date, setDate] = useState<Date>();
  const [events, setEvents] = useState<z.infer<typeof formSchema>[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "12:00",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setEvents((prev) => [...prev, data]);
    toast({
      title: "Evento adicionado com sucesso!",
      description: `${data.title} - ${format(data.date, "dd/MM/yyyy")}`,
    });
    form.reset();
  };

  return (
    <PageTemplate title="Agenda">
      <div className="grid gap-6 md:grid-cols-[350px,1fr]">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border bg-card"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-[#7BFF8B] via-[#F6FF71] to-[#DE7CFF] hover:opacity-90 text-foreground">
                <Plus className="mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Evento</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Reunião, Consulta, etc..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Detalhes do evento..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2 rounded-md border p-2">
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                            <span className="text-sm">
                              {field.value ? format(field.value, "dd/MM/yyyy") : "Selecione uma data"}
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-50" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Adicionar Evento</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-medium mb-4">Eventos</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-gradient-to-r from-[#7BFF8B]/10 via-[#F6FF71]/10 to-[#DE7CFF]/10 hover:from-[#7BFF8B]/20 hover:via-[#F6FF71]/20 hover:to-[#DE7CFF]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  <time className="text-sm text-muted-foreground">
                    {format(event.date, "dd/MM/yyyy")} às {event.time}
                  </time>
                </div>
                {event.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-muted-foreground">
                Nenhum evento cadastrado
              </p>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export const Tarefas = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<{ id: number; title: string; completed: boolean }[]>([
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
      <div className="grid gap-6 md:grid-cols-[350px,1fr]">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar nova tarefa..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                handleAddTask(input.value);
                input.value = '';
              }}
            >
              Adicionar
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border bg-card"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={() => navigateDay('prev')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(date, "dd 'de' MMMM 'de' yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateDay('next')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
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
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  Remover
                </Button>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma tarefa cadastrada
              </p>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export const Habitos = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Acordar cedo",
      icon: <Sun className="w-5 h-5 text-[#F6FF71]" />,
      checksPerDay: 1,
      checks: []
    },
    {
      id: "2",
      title: "Passear com Katana",
      icon: <Dog className="w-5 h-5 text-[#DE7CFF]" />,
      checksPerDay: 2,
      checks: []
    },
    {
      id: "3",
      title: "Beber 2L de água",
      icon: <Droplets className="w-5 h-5 text-[#7BFF8B]" />,
      checksPerDay: 1,
      checks: []
    }
  ]);

  const toggleHabitCheck = (habitId: string) => {
    setHabits(currentHabits =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split('T')[0];
          const todayChecks = habit.checks.filter(check => 
            check.timestamp.startsWith(today)
          );

          if (todayChecks.length >= habit.checksPerDay) {
            toast.error("Você já completou todas as marcações para hoje!");
            return habit;
          }

          const newCheck = {
            timestamp: new Date().toISOString(),
            completed: true
          };

          return {
            ...habit,
            checks: [...habit.checks, newCheck]
          };
        }
        return habit;
      })
    );
  };

  const getCompletedChecksToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.checks.filter(check => 
      check.timestamp.startsWith(today)
    ).length;
  };

  return (
    <PageTemplate title="Hábitos">
      <div className="grid gap-6 md:grid-cols-[1fr]">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Lista de Hábitos Diários</h2>
            <Button variant="outline" size="icon" className="rounded-full">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {habits.map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {habit.icon}
                  <span className="font-medium">{habit.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: habit.checksPerDay }).map((_, index) => {
                    const isCompleted = index < getCompletedChecksToday(habit);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleHabitCheck(habit.id)}
                        className="p-1 hover:bg-accent/50 rounded transition-colors"
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-6 h-6 text-primary" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export const Conteudo = () => {
  return (
    <PageTemplate title="Conteúdo">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Livros = () => {
  return (
    <PageTemplate title="Livros">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Metas = () => {
  return (
    <PageTemplate title="Metas">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Compras = () => {
  return (
    <PageTemplate title="Compras">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Investimentos = () => {
  return (
    <PageTemplate title="Investimentos">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Notas = () => {
  return (
    <PageTemplate title="Notas">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Fisico = () => {
  return (
    <PageTemplate title="Físico">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Alimentacao = () => {
  return (
    <PageTemplate title="Alimentação">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};
