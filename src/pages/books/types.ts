
export interface Book {
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
