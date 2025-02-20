
import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Habit } from "@/types/habits";
import { HabitList } from "./HabitList";
import { DateNavigation } from "./DateNavigation";
import { HabitsDashboard } from "./HabitsDashboard";
import { AddHabitDialog } from "./components/AddHabitDialog";
import { useLoadHabits } from "./hooks/useLoadHabits";

export const HabitsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { habits, setHabits, userId } = useLoadHabits();

  const handleHabitAdded = (newHabit: Habit) => {
    setHabits([...habits, newHabit]);
  };

  if (!userId) {
    return (
      <PageTemplate title="Hábitos">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Crie sua conta e configure seus hábitos diários!
          </h2>
          <p className="text-muted-foreground text-center">
            Acompanhe seu progresso e desenvolva hábitos positivos.
          </p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Hábitos">
      <div className="grid gap-6">
        <div className="space-y-6 max-w-full">
          <DateNavigation date={date} setDate={setDate} />
          <HabitList habits={habits} setHabits={setHabits} date={date} />
          
          <div className="flex justify-center mt-4">
            <AddHabitDialog userId={userId} onHabitAdded={handleHabitAdded} />
          </div>

          <HabitsDashboard userId={userId} />
        </div>
      </div>
    </PageTemplate>
  );
};
