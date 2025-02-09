
import { Button } from "@/components/ui/button";
import { format, addDays, isToday, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  // Generate 30 days (14 before and after today)
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i - 14));
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Adjust this value to control scroll distance
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-2 py-2 px-8 no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((currentDate, index) => {
            const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const dayName = format(currentDate, 'EEE', { locale: ptBR });
            const dayNumber = format(currentDate, 'd');
            
            return (
              <button
                key={index}
                onClick={() => setDate(currentDate)}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors min-w-[80px] snap-start
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
