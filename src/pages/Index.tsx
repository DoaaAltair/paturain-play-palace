
import { useState } from 'react';
import GameMenu from '@/components/GameMenu';
import PaturainCarGame from '@/components/games/PaturainCarGame';

const Index = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'paturain-racer':
        return <PaturainCarGame onBackToMenu={handleBackToMenu} />;
      default:
        return <GameMenu onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {renderCurrentGame()}
    </div>
  );
};

export default Index;
