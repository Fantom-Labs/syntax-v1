import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { parseISO } from "date-fns";

export const useEventQueries = () => {
  const { toast } = useToast();

  return useQuery({
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
        date: parseISO(event.date),
      }));
    },
  });
};