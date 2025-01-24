import { format } from "date-fns";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

type EventListProps = {
  events: z.infer<typeof formSchema>[];
  setEvents?: React.Dispatch<React.SetStateAction<z.infer<typeof formSchema>[]>>;
};

export const EventList = ({ events, setEvents }: EventListProps) => {
  const { toast } = useToast();

  const handleDelete = (index: number) => {
    if (setEvents) {
      setEvents(currentEvents => currentEvents.filter((_, i) => i !== index));
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso.",
      });
    }
  };

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
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <time className="text-sm text-muted-foreground">
                  {format(event.date, "dd/MM/yyyy")} às {event.time}
                </time>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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