
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
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
      const today = new Date();
      const startDate = subDays(today, 30);

      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId);

      if (habitsError) {
        console.error("Error fetching habits:", habitsError);
        return;
      }

      const habitProgress: HabitProgress[] = [];

      for (const habit of habits) {
        const { data: history, error: historyError } = await supabase
          .from("habit_history")
          .select("*")
          .eq("habit_id", habit.id)
          .gte("date", startDate.toISOString())
          .order("date", { ascending: true });

        if (historyError) {
          console.error("Error fetching habit history:", historyError);
          continue;
        }

        const completedDays = history?.filter(h => h.completed).length || 0;
        const totalDays = history?.length || 1;
        const completionRate = (completedDays / totalDays) * 100;

        habitProgress.push({
          habitId: habit.id,
          title: habit.title,
          completionRate,
          history: history || []
        });
      }

      setProgressData(habitProgress);
    };

    fetchHabitProgress();
  }, [userId]);

  const chartConfig = {
    value: {
      theme: {
        light: "#0ea5e9",
        dark: "#38bdf8"
      }
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-semibold">Progresso dos Hábitos</h2>
      <div className="grid gap-6">
        {progressData.map((habit) => (
          <Card key={habit.habitId} className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{habit.title}</h3>
                <span className="text-sm text-muted-foreground">
                  Taxa de conclusão: {habit.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-[200px] w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={habit.history.map(h => ({
                        date: format(new Date(h.date), "dd/MM", { locale: ptBR }),
                        value: h.completed ? 100 : 0
                      }))}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tickMargin={10}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                            formatter={(value) => `${value}% concluído`}
                          />
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
