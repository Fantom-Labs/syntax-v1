
import { useEffect, useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { GoalList } from "./GoalList";
import { GoalInput } from "./GoalInput";
import { Goal } from "@/types/goals";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const GoalsPage = () => {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Erro ao carregar metas");
        throw error;
      }
      
      return data.map(goal => ({
        id: goal.id,
        title: goal.title,
        period: goal.period,
        completed: goal.completed || false,
      }));
    },
  });

  const addGoalMutation = useMutation({
    mutationFn: async ({ title, period }: { title: string, period: Goal['period'] }) => {
      const { data, error } = await supabase
        .from('goals')
        .insert([{ title, period }])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao adicionar meta");
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Meta adicionada com sucesso!");
    },
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string, completed: boolean }) => {
      const { error } = await supabase
        .from('goals')
        .update({ completed })
        .eq('id', id);

      if (error) {
        toast.error("Erro ao atualizar meta");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const removeGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Erro ao remover meta");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Meta removida com sucesso!");
    },
  });

  const addGoal = (title: string, period: Goal['period']) => {
    addGoalMutation.mutate({ title, period });
  };

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      toggleGoalMutation.mutate({ id, completed: !goal.completed });
    }
  };

  const removeGoal = (id: string) => {
    removeGoalMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <PageTemplate title="Metas">
        <div>Carregando...</div>
      </PageTemplate>
    );
  }

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
