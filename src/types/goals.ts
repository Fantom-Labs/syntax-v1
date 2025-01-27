export type GoalPeriod = 'short' | 'medium' | 'long';

export interface Goal {
  id: number;
  title: string;
  period: GoalPeriod;
  completed: boolean;
}