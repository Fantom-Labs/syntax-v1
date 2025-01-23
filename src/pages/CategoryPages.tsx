import PageTemplate from "@/components/PageTemplate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddButton from "@/components/AddButton";

const TaskItem = ({ task }: { task: string }) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg mb-4">
    <Checkbox />
    <span>{task}</span>
  </div>
);

export const Tarefas = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  return (
    <PageTemplate title="Tarefas">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePreviousDay}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="text-xl font-medium"
            >
              {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </button>
            
            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AddButton />

          {calendarOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background border rounded-lg shadow-lg z-10">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                locale={ptBR}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <TaskItem task="Passear com Katana" />
          <TaskItem task="Passear com Katana" />
          <TaskItem task="Passear com Katana" />
        </div>
      </div>
    </PageTemplate>
  )
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