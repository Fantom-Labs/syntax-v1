import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CustomNavButton {
  label: string;
  path: string;
}

const AddButton = () => {
  const [newButtons, setNewButtons] = useState<CustomNavButton[]>(() => {
    const saved = localStorage.getItem('customNavButtons');
    return saved ? JSON.parse(saved) : [];
  });
  const [newLabel, setNewLabel] = useState('');

  const handleAddButton = () => {
    if (!newLabel.trim()) {
      toast.error("Por favor, insira um nome para o botão");
      return;
    }

    const path = `/${newLabel.toLowerCase().replace(/\s+/g, '-')}`;
    const newButton = { label: newLabel, path };
    
    const updatedButtons = [...newButtons, newButton];
    setNewButtons(updatedButtons);
    localStorage.setItem('customNavButtons', JSON.stringify(updatedButtons));
    
    toast.success("Botão adicionado com sucesso!");
    setNewLabel('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Botão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Nome do botão"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Button onClick={handleAddButton} className="w-full">
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddButton;