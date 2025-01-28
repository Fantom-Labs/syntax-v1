import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Utensils, Volleyball } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
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
    { label: "Alimentação", path: "/alimentacao", icon: Utensils },
  ]);

  useEffect(() => {
    const savedButtons = localStorage.getItem('customNavButtons');
    if (savedButtons) {
      setCustomButtons(JSON.parse(savedButtons));
    }
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
      </main>
    </div>
  );
};

export default Index;