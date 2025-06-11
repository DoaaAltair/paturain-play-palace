
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
  
  // Game state
  const gameStateRef = useRef({
    player: { x: 200, y: 450, width: 40, height: 60 },
    obstacles: [] as GameObject[],
    gameSpeed: 2,
    spawnTimer: 0,
    keys: { left: false, right: false }
  });

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;
  const ROAD_WIDTH = 300;
  const ROAD_X = (CANVAS_WIDTH - ROAD_WIDTH) / 2;

  const resetGame = () => {
    gameStateRef.current = {
      player: { x: 200, y: 450, width: 40, height: 60 },
      obstacles: [],
      gameSpeed: 2,
      spawnTimer: 0,
      keys: { left: false, right: false }
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
    ctx.fillRect(ROAD_X, 0, ROAD_WIDTH, CANVAS_HEIGHT);

    // Draw road lines
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.fillRect(CANVAS_WIDTH / 2 - 2, y, 4, 20);
    }

    // Draw road borders
    ctx.fillStyle = '#2E59C9';
    ctx.fillRect(ROAD_X - 5, 0, 5, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_X + ROAD_WIDTH, 0, 5, CANVAS_HEIGHT);

    // // Draw player (Paturain bottle)
    // const player = gameStateRef.current.player;
    // ctx.fillStyle = '#2E59C9';
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // // Draw bottle cap
    // ctx.fillStyle = '#1a4a8a';
    // ctx.fillRect(player.x + 5, player.y, player.width - 10, 15);
    
    // // Draw label
    // ctx.fillStyle = '#ffffff';
    // ctx.font = '8px Arial';
    // ctx.textAlign = 'center';
    // ctx.fillText('PATURAIN', player.x + player.width/2, player.y + 35);
    // Laad Paturain-afbeelding
    const paturainImage = new Image();
    paturainImage.src = '/paturain.png'; 
    
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


    // Draw obstacles (other cars)
    ctx.fillStyle = '#ff4444';
    gameStateRef.current.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      // Car windows
      ctx.fillStyle = '#333333';
      ctx.fillRect(obstacle.x + 5, obstacle.y + 10, obstacle.width - 10, 15);
      ctx.fillStyle = '#ff4444';
    });

  }, []);

  const updateGame = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const state = gameStateRef.current;
    
    // Move player
    if (state.keys.left && state.player.x > ROAD_X) {
      state.player.x -= 5;
    }
    if (state.keys.right && state.player.x < ROAD_X + ROAD_WIDTH - state.player.width) {
      state.player.x += 5;
    }

    // Spawn obstacles
    state.spawnTimer++;
    if (state.spawnTimer > 60 / state.gameSpeed) {
      const laneWidth = ROAD_WIDTH / 3;
      const lane = Math.floor(Math.random() * 3);
      state.obstacles.push({
        x: ROAD_X + lane * laneWidth + (laneWidth - 40) / 2,
        y: -60,
        width: 40,
        height: 60
      });
      state.spawnTimer = 0;
    }

    // Move obstacles
    state.obstacles = state.obstacles.filter(obstacle => {
      obstacle.y += state.gameSpeed;
      return obstacle.y < CANVAS_HEIGHT;
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
      if (e.key === 'ArrowLeft') gameStateRef.current.keys.left = true;
      if (e.key === 'ArrowRight') gameStateRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameStateRef.current.keys.left = false;
      if (e.key === 'ArrowRight') gameStateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    resetGame();
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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Game Canvas */}
            <div className="flex-1 flex justify-center">
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
            <div className="lg:w-64 space-y-4">
              <Card style={{ backgroundColor: '#f8faff', borderColor: '#2E59C9' }}>
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

              <div className="space-y-2">
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

              <Card style={{ backgroundColor: '#f8faff', borderColor: '#2E59C9' }}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2" style={{ color: '#2E59C9' }}>Besturing:</h4>
                  <div className="text-sm space-y-1">
                    <p>← → Pijltjestoetsen om te sturen</p>
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
