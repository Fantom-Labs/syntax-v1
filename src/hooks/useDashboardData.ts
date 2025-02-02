import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  title: string;
  date: Date;
}

export interface Investment {
  name: string;
  value: number;
  change: number;
}

export const useDashboardData = () => {
  const [displayName, setDisplayName] = useState("Master");
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
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
          } else {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ id: user.id, display_name: 'Master' }]);

            if (insertError) {
              console.error('Erro ao criar perfil:', insertError);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUserProfile();

    setNextEvent({
      title: "Reunião de projeto",
      date: new Date("2024-03-25 14:00"),
    });

    setInvestments([
      { name: "Bitcoin", value: 62000, change: 2.5 },
      { name: "PETR4", value: 38.42, change: -1.2 },
    ]);

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
    nextEvent,
    investments,
    nextMatch,
    news
  };
};