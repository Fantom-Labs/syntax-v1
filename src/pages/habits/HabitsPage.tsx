

import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Habit } from "@/types/habits";
import { HabitList } from "./HabitList";
import { DateNavigation } from "./DateNavigation";
import { HabitsDashboard } from "./HabitsDashboard";
import { AddHabitDialog } from "./components/AddHabitDialog";
import { useLoadHabits } from "./hooks/useLoadHabits";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export const HabitsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { habits, setHabits, userId } = useLoadHabits();
  const { isSupported, permissionGranted, requestPermission } = useNotifications(habits);

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
          <div className="flex items-center justify-between">
            <DateNavigation date={date} setDate={setDate} />
            
            {isSupported && !permissionGranted && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestPermission}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Ativar notificações
              </Button>
            )}
          </div>
          
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

