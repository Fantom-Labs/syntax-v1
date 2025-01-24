import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateNavigationProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateNavigation = ({ date, setDate }: DateNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="icon" onClick={() => setDate(subDays(date, 1))}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium">
        {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};