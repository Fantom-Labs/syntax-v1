import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Match {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: "scheduled" | "finished";
}

interface MatchListProps {
  title: string;
  limit?: number;
  upcoming?: boolean;
}

const matches: Match[] = [
  {
    date: "2024-02-10",
    competition: "Copa do Brasil",
    homeTeam: "Vasco da Gama",
    awayTeam: "Atlético-MG",
    homeScore: 1,
    awayScore: 1,
    status: "finished",
  },
  {
    date: "2024-02-15",
    competition: "Brasileirão",
    homeTeam: "São Paulo",
    awayTeam: "Vasco da Gama",
    status: "scheduled",
  },
];

export const MatchList = ({ title, limit = 5, upcoming = false }: MatchListProps) => {
  const filteredMatches = matches
    .filter((match) => upcoming ? match.status === "scheduled" : match.status === "finished")
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredMatches.map((match, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{match.competition}</p>
                <p className="font-medium">{match.homeTeam}</p>
                <p className="font-medium">{match.awayTeam}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {new Date(match.date).toLocaleDateString()}
                </p>
                {match.status === "finished" ? (
                  <p className="text-xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </p>
                ) : (
                  <p className="text-sm">Agendado</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};