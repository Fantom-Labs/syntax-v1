import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Event } from "@/types/events";

interface EventsDashboardProps {
  nextEvent: Event | null;
}

export const EventsDashboard = ({ nextEvent }: EventsDashboardProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Próximo Evento
      </h3>
      {nextEvent && (
        <p className="text-sm">
          {nextEvent.title} - {nextEvent.date.toLocaleString()}
        </p>
      )}
    </Card>
  );
};