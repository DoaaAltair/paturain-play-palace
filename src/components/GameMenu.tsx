import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Trophy, Gift, X } from 'lucide-react';
import { useState } from 'react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu = ({ onSelectGame }: GameMenuProps) => {
  const [showActiecodeForm, setShowActiecodeForm] = useState(false);
  const [showGameActiecodeForm, setShowGameActiecodeForm] = useState(false);
  const [actiecode, setActiecode] = useState('');
  const [gameActiecode, setGameActiecode] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

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

  const handleActiecodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove validation - accept any input
    console.log('Actiecode ingevoerd:', actiecode);
    // Navigate to the first game (paturain-racer)
    onSelectGame('paturain-racer');
    setActiecode('');
    setShowActiecodeForm(false);
  };

  const handleGameActiecodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Remove validation - accept any input
    console.log('Actiecode ingevoerd:', gameActiecode);

    // Start the game regardless of input
    if (selectedGame) {
      onSelectGame(selectedGame);
    }
    setGameActiecode('');
    setShowGameActiecodeForm(false);
    setSelectedGame(null);
  };

  const handlePlayButtonClick = (gameId: string) => {
    setSelectedGame(gameId);
    setShowGameActiecodeForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative" style={{ backgroundColor: '#fff6d9' }}>
      {/* Hidden Action Code Button */}
      <div className="fixed left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={() => setShowActiecodeForm(true)}
          className="group relative w-12 h-12 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-3xl animate-pulse"
          style={{ backgroundColor: '#2f57a4' }}
        >
          {/* Animated gift icon */}
          <Gift className="w-6 h-6 md:w-8 md:h-8 mx-auto text-white group-hover:rotate-12 transition-transform duration-300" />

          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>

          {/* Tooltip - hidden on mobile */}
          <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block">
            Actiecode invoeren
          </div>
        </button>
      </div>

      {/* Action Code Form Modal */}
      {showActiecodeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#2f57a4' }}>
                  Actiecode Invoeren
                </h2>
                <button
                  onClick={() => setShowActiecodeForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#2f57a4' }} />
                </button>
              </div>

              <form onSubmit={handleActiecodeSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="actiecode"
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#2f57a4' }}
                  >
                    Voer je actiecode in (deze vind je aan de binnenkant van de folie):
                  </label>
                  <input
                    type="text"
                    id="actiecode"
                    name="actiecode"
                    value={actiecode}
                    onChange={(e) => setActiecode(e.target.value)}
                    placeholder="Voer je actiecode in"
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-200 text-base md:text-lg"
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 md:py-3 px-4 md:px-6 text-base md:text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: '#2f57a4',
                    color: 'white'
                  }}
                >
                  Speel nu
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Game Action Code Form Modal */}
      {showGameActiecodeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#2f57a4' }}>
                  Actiecode Vereist
                </h2>
                <button
                  onClick={() => {
                    setShowGameActiecodeForm(false);
                    setSelectedGame(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#2f57a4' }} />
                </button>
              </div>

              <form onSubmit={handleGameActiecodeSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="gameActiecode"
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#2f57a4' }}
                  >
                    Voer je actiecode in (deze vind je aan de binnenkant van de folie):
                  </label>
                  <input
                    type="text"
                    id="gameActiecode"
                    name="gameActiecode"
                    value={gameActiecode}
                    onChange={(e) => setGameActiecode(e.target.value)}
                    placeholder="Voer je actiecode in"
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-200 text-base md:text-lg"
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voer je actiecode in om het spel te starten
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 md:py-3 px-4 md:px-6 text-base md:text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: '#2f57a4',
                    color: 'white'
                  }}
                >
                  Speel nu
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => handlePlayButtonClick(game.id)}
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
