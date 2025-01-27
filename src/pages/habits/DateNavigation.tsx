import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  return (
    <div className="flex items-center justify-between mb-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setDate(subWeeks(date, 1))}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <span className="font-medium text-center flex-1">
        {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setDate(addWeeks(date, 1))}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};