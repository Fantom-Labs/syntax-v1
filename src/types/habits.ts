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
  habit_id: string;
  date: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface HabitProgress {
  habitId: string;
  title: string;
  completionRate: number;
  history: HabitHistory[];
}