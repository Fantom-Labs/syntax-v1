import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { EventList } from "./EventList";
import { EventForm } from "./EventForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export const AgendaPage = () => {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: error.message,
        });
        return [];
      }

      return data.map(event => ({
        ...event,
        date: new Date(event.date),
      }));
    },
  });

  const addEventMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description || '',
          date: format(data.date, 'yyyy-MM-dd'),
          time: data.time,
          user_id: session.session.user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento adicionado com sucesso!",
        description: "O evento foi salvo na sua agenda.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar evento",
        description: error.message,
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento excluído",
        description: "O evento foi removido da sua agenda.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir evento",
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "12:00",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addEventMutation.mutate(data);
  };

  return (
    <PageTemplate title="Agenda">
      <div className="grid gap-6 md:grid-cols-[350px,1fr]">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate) {
                form.setValue('date', newDate);
              }
            }}
            className="rounded-lg border bg-card"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Evento</DialogTitle>
              </DialogHeader>
              <EventForm form={form} onSubmit={onSubmit} />
            </DialogContent>
          </Dialog>
        </div>
        <EventList events={events} onDelete={(id) => deleteEventMutation.mutate(id)} />
      </div>
    </PageTemplate>
  );
};