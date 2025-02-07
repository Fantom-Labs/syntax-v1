
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Investment {
  name: string;
  value: number;
  change: number;
}

export const useDashboardData = () => {
  const [displayName, setDisplayName] = useState("Master");
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [nextMatch, setNextMatch] = useState<string | null>(null);
  const [news, setNews] = useState<{ category: string; title: string }[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Erro ao buscar perfil:', error);
            return;
          }

          if (profile?.display_name) {
            setDisplayName(profile.display_name);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    const fetchInvestments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: portfolios, error } = await supabase
            .from('portfolios')
            .select(`
              investments (
                name,
                quantity,
                purchase_price
              )
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching investments:', error);
            return;
          }

          // Combine investments from all portfolios
          const allInvestments = portfolios.flatMap(p => p.investments);
          
          // Transform to the format expected by the dashboard
          const dashboardInvestments = allInvestments.map(inv => ({
            name: inv.name,
            value: inv.quantity * inv.purchase_price * 5, // Simple BRL conversion
            change: Math.random() * 10 - 5, // Mock change value for now
          }));

          setInvestments(dashboardInvestments);
        }
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchUserProfile();
    fetchInvestments();

    setNextMatch("Vasco x Flamengo - Campeonato Brasileiro 2025 - 19/01 16:00");

    setNews([
      { category: "Tecnologia", title: "Nova IA da OpenAI supera benchmarks" },
      { category: "Economia", title: "Bitcoin atinge nova máxima histórica" },
      { category: "Geopolítica", title: "Tensões aumentam no Oriente Médio" },
      { category: "João Pessoa", title: "Obras do BRT avançam na capital" },
      { category: "Brasil", title: "Nova política econômica é anunciada" },
    ]);
  }, []);

  return {
    displayName,
    investments,
    nextMatch,
    news
  };
};
