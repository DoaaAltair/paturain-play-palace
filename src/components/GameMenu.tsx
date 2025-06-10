
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Brain, Zap, Car, Trophy } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu = ({ onSelectGame }: GameMenuProps) => {
  const games = [
    {
      id: 'paturain-racer',
      title: 'Paturain Racer',
      description: 'Race met je Paturain flesje door het verkeer!',
      icon: Car,
      color: 'from-blue-500 to-blue-700'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Paturain Games
        </h1>
        <p className="text-xl text-gray-300">
          Kies je favoriete spelletje en begin met spelen!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{game.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => onSelectGame(game.id)}
                  className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-3`}
                >
                  Spelen
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 inline-block">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-semibold">High Scores</p>
            <p className="text-gray-300 text-sm">Speel games om je scores bij te houden!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameMenu;
