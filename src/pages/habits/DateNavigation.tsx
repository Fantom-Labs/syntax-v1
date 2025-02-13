
import { Button } from "@/components/ui/button";
import { format, addDays, subDays, subWeeks, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = new Date();
  const minDate = subWeeks(today, 6); // 6 semanas atrás
  const dates = Array.from({ length: 5 }, (_, i) => addDays(date, i - 2));
  
  const handlePrevDay = () => {
    const newDate = subDays(date, 1);
    if (newDate >= minDate) {
      setDate(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = addDays(date, 1);
    if (newDate <= today) {
      setDate(newDate);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium">
          {format(date, "MMMM yyyy", { locale: ptBR })}
        </span>
        {!isToday(date) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date())}
          >
            Hoje
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevDay}
          disabled={date <= minDate}
          className="shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex justify-between gap-2 w-full">
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR });
            const dayNumber = format(currentDate, 'd');
            const isDisabled = currentDate > today || currentDate < minDate;
            
            return (
              <button
                key={index}
                onClick={() => !isDisabled && setDate(currentDate)}
                disabled={isDisabled}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors flex-1
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                `}
              >
                <span className="text-sm font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNumber}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextDay}
          disabled={date >= today}
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
