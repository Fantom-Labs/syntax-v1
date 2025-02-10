
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEventQueries } from "@/pages/agenda/hooks/useEventQueries";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const EventCard = () => {
  const { data: events = [], isLoading } = useEventQueries();

  // Get up to 3 upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Próximos Eventos
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando eventos...</p>
      ) : upcomingEvents.length > 0 ? (
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <p key={event.id} className="text-sm">
              {event.title} - {format(new Date(event.date), "PPP", { locale: ptBR })} às {event.time}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum evento agendado
        </p>
      )}
    </Card>
  );
};
