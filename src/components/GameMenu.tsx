
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Trophy } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Paturain Games
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
          Kies je favoriete spelletje en begin met spelen!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="w-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-white mb-2">{game.title}</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => onSelectGame(game.id)}
                  className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-4 text-lg rounded-lg`}
                >
                  Spelen
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-white font-semibold text-xl mb-2">High Scores</p>
            <p className="text-gray-300">Speel games om je scores bij te houden!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameMenu;
