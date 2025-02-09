
import { Button } from "@/components/ui/button";
import { format, addDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = new Date();
  // Increase the number of dates to allow for more scrolling
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i - 14));
  
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
      
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-2 overflow-x-auto px-1 py-2 no-scrollbar snap-x snap-mandatory">
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR });
            const dayNumber = format(currentDate, 'd');
            
            return (
              <button
                key={index}
                onClick={() => setDate(currentDate)}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors shrink-0 w-[70px] snap-start
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                `}
              >
                <span className="text-sm font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNumber}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

