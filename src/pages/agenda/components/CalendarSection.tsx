import { Calendar } from "@/components/ui/calendar";
import { NewEventDialog } from "./NewEventDialog";
import { EventFormData } from "../hooks/useEvents";
import { useState } from "react";

type CalendarSectionProps = {
  onEventSubmit: (data: EventFormData) => void;
};

export const CalendarSection = ({ onEventSubmit }: CalendarSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-lg border bg-card"
      />
      <NewEventDialog onSubmit={onEventSubmit} selectedDate={selectedDate} />
    </div>
  );
};