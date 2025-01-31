import { Calendar } from "@/components/ui/calendar";
import { NewEventDialog } from "./NewEventDialog";
import { EventFormData } from "../hooks/useEvents";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CalendarSectionProps = {
  onEventSubmit: (data: EventFormData) => void;
};

export const CalendarSection = ({ onEventSubmit }: CalendarSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure the date is set to noon to avoid timezone issues
      const adjustedDate = new Date(date);
      adjustedDate.setHours(12, 0, 0, 0);
      setSelectedDate(adjustedDate);
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