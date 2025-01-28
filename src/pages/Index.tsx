import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Volleyball, Newspaper } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface CustomNavButton {
  label: string;
  path: string;
}

interface DefaultButton {
  label: string;
  path: string;
  icon: any;
}

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
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [nextMatch, setNextMatch] = useState<string | null>(null);
  const [news, setNews] = useState<{ category: string; title: string }[]>([]);

  useEffect(() => {
    // Simulated data - in a real app, this would come from your backend
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
      toast.success("Botão reordenado com sucesso");
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
        <div className="flex flex-wrap gap-4 max-w-[1000px]">
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
          {/* Próximo Evento */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Próximo Evento
            </h3>
            {nextEvent && (
              <p className="text-sm">
                {nextEvent.title} - {nextEvent.date.toLocaleString()}
              </p>
            )}
          </Card>

          {/* Investimentos */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Investimentos
            </h3>
            <div className="space-y-2">
              {investments.map((inv, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{inv.name}</span>
                  <span className={inv.change >= 0 ? "text-green-500" : "text-red-500"}>
                    {inv.change}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Próximo Jogo */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Volleyball className="w-4 h-4" />
              Próximo Jogo
            </h3>
            <p className="text-sm">{nextMatch}</p>
          </Card>
        </div>

        {/* Notícias */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Últimas Notícias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item, i) => (
              <div key={i} className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
                <p className="text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;