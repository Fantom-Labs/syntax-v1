
import { useState } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoutineTimeBlock } from "./components/RoutineTimeBlock";

export const RoutinePage = () => {
  const [activeDay, setActiveDay] = useState("weekday");

  const morningTasks = [
    { time: "06:00", task: "Acordar cedo e revisar o planejamento do dia" },
    { time: "06:30", task: "Passeio com Katana" },
    { time: "07:00", task: "Café da manhã + aprendizado (leitura, cursos, estudo de marketing e vendas)" },
    { time: "08:00", task: "Revisão dos números da Fantom e resposta a leads" },
    { time: "09:00", task: "Prospecção ativa (e-mails, mensagens no LinkedIn, networking)" },
    { time: "10:00", task: "Trabalhar nos projetos de clientes da Fantom (design e desenvolvimento)" },
    { time: "11:30", task: "Analisar métricas e anúncios da MyCocina" },
  ];

  const afternoonTasks = [
    { time: "12:00", task: "Almoço e descanso" },
    { time: "13:00", task: "Criar conteúdo para redes sociais da Fantom e MyCocina" },
    { time: "14:00", task: "Gerar conteúdo para o canal de curiosidades (roteiros e vídeos)" },
    { time: "15:00", task: "Revisar vendas e otimizar estratégias de tráfego pago" },
    { time: "16:00", task: "Calls e reuniões estratégicas (clientes, parcerias, networking)" },
    { time: "17:00", task: "Resolver pendências e revisar o dia" },
  ];

  const eveningTasks = [
    { time: "18:00", task: "Passeio com Katana" },
    { time: "19:00", task: "Jantar e relaxamento" },
    { time: "20:00", task: "Aprimoramento pessoal (cursos, networking, eventos)" },
    { time: "21:00", task: "Revisão do dia e planejamento do próximo" },
    { time: "22:00", task: "Tempo livre (livros, séries, jogos)" },
    { time: "23:00", task: "Sono regenerativo" },
  ];

  return (
    <PageTemplate title="Minha Rotina">
      <div className="space-y-6">
        <Tabs defaultValue="weekday" className="w-full" onValueChange={setActiveDay}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="weekday">Dias de semana</TabsTrigger>
            <TabsTrigger value="weekend">Fim de semana</TabsTrigger>
          </TabsList>

          <TabsContent value="weekday" className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              <RoutineTimeBlock 
                title="Manhã" 
                subtitle="6h - 12h" 
                tasks={morningTasks} 
                accentColor="bg-amber-500/20 text-amber-600 dark:text-amber-400"
                isEditable={true}
              />
              
              <RoutineTimeBlock 
                title="Tarde" 
                subtitle="12h - 18h" 
                tasks={afternoonTasks} 
                accentColor="bg-sky-500/20 text-sky-600 dark:text-sky-400"
                isEditable={true}
              />
              
              <RoutineTimeBlock 
                title="Noite" 
                subtitle="18h - 23h" 
                tasks={eveningTasks} 
                accentColor="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                isEditable={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="weekend" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg text-muted-foreground">
                  Adicione sua rotina de fim de semana
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                <p>Você ainda não configurou sua rotina para o fim de semana.</p>
                <p className="mt-2">Clique em editar para começar a adicionar suas atividades.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};
