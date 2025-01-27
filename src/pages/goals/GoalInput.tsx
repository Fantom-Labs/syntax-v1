import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal } from "@/types/goals";
import { toast } from "sonner";

interface GoalInputProps {
  onAddGoal: (title: string, period: Goal['period']) => void;
}

export const GoalInput = ({ onAddGoal }: GoalInputProps) => {
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<Goal['period']>("short");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Por favor, insira um título para a meta");
      return;
    }
    onAddGoal(title, period);
    setTitle("");
    toast.success("Meta adicionada com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Digite sua meta..."
        className="flex-1"
      />
      <Select value={period} onValueChange={(value: Goal['period']) => setPeriod(value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Selecione o prazo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Curto Prazo</SelectItem>
          <SelectItem value="medium">Médio Prazo</SelectItem>
          <SelectItem value="long">Longo Prazo</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Adicionar</Button>
    </form>
  );
};