import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventForm } from "../EventForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { startOfDay } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

type NewEventDialogProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  selectedDate?: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NewEventDialog = ({ onSubmit, selectedDate, open, onOpenChange }: NewEventDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "12:00",
      date: selectedDate || startOfDay(new Date()),
    },
  });

  useEffect(() => {
    if (selectedDate) {
      form.setValue('date', startOfDay(selectedDate));
    }
  }, [selectedDate, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      date: startOfDay(data.date),
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2" />
          Novo Evento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Evento</DialogTitle>
        </DialogHeader>
        <EventForm form={form} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};