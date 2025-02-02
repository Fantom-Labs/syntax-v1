import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";
import PageTemplate from "@/components/PageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);

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
          book_id,
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
      setOpen(false);
      refetchReadingList();
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
          <div className="flex-1">
            <Popover open={open}>
              <PopoverTrigger asChild>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar livros..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOpen(e.target.value.length >= 2);
                    }}
                    className="w-full"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>Nenhum livro encontrado.</CommandEmpty>
                    <CommandGroup heading="Sugestões">
                      {suggestions?.books?.map((book: Book) => (
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
              </PopoverContent>
            </Popover>
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
                          {readingList?.some(
                            (item) => item.books.google_books_id === book.google_books_id
                          ) && (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={readingList.find(
                                  (item) => item.books.google_books_id === book.google_books_id
                                )?.status === "read"}
                                onChange={async () => {
                                  const item = readingList.find(
                                    (item) => item.books.google_books_id === book.google_books_id
                                  );
                                  if (item) {
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
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="text-sm text-muted-foreground">Lido</span>
                            </div>
                          )}
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
