
import { Star, StarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "../types";

interface BookCardProps {
  book: Book;
  onAddToList?: () => void;
  isInReadingList?: boolean;
  readingListItem?: {
    id: string;
    status: string;
    rating: number | null;
  };
  onRemoveFromList?: (id: string) => void;
  onStatusChange?: (id: string, status: "read" | "to_read") => void;
  onRatingChange?: (id: string, rating: number | null) => void;
}

export const BookCard = ({
  book,
  onAddToList,
  isInReadingList,
  readingListItem,
  onRemoveFromList,
  onStatusChange,
  onRatingChange,
}: BookCardProps) => {
  const renderStars = (rating: number | null, id: string) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange?.(id, star === rating ? null : star)}
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
    <Card className="overflow-hidden">
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
            {readingListItem ? (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveFromList?.(readingListItem.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={readingListItem.status === "read"}
                    onCheckedChange={() => {
                      onStatusChange?.(
                        readingListItem.id,
                        readingListItem.status === "read" ? "to_read" : "read"
                      );
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Lido</span>
                </div>
                {readingListItem.status === "read" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Avaliação:</span>
                    {renderStars(readingListItem.rating, readingListItem.id)}
                  </div>
                )}
              </>
            ) : (
              <>
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
                    onClick={onAddToList}
                    disabled={isInReadingList}
                  >
                    {isInReadingList ? "Na lista" : "Adicionar à lista"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
