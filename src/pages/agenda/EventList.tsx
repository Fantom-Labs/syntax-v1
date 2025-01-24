import { format } from "date-fns";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

type EventListProps = {
  events: z.infer<typeof formSchema>[];
};

export const EventList = ({ events }: EventListProps) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-medium mb-4">Eventos</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-gradient-to-r from-[#7BFF8B]/10 via-[#F6FF71]/10 to-[#DE7CFF]/10 hover:from-[#7BFF8B]/20 hover:via-[#F6FF71]/20 hover:to-[#DE7CFF]/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{event.title}</h3>
              <time className="text-sm text-muted-foreground">
                {format(event.date, "dd/MM/yyyy")} às {event.time}
              </time>
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum evento cadastrado
          </p>
        )}
      </div>
    </div>
  );
};