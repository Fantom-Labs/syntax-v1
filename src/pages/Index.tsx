import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Volleyball, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { NavButtons } from "@/components/dashboard/NavButtons";
import { EventCard } from "@/components/dashboard/EventCard";
import { InvestmentCard } from "@/components/dashboard/InvestmentCard";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { toast } from "sonner";

interface Event {
  title: string;
  date: Date;
}

interface Investment {
  name: string;
  value: number;
  change: number;
}

const Index = () => {
  const [buttons, setButtons] = useState([
    { label: "Tarefas", path: "/tarefas", icon: List },
    { label: "Agenda", path: "/agenda", icon: Calendar },
    { label: "Notas", path: "/notas", icon: Notebook },
    { label: "Hábitos", path: "/habitos", icon: Activity },
    { label: "Vasco", path: "/vasco", icon: Volleyball },
    { label: "Livros", path: "/livros", icon: BookOpen },
    { label: "Metas", path: "/metas", icon: Target },
    { label: "Compras", path: "/compras", icon: ShoppingCart },
    { label: "Investimentos", path: "/investimentos", icon: DollarSign },
    { label: "Físico", path: "/fisico", icon: User },
    { label: "Notícias", path: "/noticias", icon: Newspaper },
  ]);

  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [nextMatch, setNextMatch] = useState<string | null>(null);
  const [news, setNews] = useState<{ category: string; title: string }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    setNextEvent({
      title: "Reunião de projeto",
      date: new Date("2024-03-25 14:00"),
    });

    setInvestments([
      { name: "Bitcoin", value: 62000, change: 2.5 },
      { name: "PETR4", value: 38.42, change: -1.2 },
    ]);

    setNextMatch("Vasco x Fluminense - 24/03 16:00");

    setNews([
      { category: "Tecnologia", title: "Nova IA da OpenAI supera benchmarks" },
      { category: "Economia", title: "Bitcoin atinge nova máxima histórica" },
      { category: "Geopolítica", title: "Tensões aumentam no Oriente Médio" },
      { category: "João Pessoa", title: "Obras do BRT avançam na capital" },
      { category: "Brasil", title: "Nova política econômica é anunciada" },
    ]);
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;

    setButtons(currentButtons => {
      const newButtons = [...currentButtons];
      const [draggedButton] = newButtons.splice(draggedIndex, 1);
      newButtons.splice(dropIndex, 0, draggedButton);
      toast.success("Botão reordenado com sucesso");
      return newButtons;
    });

    setDraggedIndex(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12">
      <Header />
      <header className="mb-8 md:mb-16">
        <h1 className="text-4xl font-medium">
          Hello, <span className="name-underline">Múcio</span>.
        </h1>
      </header>

      <main className="space-y-8">
        <NavButtons 
          buttons={buttons}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventCard event={nextEvent} />
          <InvestmentCard investments={investments} />
          <MatchCard nextMatch={nextMatch} />
        </div>

        <NewsCard news={news} />
      </main>
    </div>
  );
};

export default Index;