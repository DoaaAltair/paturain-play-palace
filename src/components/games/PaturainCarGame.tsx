import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface PaturainCarGameProps {
  onBackToMenu: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PaturainCarGame = ({ onBackToMenu }: PaturainCarGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const ROAD_WIDTH = 300;
  const ROAD_Y = (CANVAS_HEIGHT - ROAD_WIDTH) / 2;

  // Game state
  const gameStateRef = useRef({
    player: { x: 50, y: ROAD_Y + (ROAD_WIDTH - 90) / 2, width: 60, height: 90 },
    obstacles: [] as GameObject[],
    gameSpeed: 2,
    spawnTimer: 0,
    keys: { up: false, down: false }
  });

  const resetGame = () => {
    gameStateRef.current = {
      player: { x: 50, y: ROAD_Y + (ROAD_WIDTH - 90) / 2, width: 60, height: 90 },
      obstacles: [],
      gameSpeed: 2,
      spawnTimer: 0,
      keys: { up: false, down: false }
    };
    setScore(0);
    setGameOver(false);
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw road
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, ROAD_Y, CANVAS_WIDTH, ROAD_WIDTH);

    // Draw road lines
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.fillRect(x, CANVAS_HEIGHT / 2 - 2, 20, 4);
    }

    // Draw road borders
    ctx.fillStyle = '#2E59C9';
    ctx.fillRect(0, ROAD_Y - 5, CANVAS_WIDTH, 5);
    ctx.fillRect(0, ROAD_Y + ROAD_WIDTH, CANVAS_WIDTH, 5);

    // Laad Paturain-afbeelding
    const paturainImage = new Image();
    paturainImage.src = '/paturain-auto.png';

    // Draw player (Paturain bottle)
    const player = gameStateRef.current.player;

    // Controleer of de afbeelding geladen is
    if (paturainImage.complete) {
      ctx.drawImage(paturainImage, player.x, player.y, player.width, player.height);
    } else {
      paturainImage.onload = () => {
        ctx.drawImage(paturainImage, player.x, player.y, player.width, player.height);
      };
    }

    // Laad rode auto afbeelding
    const redCarImage = new Image();
    redCarImage.src = '/rode-auto.png';

    // Draw obstacles (other cars)
    gameStateRef.current.obstacles.forEach(obstacle => {
      if (redCarImage.complete) {
        ctx.drawImage(redCarImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        redCarImage.onload = () => {
          ctx.drawImage(redCarImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        };
      }
    });

  }, []);

  const updateGame = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const state = gameStateRef.current;

    // Move player
    if (state.keys.up && state.player.y > ROAD_Y) {
      state.player.y -= 5;
    }
    if (state.keys.down && state.player.y < ROAD_Y + ROAD_WIDTH - state.player.height) {
      state.player.y += 5;
    }

    // Spawn obstacles
    state.spawnTimer++;
    if (state.spawnTimer > 180 / state.gameSpeed) {
      // Bereken een willekeurige positie binnen de weg
      const minY = ROAD_Y + 20; // 20 pixels van de bovenkant van de weg
      const maxY = ROAD_Y + ROAD_WIDTH - 120; // 120 pixels van de onderkant (rekening houdend met auto hoogte)
      const randomY = minY + Math.random() * (maxY - minY);

      state.obstacles.push({
        x: CANVAS_WIDTH,
        y: randomY,
        width: 80,
        height: 100
      });
      state.spawnTimer = 0;
    }

    // Move obstacles
    state.obstacles = state.obstacles.filter(obstacle => {
      obstacle.x -= state.gameSpeed;
      return obstacle.x > -80;
    });

    // Check collisions
    const player = state.player;
    for (const obstacle of state.obstacles) {
      if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) {
          setHighScore(score);
        }
        return;
      }
    }

    // Increase score and speed
    setScore(prev => prev + 1);
    if (score > 0 && score % 500 === 0) {
      state.gameSpeed += 0.5;
    }

  }, [isPlaying, gameOver, score, highScore]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateGame();
      drawGame();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [updateGame, drawGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = true;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = false;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    setIsPlaying(true);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f0f4ff' }}>
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="text-center" style={{ backgroundColor: '#2E59C9', color: 'white' }}>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBackToMenu} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <CardTitle className="text-2xl font-bold">Paturain Racer</CardTitle>
            <div className="w-20"></div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Game Canvas */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-4 rounded-lg shadow-lg"
                  style={{ borderColor: '#2E59C9' }}
                />

                {gameOver && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                      <p className="mb-4">Score: {score}</p>
                      <Button onClick={startGame} style={{ backgroundColor: '#2E59C9' }}>
                        <Play className="w-4 h-4 mr-2" />
                        Opnieuw Spelen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Card style={{ backgroundColor: '#f8faff', borderColor: '#2E59C9' }} className="flex-1 max-w-xs">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="text-2xl font-bold" style={{ color: '#2E59C9' }}>{score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">High Score</p>
                      <p className="text-xl font-semibold" style={{ color: '#2E59C9' }}>{highScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2 max-w-xs">
                {!isPlaying && !gameOver && (
                  <Button onClick={startGame} className="w-full" style={{ backgroundColor: '#2E59C9' }}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Spel
                  </Button>
                )}

                {isPlaying && (
                  <Button onClick={togglePause} className="w-full" style={{ backgroundColor: '#2E59C9' }}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pauzeer
                  </Button>
                )}

                <Button onClick={resetGame} variant="outline" className="w-full" style={{ borderColor: '#2E59C9', color: '#2E59C9' }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <Card style={{ backgroundColor: '#f8faff', borderColor: '#2E59C9' }} className="flex-1 max-w-xs">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2" style={{ color: '#2E59C9' }}>Besturing:</h4>
                  <div className="text-sm space-y-1">
                    <p>↑ ↓ Pijltjestoetsen om te sturen</p>
                    <p>Ontwijt andere auto's!</p>
                    <p>Hoe langer je overleeft, hoe sneller het wordt!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaturainCarGame;
