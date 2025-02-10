
import { useEffect, useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Portfolio, Investment } from "@/types/investments";
import { PortfolioView } from "./PortfolioView";
import { AddPortfolioDialog } from "./AddPortfolioDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export const InvestmentsPage = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);

  const { data: portfolios = [], refetch: refetchPortfolios } = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          id,
          name,
          investments (
            id,
            name,
            symbol,
            quantity,
            purchase_price,
            type
          )
        `);

      if (error) {
        toast.error("Error loading portfolios");
        throw error;
      }

      return data.map(portfolio => ({
        ...portfolio,
        investments: portfolio.investments.map(inv => ({
          ...inv,
          purchasePrice: inv.purchase_price,
          totalInvested: inv.quantity * inv.purchase_price * 5, // Simple BRL conversion
          type: inv.type as Investment['type'] // Explicitly cast the type to our union type
        })),
        totalValue: portfolio.investments.reduce(
          (sum, inv) => sum + (inv.quantity * inv.purchase_price * 5), // Simple BRL conversion
          0
        )
      }));
    }
  });

  const addPortfolio = async (portfolio: Omit<Portfolio, 'id' | 'investments' | 'totalValue'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create a portfolio");
      return;
    }

    const { data, error } = await supabase
      .from('portfolios')
      .insert([{
        name: portfolio.name,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      toast.error("Error creating portfolio");
      return;
    }

    refetchPortfolios();
    toast.success("Portfolio created successfully");
  };

  const deletePortfolio = async (portfolioId: string) => {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);

    if (error) {
      toast.error("Error deleting portfolio");
      return;
    }

    setSelectedPortfolio(null);
    refetchPortfolios();
    toast.success("Portfolio deleted successfully");
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
          {portfolios.length > 0 && <AddPortfolioDialog onAdd={addPortfolio} />}
        </div>

        {selectedPortfolio && (
          <>
            <PortfolioView
              portfolio={portfolios.find((p) => p.id === selectedPortfolio)!}
              onUpdate={() => refetchPortfolios()}
            />
            
            <div className="flex justify-end mt-8">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Carteira
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Carteira</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta carteira? Esta ação não pode ser desfeita
                      e todos os investimentos associados serão excluídos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deletePortfolio(selectedPortfolio)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}

        {!selectedPortfolio && (
          <div className="text-center py-12 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Nenhuma carteira selecionada</h3>
              <p className="text-muted-foreground mt-2">
                Selecione uma carteira existente ou crie uma nova para começar
              </p>
            </div>
            {portfolios.length === 0 && (
              <div className="flex justify-center">
                <AddPortfolioDialog onAdd={addPortfolio} />
              </div>
            )}
          </div>
        )}
      </div>
    </PageTemplate>
  );
};
