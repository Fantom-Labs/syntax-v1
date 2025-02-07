
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEventQueries } from "@/pages/agenda/hooks/useEventQueries";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const EventCard = () => {
  const { data: events = [], isLoading } = useEventQueries();

  // Get the next event (closest to current date)
  const nextEvent = events.length > 0 
    ? events.reduce((closest, current) => {
        const closestDate = new Date(closest.date);
        const currentDate = new Date(current.date);
        const now = new Date();

        // Only consider future events
        if (currentDate < now) return closest;
        if (closestDate < now) return current;

        return currentDate < closestDate ? current : closest;
      }, events[0])
    : null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Próximo Evento
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando eventos...</p>
      ) : nextEvent ? (
        <p className="text-sm">
          {nextEvent.title} - {format(new Date(nextEvent.date), "PPP", { locale: ptBR })} às {nextEvent.time}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum evento agendado
        </p>
      )}
    </Card>
  );
};
