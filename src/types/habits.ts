
export type HabitType = 'build' | 'quit';
export type TrackingType = 'task';

export interface HabitCheck {
  timestamp: string;
  completed: boolean;
  failed?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  tracking_type: TrackingType;
  emoji?: string;
  color?: string;
  repeat_days?: string[];
  checksPerDay: number;
  checks: HabitCheck[];
  notification_enabled?: boolean;
  notification_time?: string;
}

export interface HabitHistory {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  failed?: boolean;
  created_at: string;
  user_id: string;
}

export interface HabitProgress {
  habitId: string;
  title: string;
  completionRate: number;
  history: HabitHistory[];
}
