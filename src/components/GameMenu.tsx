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

  // Top players data
  const topPlayers = [
    {
      id: 1,
      name: "Max Verstappen",
      level: "Level 10",
      score: 2500,
      image: "/gamer.png"
    },
    {
      id: 2,
      name: "Lewis Hamilton",
      level: "Level 8",
      score: 2100,
      image: "/gamer.png"
    },
    {
      id: 3,
      name: "Charles Leclerc",
      level: "Level 7",
      score: 1800,
      image: "/gamer.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Paturain Games
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
          Duik in de wereld van gaming en beleef het ultieme avontuur!
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

      <div className="mt-16 w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
              Top 3 Spelers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{player.name}</p>
                      <p className="text-gray-400 text-sm">{player.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-sm font-bold">{player.score} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameMenu;
