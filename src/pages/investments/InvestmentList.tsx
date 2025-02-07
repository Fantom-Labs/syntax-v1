
import { Investment } from "@/types/investments";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface InvestmentListProps {
  investments: Investment[];
  onRemove: (id: string) => void;
  onUpdate: () => void;
}

export const InvestmentList = ({
  investments,
  onRemove,
  onUpdate,
}: InvestmentListProps) => {
  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <div
          key={investment.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div>
            <h4 className="font-medium">{investment.symbol}</h4>
            <p className="text-sm text-muted-foreground">{investment.name}</p>
            <p className="text-sm">
              {investment.quantity} x ${investment.purchasePrice.toFixed(2)} = R$
              {investment.totalInvested.toFixed(2)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(investment.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      {investments.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum investimento adicionado
        </p>
      )}
    </div>
  );
};
