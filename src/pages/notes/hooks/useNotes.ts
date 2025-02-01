import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar notas",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  const { mutate: createNote } = useMutation({
    mutationFn: async (note: { title: string; content: string }) => {
      const { data, error } = await supabase.from("notes").insert([note]).select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Nota criada com sucesso",
        description: "Sua nota foi adicionada à lista",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateNote } = useMutation({
    mutationFn: async (note: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", note.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Nota atualizada com sucesso",
        description: "Suas alterações foram salvas",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Nota excluída",
        description: "Sua nota foi removida da lista",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
}