import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Utensils, ArrowUpDown } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [isReordering, setIsReordering] = useState(false);

  const defaultButtons: DefaultButton[] = [
    { label: "Tarefas", path: "/tarefas", icon: List },
    { label: "Agenda", path: "/agenda", icon: Calendar },
    { label: "Notas", path: "/notas", icon: Notebook },
    { label: "Hábitos", path: "/habitos", icon: Activity },
    { label: "Conteúdo", path: "/conteudo", icon: BookOpen },
    { label: "Livros", path: "/livros", icon: BookOpen },
    { label: "Metas", path: "/metas", icon: Target },
    { label: "Compras", path: "/compras", icon: ShoppingCart },
    { label: "Investimentos", path: "/investimentos", icon: DollarSign },
    { label: "Físico", path: "/fisico", icon: User },
    { label: "Alimentação", path: "/alimentacao", icon: Utensils },
  ];

  useEffect(() => {
    const savedButtons = localStorage.getItem('customNavButtons');
    if (savedButtons) {
      setCustomButtons(JSON.parse(savedButtons));
    }
  }, []);

  const toggleReordering = () => {
    setIsReordering(!isReordering);
    if (isReordering) {
      toast.success("Modo de reordenação desativado");
    } else {
      toast.success("Clique nos botões para reordená-los");
    }
  };

  const handleReorder = (index: number) => {
    if (!isReordering) return;

    const newButtons = [...defaultButtons];
    if (index > 0) {
      [newButtons[index], newButtons[index - 1]] = [newButtons[index - 1], newButtons[index]];
      toast.success("Botão movido para a esquerda");
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12">
      <svg width="0" height="0">
        <defs>
          <filter id="curve">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="curve" />
          </filter>
        </defs>
      </svg>
      <Header />
      <header className="mb-16">
        <h1 className="text-4xl font-medium">
          Hello, <span className="name-underline">Múcio</span>.
        </h1>
      </header>

      <main>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleReordering}
            className={`w-12 h-12 rounded-full ${isReordering ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <ArrowUpDown className="w-6 h-6" />
          </Button>
          {defaultButtons.map((button, index) => (
            <NavButton
              key={index}
              to={button.path}
              icon={button.icon}
              label={button.label}
              onClick={() => handleReorder(index)}
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
      </main>
    </div>
  );
};

export default Index;