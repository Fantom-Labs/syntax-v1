import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventFormData } from "./useEvents";
import { format, parseISO } from "date-fns";

export const useEventMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      // Format the date in YYYY-MM-DD format
      const formattedDate = format(data.date, 'yyyy-MM-dd');

      const { error } = await supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description || '',
          date: formattedDate,
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
      const formattedDate = format(data.date, 'yyyy-MM-dd');

      const { error } = await supabase
        .from('events')
        .update({
          title: data.title,
          description: data.description || '',
          date: formattedDate,
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
    addEvent,
    editEvent,
    deleteEvent,
  };
};