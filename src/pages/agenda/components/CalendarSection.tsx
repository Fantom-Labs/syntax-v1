import { Calendar } from "@/components/ui/calendar";
import { NewEventDialog } from "./NewEventDialog";
import { EventFormData } from "../hooks/useEvents";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startOfDay } from "date-fns";

type CalendarSectionProps = {
  onEventSubmit: (data: EventFormData) => void;
};

export const CalendarSection = ({ onEventSubmit }: CalendarSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfDay(new Date()));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const normalizedDate = startOfDay(date);
      setSelectedDate(normalizedDate);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-lg border bg-card"
      />
      <NewEventDialog 
        onSubmit={onEventSubmit} 
        selectedDate={selectedDate}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};