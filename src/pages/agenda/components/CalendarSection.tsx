import { Calendar } from "@/components/ui/calendar";
import { NewEventDialog } from "./NewEventDialog";
import { EventFormData } from "../hooks/useEvents";

type CalendarSectionProps = {
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onEventSubmit: (data: EventFormData) => void;
};

export const CalendarSection = ({ date, onDateSelect, onEventSubmit }: CalendarSectionProps) => {
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateSelect}
        className="rounded-lg border bg-card"
      />
      <NewEventDialog onSubmit={onEventSubmit} selectedDate={date} />
    </div>
  );
};