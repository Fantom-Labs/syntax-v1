import { useState } from "react";
import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Newspaper } from "lucide-react";
import { NavButtons } from "./NavButtons";
import { toast } from "sonner";

export const DashboardNavigation = () => {
  const [buttons, setButtons] = useState([
    { label: "Tarefas", path: "/tarefas", icon: List },
    { label: "Agenda", path: "/agenda", icon: Calendar },
    { label: "Notas", path: "/notas", icon: Notebook },
    { label: "Hábitos", path: "/habitos", icon: Activity },
    { label: "Livros", path: "/livros", icon: BookOpen },
    { label: "Metas", path: "/metas", icon: Target },
    { label: "Compras", path: "/compras", icon: ShoppingCart },
    { label: "Investimentos", path: "/investimentos", icon: DollarSign },
    { label: "Físico", path: "/fisico", icon: User },
    { label: "Notícias", path: "/noticias", icon: Newspaper },
  ]);

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
    <NavButtons 
      buttons={buttons}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
    />
  );
};