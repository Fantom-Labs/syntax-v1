import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Player {
  name: string;
  position: string;
  number?: number;
  image: string;
}

const players: Player[] = [
  {
    name: "Phillipe Coutinho",
    position: "Meia",
    number: 10,
    image: "/placeholder.svg"
  },
  {
    name: "Dimitri Payet",
    position: "Meia",
    number: 10,
    image: "/placeholder.svg"
  },
  {
    name: "Pablo Vegetti",
    position: "Atacante",
    number: 99,
    image: "/placeholder.svg"
  },
];

export const TeamRoster = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={player.image} alt={player.name} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.position}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};