
import { Habit } from "@/types/habits";
import { format } from "date-fns";

export type CheckStatus = "unchecked" | "completed" | "failed";

export const getCheckStatus = (habit: Habit, date: string): CheckStatus => {
  const check = habit.checks.find(c => c.timestamp === `${date}T00:00:00.000Z`);
  if (!check) return "unchecked";
  if (check.completed) return "completed";
  if (check.failed) return "failed";
  return "unchecked";
};

export const getProgressText = (habit: Habit, date: Date, elapsedTimes: { [key: string]: number }, runningTimers: { [key: string]: number }) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const todayCheck = habit.checks.find(c => c.timestamp === `${formattedDate}T00:00:00.000Z`);
  const habitId = habit.id;
  
  if (habit.tracking_type === 'task') {
    const status = getCheckStatus(habit, format(date, "yyyy-MM-dd"));
    if (status === "completed") return "Concluído";
    if (status === "failed") return "Não concluído";
    return "Pendente";
  } else if (habit.tracking_type === 'amount') {
    const current = todayCheck?.amount || 0;
    return `${current}/${habit.amount_target} ${habit.title.toLowerCase()}`;
  } else if (habit.tracking_type === 'time') {
    const current = todayCheck?.time || 0;
    const running = runningTimers[habitId];
    const elapsed = running ? (current + (elapsedTimes[habitId] || 0)) : current;
    return `${elapsed}min/${habit.time_target}min`;
  }
};
