import { Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NewsItem {
  category: string;
  title: string;
}

interface NewsDashboardProps {
  news: NewsItem[];
}

export const NewsDashboard = ({ news }: NewsDashboardProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Newspaper className="w-4 h-4" />
        Últimas Notícias
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, i) => (
          <div key={i} className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              {item.category}
            </span>
            <p className="text-sm">{item.title}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};