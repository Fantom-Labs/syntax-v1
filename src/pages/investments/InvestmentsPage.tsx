import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Portfolio } from "@/types/investments";
import { PortfolioView } from "./PortfolioView";
import { AddPortfolioDialog } from "./AddPortfolioDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const InvestmentsPage = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);

  const addPortfolio = (portfolio: Portfolio) => {
    setPortfolios([...portfolios, portfolio]);
  };

  return (
    <PageTemplate title="Investimentos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {portfolios.map((portfolio) => (
              <Button
                key={portfolio.id}
                variant={selectedPortfolio === portfolio.id ? "default" : "outline"}
                onClick={() => setSelectedPortfolio(portfolio.id)}
              >
                {portfolio.name}
              </Button>
            ))}
          </div>
          <AddPortfolioDialog onAdd={addPortfolio} />
        </div>

        {selectedPortfolio && (
          <PortfolioView
            portfolio={portfolios.find((p) => p.id === selectedPortfolio)!}
            onUpdate={(updated) => {
              setPortfolios(
                portfolios.map((p) =>
                  p.id === selectedPortfolio ? updated : p
                )
              );
            }}
          />
        )}

        {!selectedPortfolio && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Nenhuma carteira selecionada</h3>
            <p className="text-muted-foreground mt-2">
              Selecione uma carteira existente ou crie uma nova para começar
            </p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};