
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, StarOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageTemplate from "@/components/PageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Book {
  id?: string;
  title: string;
  author: string;
  cover_url: string | null;
  language: string;
  google_books_id: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
}

export const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "pt">("pt");

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

      // First check if the book already exists using google_books_id
      const { data: existingBook } = await supabase
        .from("books")
        .select("id")
        .eq("google_books_id", book.google_books_id)
        .maybeSingle();

      let bookId;

      if (!existingBook) {
        // If book doesn't exist, insert it
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

      // Add to reading list
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchBooks();
  };

  const renderStars = (rating: number | null, readingListId: string) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => updateRating(readingListId, star === rating ? null : star)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            {star <= (rating || 0) ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <PageTemplate title="Livros">
      <div className="space-y-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Buscar livros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {suggestions?.books && suggestions.books.length > 0 && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-10">
                <Command>
                  <CommandList>
                    <CommandEmpty>Nenhum livro encontrado.</CommandEmpty>
                    <CommandGroup heading="Sugestões">
                      {suggestions.books.map((book: Book) => (
                        <CommandItem
                          key={book.google_books_id}
                          onSelect={() => {
                            setSearchQuery(book.title);
                            addToReadingList(book);
                          }}
                          className="flex items-center gap-2"
                        >
                          {book.cover_url && (
                            <img
                              src={book.cover_url}
                              alt={book.title}
                              className="w-8 h-12 object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
          <Button type="submit" className="gap-2">
            <Search className="w-4 h-4" />
            Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLanguage(lang => lang === "pt" ? "en" : "pt")}
          >
            {language === "pt" ? "🇧🇷" : "🇺🇸"}
          </Button>
        </form>

        {searchResults?.books && searchResults.books.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Resultados da Busca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.books.map((book: Book) => (
                <Card key={book.google_books_id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-24 h-32 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-32 bg-muted flex items-center justify-center">
                          No cover
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        {book.publishedDate && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(book.publishedDate).getFullYear()}
                          </p>
                        )}
                        {book.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {book.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            onClick={() => addToReadingList(book)}
                            disabled={readingList?.some(
                              (item) => item.books.google_books_id === book.google_books_id
                            )}
                          >
                            {readingList?.some(
                              (item) => item.books.google_books_id === book.google_books_id
                            )
                              ? "Na lista"
                              : "Adicionar à lista"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {readingList && readingList.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Minha Lista de Leitura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingList.map((item) => {
                const book = item.books;
                return (
                  <Card key={item.book_id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-24 h-32 object-cover"
                          />
                        ) : (
                          <div className="w-24 h-32 bg-muted flex items-center justify-center">
                            No cover
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={item.status === "read"}
                              onCheckedChange={async () => {
                                const { error } = await supabase
                                  .from("reading_list")
                                  .update({
                                    status: item.status === "read" ? "to_read" : "read"
                                  })
                                  .eq("id", item.id);
                                
                                if (error) {
                                  toast.error("Erro ao atualizar status do livro");
                                  return;
                                }
                                
                                toast.success("Status do livro atualizado");
                                refetchReadingList();
                              }}
                            />
                            <span className="text-sm text-muted-foreground">Lido</span>
                          </div>
                          {item.status === "read" && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Avaliação:</span>
                              {renderStars(item.rating, item.id)}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="mt-2"
                            onClick={() => removeFromReadingList(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover da lista
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

