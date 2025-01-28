import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Investment {
  name: string;
  value: number;
  change: number;
}

interface InvestmentCardProps {
  investments: Investment[];
}

export const InvestmentCard = ({ investments }: InvestmentCardProps) => {
  return (
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
  );
};