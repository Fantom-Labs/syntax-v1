
import { format, addDays, startOfDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = startOfDay(new Date());
  
  // Generate dates array (30 days before and after today)
  const dates = Array.from({ length: 61 }).map((_, index) => {
    return addDays(today, index - 30);
  });
  
  const dayName = format(date, 'EEE', { locale: ptBR });
  const dayNumber = format(date, 'd');

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
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-4">
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const currentDayName = format(currentDate, 'EEE', { locale: ptBR });
            const currentDayNumber = format(currentDate, 'd');
            
            return (
              <button
                key={index}
                onClick={() => setDate(currentDate)}
                className={`flex flex-col items-center p-2 rounded-full transition-colors min-w-[60px]
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                `}
              >
                <span className="text-sm font-medium">{currentDayName}</span>
                <span className="text-lg font-bold">{currentDayNumber}</span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
