import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export type EventFormData = z.infer<typeof formSchema>;

export const useEvents = () => {
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

  const addEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      // Add UTC offset to prevent timezone issues
      const date = new Date(data.date);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

      const { error } = await supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description || '',
          date: format(date, 'yyyy-MM-dd'),
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar evento",
        description: error.message,
      });
    },
  });

  const editEvent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventFormData }) => {
      // Add UTC offset to prevent timezone issues
      const date = new Date(data.date);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

      const { error } = await supabase
        .from('events')
        .update({
          title: data.title,
          description: data.description || '',
          date: format(date, 'yyyy-MM-dd'),
          time: data.time,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento atualizado com sucesso!",
        description: "As alterações foram salvas na sua agenda.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar evento",
        description: error.message,
      });
    },
  });

  const deleteEvent = useMutation({
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

  return {
    events,
    isLoading,
    addEvent,
    editEvent,
    deleteEvent,
  };
};