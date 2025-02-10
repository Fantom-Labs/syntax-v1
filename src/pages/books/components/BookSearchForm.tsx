
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Book } from "../types";

interface BookSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: "en" | "pt";
  setLanguage: (lang: "en" | "pt") => void;
  suggestions?: { books: Book[] };
  onSearch: (e: React.FormEvent) => void;
  onBookSelect: (book: Book) => void;
}

export const BookSearchForm = ({
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
  suggestions,
  onSearch,
  onBookSelect,
}: BookSearchFormProps) => {
  return (
    <form onSubmit={onSearch} className="flex gap-4">
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
                        onBookSelect(book);
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
        onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      >
        {language === "pt" ? "🇧🇷" : "🇺🇸"}
      </Button>
    </form>
  );
};
