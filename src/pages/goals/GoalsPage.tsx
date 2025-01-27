import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { GoalList } from "./GoalList";
import { GoalInput } from "./GoalInput";
import { Goal } from "@/types/goals";

export const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (title: string, period: Goal['period']) => {
    const newGoal: Goal = {
      id: Date.now(),
      title,
      period,
      completed: false,
    };
    setGoals([...goals, newGoal]);
  };

  const toggleGoal = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <PageTemplate title="Metas">
      <div className="space-y-8">
        <GoalInput onAddGoal={addGoal} />
        
        <div className="grid gap-8 md:grid-cols-3">
          <GoalList
            title="Curto Prazo"
            goals={goals.filter(goal => goal.period === 'short')}
            onToggleGoal={toggleGoal}
            onRemoveGoal={removeGoal}
          />
          <GoalList
            title="Médio Prazo"
            goals={goals.filter(goal => goal.period === 'medium')}
            onToggleGoal={toggleGoal}
            onRemoveGoal={removeGoal}
          />
          <GoalList
            title="Longo Prazo"
            goals={goals.filter(goal => goal.period === 'long')}
            onToggleGoal={toggleGoal}
            onRemoveGoal={removeGoal}
          />
        </div>
      </div>
    </PageTemplate>
  );
};