import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Database, DollarSign, ChartBar, Newspaper } from "lucide-react";
import PageTemplate from "@/components/PageTemplate";

interface NewsItem {
  title: string;
  description: string;
  source: string;
  date: string;
}

export const NewsPage = () => {
  const [news] = useState<Record<string, NewsItem[]>>({
    tech: [
      {
        title: "Nova IA da OpenAI supera benchmarks anteriores",
        description: "O mais recente modelo de linguagem da OpenAI estabelece novos recordes em testes de benchmark...",
        source: "TechCrunch",
        date: "28/01/2024"
      },
      {
        title: "Apple anuncia novo chip M3",
        description: "A Apple revelou seu mais novo processador M3, prometendo melhorias significativas...",
        source: "MacRumors",
        date: "28/01/2024"
      }
    ],
    finance: [
      {
        title: "Bitcoin atinge nova máxima histórica",
        description: "A principal criptomoeda superou US$ 60.000 pela primeira vez desde 2021...",
        source: "CoinDesk",
        date: "28/01/2024"
      },
      {
        title: "Copom mantém taxa Selic em 11,75%",
        description: "O Comitê de Política Monetária decidiu manter a taxa básica de juros...",
        source: "Valor Econômico",
        date: "28/01/2024"
      }
    ],
    geopolitics: [
      {
        title: "Tensões aumentam no Oriente Médio",
        description: "Novos desenvolvimentos na região elevam preocupações internacionais...",
        source: "Reuters",
        date: "28/01/2024"
      },
      {
        title: "União Europeia anuncia novas sanções",
        description: "Bloco europeu implementa nova rodada de sanções econômicas...",
        source: "BBC News",
        date: "28/01/2024"
      }
    ],
    local: [
      {
        title: "Obras do BRT avançam na capital",
        description: "As obras do Bus Rapid Transit em João Pessoa seguem em ritmo acelerado...",
        source: "G1 Paraíba",
        date: "28/01/2024"
      },
      {
        title: "UFPB anuncia novos cursos",
        description: "Universidade Federal da Paraíba expande oferta de graduação...",
        source: "Jornal da Paraíba",
        date: "28/01/2024"
      }
    ],
    brazil: [
      {
        title: "Nova política econômica é anunciada",
        description: "Governo federal apresenta pacote de medidas econômicas...",
        source: "Folha de São Paulo",
        date: "28/01/2024"
      },
      {
        title: "Congresso volta do recesso",
        description: "Parlamentares retornam às atividades com pauta econômica...",
        source: "O Globo",
        date: "28/01/2024"
      }
    ]
  });

  return (
    <PageTemplate title="Notícias">
      <div className="container mx-auto p-4">
        <Tabs defaultValue="tech" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="tech" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Tecnologia
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                Economia
              </TabsTrigger>
              <TabsTrigger value="geopolitics" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Geopolítica
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                João Pessoa
              </TabsTrigger>
              <TabsTrigger value="brazil" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Brasil
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {Object.entries(news).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <span>{item.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTemplate>
  );
};