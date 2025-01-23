import PageTemplate from "@/components/PageTemplate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const TaskItem = ({ task }: { task: string }) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg mb-4">
    <Checkbox />
    <span>{task}</span>
  </div>
);

export const Tarefas = () => (
  <PageTemplate title="Tarefas">
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <button className="p-2"><ChevronLeft /></button>
        <h2 className="text-xl">22 de janeiro, 2025</h2>
        <button className="p-2"><ChevronRight /></button>
      </div>
      
      <div className="space-y-4">
        <TaskItem task="Passear com Katana" />
        <TaskItem task="Passear com Katana" />
        <TaskItem task="Passear com Katana" />
      </div>
    </div>
  </PageTemplate>
};

export const Agenda = () => <PageTemplate title="Agenda" />;
export const Habitos = () => <PageTemplate title="Hábitos" />;
export const Conteudo = () => <PageTemplate title="Conteúdo" />;
export const Livros = () => <PageTemplate title="Livros" />;
export const Metas = () => <PageTemplate title="Metas" />;
export const Compras = () => <PageTemplate title="Compras" />;
export const Investimentos = () => <PageTemplate title="Investimentos" />;
export const Notas = () => <PageTemplate title="Notas" />;
export const Fisico = () => <PageTemplate title="Físico" />;
export const Alimentacao = () => <PageTemplate title="Alimentação" />;
