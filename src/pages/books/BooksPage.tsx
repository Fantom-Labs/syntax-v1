import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";
import PageTemplate from "@/components/PageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  language: string;
}

export const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "pt">("pt");

  const { data: readingList } = useQuery({
    queryKey: ["reading-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_list")
        .select(`
          book_id,
          books (
            id,
            title,
            author,
            cover_url,
            language
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: searchResults, refetch: searchBooks } = useQuery({
    queryKey: ["search-books", searchQuery, language],
    queryFn: async () => {
      if (!searchQuery) return { books: [] };
      
      const { data, error } = await supabase.functions.invoke("search-books", {
        body: { query: searchQuery, language },
      });

      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  const addToReadingList = async (book: Book) => {
    try {
      // First, ensure the book exists in our database
      const { data: existingBook } = await supabase
        .from("books")
        .select("id")
        .eq("id", book.id)
        .single();

      if (!existingBook) {
        await supabase.from("books").insert([book]);
      }

      // Add to reading list
      const { error } = await supabase.from("reading_list").insert([
        {
          book_id: book.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) throw error;
      toast.success("Livro adicionado à lista de leitura!");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Erro ao adicionar livro à lista");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchBooks();
  };

  return (
    <PageTemplate title="Livros">
      <div className="space-y-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="text"
            placeholder="Buscar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
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
                <Card key={book.id} className="overflow-hidden">
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
                        <Button
                          size="sm"
                          onClick={() => addToReadingList(book)}
                          disabled={readingList?.some(
                            (item) => item.book_id === book.id
                          )}
                        >
                          {readingList?.some((item) => item.book_id === book.id)
                            ? "Na lista"
                            : "Adicionar à lista"}
                        </Button>
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