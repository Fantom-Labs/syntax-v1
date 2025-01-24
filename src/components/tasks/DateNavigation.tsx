import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateNavigationProps {
  date: Date;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const DateNavigation = ({ date, onNavigate }: DateNavigationProps) => {
  // Ensure we have a valid date object
  const safeDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="icon" onClick={() => onNavigate('prev')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium">
        {format(safeDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={() => onNavigate('next')}>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};