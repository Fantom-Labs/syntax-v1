
import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { BookSearchForm } from "./components/BookSearchForm";
import { BookCard } from "./components/BookCard";
import { useBooks } from "./hooks/useBooks";

export const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "pt">("pt");

  const {
    readingList,
    searchResults,
    suggestions,
    searchBooks,
    addToReadingList,
    removeFromReadingList,
    updateStatus,
    updateRating,
  } = useBooks(searchQuery, language);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchBooks();
  };

  return (
    <PageTemplate title="Livros">
      <div className="space-y-8">
        <BookSearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          language={language}
          setLanguage={setLanguage}
          suggestions={suggestions}
          onSearch={handleSearch}
          onBookSelect={addToReadingList}
        />

        {searchResults?.books && searchResults.books.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Resultados da Busca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.books.map((book) => (
                <BookCard
                  key={book.google_books_id}
                  book={book}
                  onAddToList={() => addToReadingList(book)}
                  isInReadingList={readingList?.some(
                    (item) => item.books.google_books_id === book.google_books_id
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {readingList && readingList.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Minha Lista de Leitura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingList.map((item) => (
                <BookCard
                  key={item.book_id}
                  book={item.books}
                  readingListItem={{
                    id: item.id,
                    status: item.status,
                    rating: item.rating,
                  }}
                  onRemoveFromList={removeFromReadingList}
                  onStatusChange={updateStatus}
                  onRatingChange={updateRating}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};
