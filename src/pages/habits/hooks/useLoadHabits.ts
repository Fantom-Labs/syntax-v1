
import { useState, useEffect } from "react";
import { Habit, HabitType, TrackingType } from "@/types/habits";
import { supabase } from "@/integrations/supabase/client";

export const useLoadHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const loadHabits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      if (user?.id) {
        const { data: habits, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .order('order', { ascending: true });

        if (error) {
          console.error("Error fetching habits:", error);
          return;
        }

        // Busca o histórico dos últimos 42 dias (6 semanas)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 42);
        const formattedStartDate = startDate.toISOString().split('T')[0];

        const { data: history, error: historyError } = await supabase
          .from("habit_history")
          .select("*")
          .eq("user_id", user.id)
          .gte('date', formattedStartDate);

        if (historyError) {
          console.error("Error fetching habit history:", historyError);
          return;
        }

        // Criar um Map de habits para evitar duplicatas
        const habitsMap = new Map();
        habits.forEach(habit => {
          const habitChecks = history
            ?.filter(h => h.habit_id === habit.id)
            .map(h => ({
              timestamp: `${h.date}T00:00:00.000Z`,
              completed: h.completed,
              failed: h.failed || false
            })) || [];

          habitsMap.set(habit.id, {
            id: habit.id,
            title: habit.title,
            type: habit.type as HabitType,
            tracking_type: "task" as TrackingType,
            emoji: habit.emoji,
            color: habit.color,
            repeat_days: habit.repeat_days,
            checksPerDay: habit.checks_per_day || 1,
            checks: habitChecks,
            notification_enabled: habit.notification_enabled,
            notification_time: habit.notification_time
          });
        });

        // Converter o Map para array
        const uniqueHabits = Array.from(habitsMap.values());
        setHabits(uniqueHabits);
      }
    };

    loadHabits();
  }, []);

  return { habits, setHabits, userId };
};
