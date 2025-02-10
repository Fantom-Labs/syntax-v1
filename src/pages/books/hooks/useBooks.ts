
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "../types";

export const useBooks = (searchQuery: string, language: "en" | "pt") => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: readingList, refetch: refetchReadingList } = useQuery({
    queryKey: ["reading-list"],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      const { data, error } = await supabase
        .from("reading_list")
        .select(`
          id,
          book_id,
          status,
          rating,
          books (
            id,
            title,
            author,
            cover_url,
            language,
            google_books_id
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: searchResults, refetch: searchBooks } = useQuery({
    queryKey: ["search-books", searchQuery, language],
    queryFn: async () => {
      if (!searchQuery) return { books: [] };
      
      const { data, error } = await supabase.functions.invoke("search-books", {
        body: { query: searchQuery, language: language || undefined },
      });

      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["book-suggestions", searchQuery, language],
    queryFn: async () => {
      if (searchQuery.length < 2) return { books: [] };
      
      const { data, error } = await supabase.functions.invoke("search-books", {
        body: { query: searchQuery, language, limit: 5 },
      });

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length >= 2,
  });

  const addToReadingList = async (book: Book) => {
    try {
      if (!session?.user.id) {
        toast.error("Você precisa estar logado para adicionar livros à lista");
        return;
      }

      const { data: existingBook } = await supabase
        .from("books")
        .select("id")
        .eq("google_books_id", book.google_books_id)
        .maybeSingle();

      let bookId;

      if (!existingBook) {
        const { data: newBook, error: insertError } = await supabase
          .from("books")
          .insert([{
            title: book.title,
            author: book.author,
            cover_url: book.cover_url,
            language: book.language,
            google_books_id: book.google_books_id
          }])
          .select("id")
          .single();

        if (insertError) throw insertError;
        bookId = newBook.id;
      } else {
        bookId = existingBook.id;
      }

      const { error: readingListError } = await supabase
        .from("reading_list")
        .insert([{
          book_id: bookId,
          user_id: session.user.id,
        }]);

      if (readingListError) throw readingListError;
      
      toast.success("Livro adicionado à lista de leitura!");
      refetchReadingList();
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Erro ao adicionar livro à lista");
    }
  };

  const removeFromReadingList = async (readingListId: string) => {
    try {
      const { error } = await supabase
        .from("reading_list")
        .delete()
        .eq("id", readingListId);

      if (error) throw error;
      
      toast.success("Livro removido da lista!");
      refetchReadingList();
    } catch (error) {
      console.error("Error removing book:", error);
      toast.error("Erro ao remover livro da lista");
    }
  };

  const updateStatus = async (readingListId: string, status: "read" | "to_read") => {
    try {
      const { error } = await supabase
        .from("reading_list")
        .update({ status })
        .eq("id", readingListId);
      
      if (error) throw error;
      
      toast.success("Status do livro atualizado");
      refetchReadingList();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status do livro");
    }
  };

  const updateRating = async (readingListId: string, rating: number | null) => {
    try {
      const { error } = await supabase
        .from("reading_list")
        .update({ rating })
        .eq("id", readingListId);

      if (error) throw error;
      
      toast.success("Avaliação atualizada!");
      refetchReadingList();
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Erro ao atualizar avaliação");
    }
  };

  return {
    session,
    readingList,
    searchResults,
    suggestions,
    searchBooks,
    addToReadingList,
    removeFromReadingList,
    updateStatus,
    updateRating,
  };
};
