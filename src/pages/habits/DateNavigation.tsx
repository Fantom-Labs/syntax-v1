
import { Button } from "@/components/ui/button";
import { format, addDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = new Date();
  // Generate dates for the current month
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  
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
      
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 w-full min-w-max px-1">
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR }).toLowerCase();
            const dayNumber = format(currentDate, 'd');
            
            return (
              <div
                key={index}
                className="flex flex-col items-center"
              >
                <span className="text-sm text-muted-foreground mb-2">{dayName}</span>
                <button
                  onClick={() => setDate(currentDate)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                  `}
                >
                  <span className="text-sm font-medium">{dayNumber}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
