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