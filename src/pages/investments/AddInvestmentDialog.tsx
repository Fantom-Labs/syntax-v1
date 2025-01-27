import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Investment } from "@/types/investments";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddInvestmentDialogProps {
  onAdd: (investment: Investment) => void;
}

export const AddInvestmentDialog = ({ onAdd }: AddInvestmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [investment, setInvestment] = useState<Partial<Investment>>({
    type: "stocks",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !investment.name ||
      !investment.symbol ||
      !investment.quantity ||
      !investment.purchasePrice ||
      !investment.type
    )
      return;

    onAdd({
      ...investment,
      id: crypto.randomUUID(),
      totalInvested: investment.quantity * investment.purchasePrice * 5, // Simple BRL conversion
    } as Investment);
    setOpen(false);
    setInvestment({ type: "stocks" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Investimento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Investimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={investment.name || ""}
              onChange={(e) =>
                setInvestment({ ...investment, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symbol">Símbolo</Label>
            <Input
              id="symbol"
              value={investment.symbol || ""}
              onChange={(e) =>
                setInvestment({ ...investment, symbol: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={investment.type}
              onValueChange={(value: Investment["type"]) =>
                setInvestment({ ...investment, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Ações</SelectItem>
                <SelectItem value="crypto">Cripto</SelectItem>
                <SelectItem value="funds">Fundos</SelectItem>
                <SelectItem value="fixed_income">Renda Fixa</SelectItem>
                <SelectItem value="real_estate">Imóveis</SelectItem>
                <SelectItem value="others">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={investment.quantity || ""}
              onChange={(e) =>
                setInvestment({
                  ...investment,
                  quantity: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço de Compra (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={investment.purchasePrice || ""}
              onChange={(e) =>
                setInvestment({
                  ...investment,
                  purchasePrice: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};