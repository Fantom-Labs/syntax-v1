import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { EventList } from "./EventList";
import { EventForm } from "./EventForm";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export const AgendaPage = () => {
  const [date, setDate] = useState<Date>();
  const [events, setEvents] = useState<z.infer<typeof formSchema>[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "12:00",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setEvents((prev) => [...prev, data]);
    toast({
      title: "Evento adicionado com sucesso!",
      description: `${data.title} - ${format(data.date, "dd/MM/yyyy")}`,
    });
    form.reset();
  };

  return (
    <PageTemplate title="Agenda">
      <div className="grid gap-6 md:grid-cols-[350px,1fr]">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate) {
                form.setValue('date', newDate);
              }
            }}
            className="rounded-lg border bg-card"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-[#7BFF8B] via-[#F6FF71] to-[#B259FF] hover:opacity-90 text-black">
                <Plus className="mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Evento</DialogTitle>
              </DialogHeader>
              <EventForm form={form} onSubmit={onSubmit} />
            </DialogContent>
          </Dialog>
        </div>
        <EventList events={events} setEvents={setEvents} />
      </div>
    </PageTemplate>
  );
};