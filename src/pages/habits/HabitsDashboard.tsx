
import { useEffect, useState } from "react";
import { HabitProgress } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";

interface HabitsDashboardProps {
  userId: string | undefined;
}

export const HabitsDashboard = ({ userId }: HabitsDashboardProps) => {
  const [progressData, setProgressData] = useState<HabitProgress[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchHabitProgress = async () => {
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId);

      if (habitsError) {
        console.error("Error fetching habits:", habitsError);
        return;
      }

      const { data: history, error: historyError } = await supabase
        .from("habit_history")
        .select("*")
        .eq("user_id", userId);

      if (historyError) {
        console.error("Error fetching habit history:", historyError);
        return;
      }

      const habitProgress: HabitProgress[] = [];
      setProgressData(habitProgress);
    };

    fetchHabitProgress();
  }, [userId]);

  return null;
};
