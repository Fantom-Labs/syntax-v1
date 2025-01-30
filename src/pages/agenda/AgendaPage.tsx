import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { EventList } from "./EventList";
import { CalendarSection } from "./components/CalendarSection";
import { useEvents } from "./hooks/useEvents";

export const AgendaPage = () => {
  const [date, setDate] = useState<Date>();
  const { events, isLoading, addEvent, editEvent, deleteEvent } = useEvents();

  return (
    <PageTemplate title="Agenda">
      <div className="grid gap-6 md:grid-cols-[350px,1fr]">
        <CalendarSection
          date={date}
          onDateSelect={setDate}
          onEventSubmit={(data) => {
            addEvent.mutate(data);
          }}
        />
        <EventList 
          events={events} 
          onDelete={(id) => deleteEvent.mutate(id)} 
          onEdit={(id, data) => editEvent.mutate({ id, data })}
        />
      </div>
    </PageTemplate>
  );
};