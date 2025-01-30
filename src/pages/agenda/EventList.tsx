import { format } from "date-fns";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

type Event = z.infer<typeof formSchema>;

type EventListProps = {
  events: Event[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Omit<Event, 'id'>) => void;
};

export const EventList = ({ events, onDelete, onEdit }: EventListProps) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-medium mb-4">Eventos</h2>
      <div className="space-y-4">
        {events.map((event) => {
          const form = useForm<z.infer<typeof formSchema>>({
            defaultValues: {
              title: event.title,
              description: event.description || "",
              date: event.date,
              time: event.time,
            },
          });

          return (
            <div
              key={event.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <time className="text-sm text-muted-foreground">
                    {format(event.date, "dd/MM/yyyy")} às {event.time}
                  </time>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Evento</DialogTitle>
                      </DialogHeader>
                      <EventForm
                        form={form}
                        onSubmit={(data) => onEdit(event.id, data)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(event.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum evento cadastrado
          </p>
        )}
      </div>
    </div>
  );
};