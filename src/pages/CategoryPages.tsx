import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";

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
  return (
    <PageTemplate title="Tarefas">
      <div>Em desenvolvimento</div>
    </PageTemplate>
  );
};

export const Habitos = () => {
  return (
    <PageTemplate title="Hábitos">
      <div>Em desenvolvimento</div>
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