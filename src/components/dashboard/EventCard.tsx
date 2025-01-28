import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Event {
  title: string;
  date: Date;
}

interface EventCardProps {
  event: Event | null;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Próximo Evento
      </h3>
      {event && (
        <p className="text-sm">
          {event.title} - {event.date.toLocaleString()}
        </p>
      )}
    </Card>
  );
};