
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const currentDate = addDays(weekStart, index);
    const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEE', { locale: ptBR });
    const dayNumber = format(currentDate, 'd');
    
    return (
      <button
        key={index}
        onClick={() => setDate(currentDate)}
        className={`flex flex-col items-center p-2 rounded-full transition-colors
          ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
        `}
      >
        <span className="text-sm font-medium">{dayName}</span>
        <span className="text-lg font-bold">{dayNumber}</span>
      </button>
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium">
          {format(date, "MMMM yyyy", { locale: ptBR })}
        </span>
        {isToday(date) ? null : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date())}
          >
            Hoje
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setDate(subDays(date, 1))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center justify-between gap-2 flex-1">
          {weekDays}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setDate(addDays(date, 1))}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
