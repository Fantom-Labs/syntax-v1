import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Volleyball, Newspaper } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { EventsDashboard } from "@/components/dashboard/EventsDashboard";
import { InvestmentsDashboard } from "@/components/dashboard/InvestmentsDashboard";
import { VascoMatchDashboard } from "@/components/dashboard/VascoMatchDashboard";
import { NewsDashboard } from "@/components/dashboard/NewsDashboard";

interface CustomNavButton {
  label: string;
  path: string;
}

interface DefaultButton {
  label: string;
  path: string;
  icon: any;
}

const Index = () => {
  const [customButtons, setCustomButtons] = useState<CustomNavButton[]>([]);
  const [buttons, setButtons] = useState<DefaultButton[]>([
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
  const [investments, setInvestments] = useState([]);
  const [nextMatch, setNextMatch] = useState<string | null>(null);
  const [news, setNews] = useState([]);

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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
      return newButtons;
    });
    setDraggedIndex(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12">
      <svg width="0" height="0">
        <defs>
          <filter id="curve">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="curve" />
          </filter>
        </defs>
      </svg>
      <Header />
      <header className="mb-8 md:mb-16">
        <h1 className="text-4xl font-medium">
          Hello, <span className="name-underline">Múcio</span>.
        </h1>
      </header>

      <main className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[1000px]">
          {buttons.map((button, index) => (
            <NavButton
              key={index}
              to={button.path}
              icon={button.icon}
              label={button.label}
              index={index}
              onDragStart={handleDragStart}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            />
          ))}
          {customButtons.map((button, index) => (
            <NavButton
              key={`custom-${index}`}
              to={button.path}
              icon={List}
              label={button.label}
            />
          ))}
          <AddButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventsDashboard nextEvent={nextEvent} />
          <InvestmentsDashboard investments={investments} />
          <VascoMatchDashboard nextMatch={nextMatch} />
        </div>

        <NewsDashboard news={news} />
      </main>
    </div>
  );
};

export default Index;
