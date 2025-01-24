import { List, Calendar, Activity, BookOpen, Target, ShoppingCart, DollarSign, Notebook, User, Utensils } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

interface CustomNavButton {
  label: string;
  path: string;
}

const Index = () => {
  const [customButtons, setCustomButtons] = useState<CustomNavButton[]>([]);

  useEffect(() => {
    const savedButtons = localStorage.getItem('customNavButtons');
    if (savedButtons) {
      setCustomButtons(JSON.parse(savedButtons));
    }
  }, []);

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
          <NavButton to="/tarefas" icon={List} label="Tarefas" />
          <NavButton to="/agenda" icon={Calendar} label="Agenda" />
          <NavButton to="/habitos" icon={Activity} label="Hábitos" />
          <NavButton to="/conteudo" icon={BookOpen} label="Conteúdo" />
          <NavButton to="/livros" icon={BookOpen} label="Livros" />
          <NavButton to="/metas" icon={Target} label="Metas" />
          <NavButton to="/compras" icon={ShoppingCart} label="Compras" />
          <NavButton to="/investimentos" icon={DollarSign} label="Investimentos" />
          <NavButton to="/notas" icon={Notebook} label="Notas" />
          <NavButton to="/fisico" icon={User} label="Físico" />
          <NavButton to="/alimentacao" icon={Utensils} label="Alimentação" />
          {customButtons.map((button, index) => (
            <NavButton
              key={index}
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