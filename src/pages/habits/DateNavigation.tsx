
import { Button } from "@/components/ui/button";
import { format, addDays, startOfDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());
  
  // Generate dates for 30 days in the past and 30 days in the future
  const dates = Array.from({ length: 61 }).map((_, index) => {
    return addDays(today, index - 30);
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
      
      <ScrollArea className="w-full" orientation="horizontal">
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 pb-4 px-2 min-w-full"
        >
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR });
            const dayNumber = format(currentDate, 'd');
            
            return (
              <button
                key={index}
                onClick={() => setDate(currentDate)}
                className={`flex-none flex flex-col items-center p-2 rounded-full transition-colors
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                `}
              >
                <span className="text-sm font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNumber}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
