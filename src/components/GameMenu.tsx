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
      color: '#2f57a4'
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#fff6d9' }}>
      <div className="text-center mb-16">
        <h1 className="text-7xl font-bold mb-6" style={{ color: '#2f57a4' }}>
          Paturain Games
        </h1>
        <p className="text-2xl max-w-2xl mx-auto" style={{ color: '#2f57a4' }}>
          Duik in de wereld van gaming en beleef het ultieme avontuur!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="w-full border-0 shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#f5f5f5' }}>
              <CardHeader className="text-center pb-4 relative overflow-hidden" style={{ backgroundColor: '#2f57a4' }}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white rounded-full -translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-4 border-white rounded-full translate-x-6 translate-y-6"></div>
                </div>

                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#fff6d9' }}>
                    <IconComponent className="w-10 h-10" style={{ color: '#2f57a4' }} />
                  </div>
                  <CardTitle className="text-3xl text-white mb-2">{game.title}</CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    {game.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Button
                  onClick={() => onSelectGame(game.id)}
                  className="w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: '#2f57a4',
                    color: 'white'
                  }}
                >
                  Spelen
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 w-full max-w-md">
        <Card className="border-0 shadow-2xl overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
          <CardHeader className="pb-2 relative overflow-hidden" style={{ backgroundColor: '#2f57a4' }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-12 h-12 border-4 border-white rounded-full translate-x-6 -translate-y-6"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-white rounded-full -translate-x-4 translate-y-4"></div>
            </div>

            <CardTitle className="text-white text-2xl flex items-center justify-center relative z-10">
              <Trophy className="w-8 h-8 mr-2" style={{ color: '#fff6d9' }} />
              Top 3 Spelers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#fff6d9' }}>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#2f57a4' }}>
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: '#2f57a4' }}>
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#2f57a4' }}>{player.name}</p>
                      <p className="text-sm" style={{ color: '#2f57a4' }}>{player.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#2f57a4' }}>{player.score} pts</p>
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
