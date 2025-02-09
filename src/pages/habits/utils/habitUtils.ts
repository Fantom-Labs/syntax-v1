
import { Habit } from "@/types/habits";
import { format } from "date-fns";

export type CheckStatus = "unchecked" | "completed" | "failed";

export const getCheckStatus = (habit: Habit, date: string): CheckStatus => {
  const check = habit.checks.find(c => c.timestamp.startsWith(date));
  if (!check) return "unchecked";
  return check.completed ? "completed" : "failed";
};

export const getProgressText = (habit: Habit, date: Date, elapsedTimes: { [key: string]: number }, runningTimers: { [key: string]: number }) => {
  const todayCheck = habit.checks.find(c => c.timestamp.startsWith(format(date, "yyyy-MM-dd")));
  const habitId = habit.id;
  
  if (habit.tracking_type === 'task') {
    return todayCheck?.completed ? 'Concluído' : 'Não concluído';
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
