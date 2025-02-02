export interface HabitCheck {
  timestamp: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  icon: JSX.Element;
  checksPerDay: number;
  checks: HabitCheck[];
}

export interface HabitHistory {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitProgress {
  habitId: string;
  title: string;
  completionRate: number;
  history: HabitHistory[];
}