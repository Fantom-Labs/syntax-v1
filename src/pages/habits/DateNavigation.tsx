
import { Button } from "@/components/ui/button";
import { format, addDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  const today = new Date();
  const dates = Array.from({ length: 61 }, (_, i) => addDays(today, i - 30));
  
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
      
      <div className="relative w-full">
        <Carousel 
          opts={{
            align: "start",
            dragFree: true,
          }}
        >
          <CarouselContent>
            {dates.map((currentDate, index) => {
              const isSelected = format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
              const dayName = format(currentDate, 'EEE', { locale: ptBR });
              const dayNumber = format(currentDate, 'd');
              
              return (
                <CarouselItem key={index} className="basis-[70px]">
                  <button
                    onClick={() => setDate(currentDate)}
                    className={`flex flex-col items-center p-2 rounded-full transition-colors w-full
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                    `}
                  >
                    <span className="text-sm font-medium">{dayName}</span>
                    <span className="text-lg font-bold">{dayNumber}</span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
