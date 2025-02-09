
export type GoalPeriod = 'short' | 'medium' | 'long';

export interface Goal {
  id: string;
  title: string;
  period: GoalPeriod;
  completed: boolean;
}
