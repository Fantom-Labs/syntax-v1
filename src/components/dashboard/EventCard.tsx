
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
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Próximos Eventos
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando eventos...</p>
      ) : upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="p-3 bg-muted/50">
              <h4 className="font-medium mb-1">{event.title}</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.date), "PPP", { locale: ptBR })} às {event.time}
              </p>
              {event.description && (
                <p className="text-sm mt-2 text-muted-foreground">{event.description}</p>
              )}
            </Card>
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
