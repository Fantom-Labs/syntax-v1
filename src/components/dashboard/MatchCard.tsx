import { Volleyball } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MatchCardProps {
  nextMatch: string | null;
}

export const MatchCard = ({ nextMatch }: MatchCardProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Volleyball className="w-4 h-4" />
        Próximo Jogo
      </h3>
      <p className="text-sm">{nextMatch}</p>
    </Card>
  );
};