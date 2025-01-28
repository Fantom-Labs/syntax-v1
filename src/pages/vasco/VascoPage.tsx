import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTemplate from "@/components/PageTemplate";
import { MatchList } from "./components/MatchList";
import { TeamRoster } from "./components/TeamRoster";

export const VascoPage = () => {
  return (
    <PageTemplate title="Vasco da Gama">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="matches">Partidas</TabsTrigger>
          <TabsTrigger value="standings">Classificação</TabsTrigger>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MatchList title="Partida recente" limit={1} />
          <MatchList title="Próximas partidas" limit={3} upcoming />
        </TabsContent>

        <TabsContent value="matches">
          <MatchList title="Histórico de partidas" limit={10} />
        </TabsContent>

        <TabsContent value="standings">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Brasileirão Série A</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Pos</th>
                    <th className="text-left py-2">Clube</th>
                    <th className="text-center py-2">PJ</th>
                    <th className="text-center py-2">V</th>
                    <th className="text-center py-2">E</th>
                    <th className="text-center py-2">D</th>
                    <th className="text-center py-2">SG</th>
                    <th className="text-center py-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-muted/50">
                    <td className="py-2">10</td>
                    <td className="py-2">Vasco da Gama</td>
                    <td className="text-center py-2">38</td>
                    <td className="text-center py-2">14</td>
                    <td className="text-center py-2">8</td>
                    <td className="text-center py-2">16</td>
                    <td className="text-center py-2">-13</td>
                    <td className="text-center py-2">50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="players">
          <TeamRoster />
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};