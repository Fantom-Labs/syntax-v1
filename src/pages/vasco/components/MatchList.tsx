import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Match, fetchVascoMatches } from "../api/footballApi";
import { ApiKeyInput } from "./ApiKeyInput";

interface MatchListProps {
  title: string;
  limit?: number;
  upcoming?: boolean;
}

export const MatchList = ({ title, limit = 5, upcoming = false }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('football_api_key')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiKey) return;
      
      setLoading(true);
      try {
        const data = await fetchVascoMatches(apiKey);
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={setApiKey} />;
  }

  const filteredMatches = matches
    .filter((match) => upcoming ? match.status === "scheduled" : match.status === "finished")
    .slice(0, limit);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {filteredMatches.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma partida encontrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};