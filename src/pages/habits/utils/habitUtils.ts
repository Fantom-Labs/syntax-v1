
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

export const getConsecutiveDays = (habit: Habit): number => {
  // Ordena os checks por data, do mais recente para o mais antigo
  const sortedChecks = [...habit.checks]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  let consecutiveDays = 0;
  let previousDate: Date | null = null;

  for (const check of sortedChecks) {
    const currentDate = new Date(check.timestamp);
    
    // Se não estiver completo, para a contagem
    if (!check.completed) break;

    // Se é o primeiro check
    if (!previousDate) {
      consecutiveDays = 1;
      previousDate = currentDate;
      continue;
    }

    // Verifica se é o dia anterior
    const timeDiff = previousDate.getTime() - currentDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      consecutiveDays++;
      previousDate = currentDate;
    } else {
      break;
    }
  }

  return consecutiveDays;
};
