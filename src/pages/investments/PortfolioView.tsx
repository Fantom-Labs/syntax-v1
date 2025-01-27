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

interface PortfolioViewProps {
  portfolio: Portfolio;
  onUpdate: (portfolio: Portfolio) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const PortfolioView = ({ portfolio, onUpdate }: PortfolioViewProps) => {
  const isMobile = useIsMobile();

  const addInvestment = (investment: Investment) => {
    onUpdate({
      ...portfolio,
      investments: [...portfolio.investments, investment],
      totalValue: portfolio.totalValue + investment.totalInvested,
    });
  };

  const removeInvestment = (investmentId: string) => {
    const investment = portfolio.investments.find((i) => i.id === investmentId);
    if (!investment) return;

    onUpdate({
      ...portfolio,
      investments: portfolio.investments.filter((i) => i.id !== investmentId),
      totalValue: portfolio.totalValue - investment.totalInvested,
    });
  };

  const updateInvestment = (investment: Investment) => {
    onUpdate({
      ...portfolio,
      investments: portfolio.investments.map((i) =>
        i.id === investment.id ? investment : i
      ),
    });
  };

  const chartData = portfolio.investments.map((investment) => ({
    name: investment.symbol,
    value: investment.totalInvested,
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
            onUpdate={updateInvestment}
          />
        </CardContent>
      </Card>
    </div>
  );
};