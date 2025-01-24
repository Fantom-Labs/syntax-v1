import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

type EventFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

export const EventForm = ({ form, onSubmit }: EventFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Reunião, Consulta, etc..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes do evento..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  <span className="text-sm">
                    {field.value ? format(field.value, "dd/MM/yyyy") : "Selecione uma data"}
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="time" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Adicionar Evento</Button>
      </form>
    </Form>
  );
};