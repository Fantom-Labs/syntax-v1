
export type HabitType = 'build' | 'quit';
export type TrackingType = 'task' | 'amount' | 'time';

export interface HabitCheck {
  timestamp: string;
  completed: boolean;
  failed?: boolean;
  amount?: number;
  time?: number;
}

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  tracking_type: TrackingType;
  emoji?: string;
  color?: string;
  amount_target?: number;
  time_target?: number;
  repeat_days?: string[];
  checksPerDay: number;
  checks: HabitCheck[];
}

export interface HabitHistory {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  failed?: boolean;
  amount?: number;
  time?: number;
  created_at: string;
  user_id: string;
}

export interface HabitProgress {
  habitId: string;
  title: string;
  completionRate: number;
  history: HabitHistory[];
}
