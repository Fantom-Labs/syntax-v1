
import { Investment, Portfolio } from "@/types/investments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddInvestmentDialog } from "./AddInvestmentDialog";
import { InvestmentList } from "./InvestmentList";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PortfolioViewProps {
  portfolio: Portfolio;
  onUpdate: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const PortfolioView = ({ portfolio, onUpdate }: PortfolioViewProps) => {
  const isMobile = useIsMobile();

  const addInvestment = async (investment: Omit<Investment, 'id' | 'totalInvested'>) => {
    const { data, error } = await supabase
      .from('investments')
      .insert([{
        name: investment.name,
        symbol: investment.symbol,
        quantity: investment.quantity,
        purchase_price: investment.purchasePrice,
        type: investment.type,
        portfolio_id: portfolio.id
      }])
      .select()
      .single();

    if (error) {
      toast.error("Error adding investment");
      return;
    }

    onUpdate();
    toast.success("Investment added successfully");
  };

  const removeInvestment = async (investmentId: string) => {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', investmentId);

    if (error) {
      toast.error("Error removing investment");
      return;
    }

    onUpdate();
    toast.success("Investment removed successfully");
  };

  const chartData = portfolio.investments.map((investment) => ({
    name: investment.symbol,
    value: investment.quantity * investment.purchasePrice * 5, // Simple BRL conversion
  }));

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ativos da Carteira</CardTitle>
          <CardDescription>
            Distribuição dos seus investimentos por tipo de ativo
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx={isMobile ? "50%" : "50%"}
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Investimentos</CardTitle>
          <CardDescription>
            Gerencie seus investimentos nesta carteira
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <AddInvestmentDialog onAdd={addInvestment} />
          </div>
          <InvestmentList
            investments={portfolio.investments}
            onRemove={removeInvestment}
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};
