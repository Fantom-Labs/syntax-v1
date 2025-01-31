import * as z from "zod";
import { useEventQueries } from "./useEventQueries";
import { useEventMutations } from "./useEventMutations";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export type EventFormData = z.infer<typeof formSchema>;

export const useEvents = () => {
  const { data: events = [], isLoading } = useEventQueries();
  const { addEvent, editEvent, deleteEvent } = useEventMutations();

  return {
    events,
    isLoading,
    addEvent,
    editEvent,
    deleteEvent,
  };
};