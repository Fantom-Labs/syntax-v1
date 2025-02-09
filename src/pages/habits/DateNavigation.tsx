
import { Button } from "@/components/ui/button";
import { format, addDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = new Date();
  // Generate 30 days (15 before and 14 after today)
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i - 15));
  
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
      
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR });
            const dayNumber = format(currentDate, 'd');
            
            return (
              <button
                key={index}
                onClick={() => setDate(currentDate)}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors min-w-[70px]
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
