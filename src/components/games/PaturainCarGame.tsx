import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PaturainCarGameProps {
  onBackToMenu: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'car' | 'package';  // Add type to distinguish between cars and packages
}

const PaturainCarGame = ({ onBackToMenu }: PaturainCarGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Audio refs
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const drivingSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);

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
    packageSpawnTimer: 0,
    keys: { up: false, down: false }
  });

  const resetGame = () => {
    gameStateRef.current = {
      player: { x: 50, y: ROAD_Y + (ROAD_WIDTH - 90) / 2, width: 60, height: 90 },
      obstacles: [],
      gameSpeed: 2,
      spawnTimer: 0,
      packageSpawnTimer: 0,
      keys: { up: false, down: false }
    };
    setScore(0);
    setBonusPoints(0);
    setGameOver(false);
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with cream background
    ctx.fillStyle = '#fff6d9';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw road with light gray
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, ROAD_Y, CANVAS_WIDTH, ROAD_WIDTH);

    // Draw road lines with blue
    ctx.fillStyle = '#2f57a4';
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.fillRect(x, CANVAS_HEIGHT / 2 - 2, 20, 4);
    }

    // Draw road borders with blue
    ctx.fillStyle = '#2f57a4';
    ctx.fillRect(0, ROAD_Y - 5, CANVAS_WIDTH, 5);
    ctx.fillRect(0, ROAD_Y + ROAD_WIDTH, CANVAS_WIDTH, 5);

    // Load images
    const paturainImage = new Image();
    paturainImage.src = '/paturain-auto.png';

    const redCarImage = new Image();
    redCarImage.src = '/rode-auto.png';

    const packageImage = new Image();
    packageImage.src = '/paturain-pak.png';

    // Draw player
    const player = gameStateRef.current.player;
    if (paturainImage.complete) {
      ctx.drawImage(paturainImage, player.x, player.y, player.width, player.height);
    } else {
      paturainImage.onload = () => {
        ctx.drawImage(paturainImage, player.x, player.y, player.width, player.height);
      };
    }

    // Draw obstacles and packages
    gameStateRef.current.obstacles.forEach(obstacle => {
      if (obstacle.type === 'car') {
        if (redCarImage.complete) {
          ctx.drawImage(redCarImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
          redCarImage.onload = () => {
            ctx.drawImage(redCarImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          };
        }
      } else if (obstacle.type === 'package') {
        // Draw beautiful round shadow for package
        const shadowX = obstacle.x + obstacle.width / 2;
        const shadowY = obstacle.y + obstacle.height + 5;
        const shadowWidth = obstacle.width + 10;
        const shadowHeight = 12;

        // Create gradient for shadow
        const shadowGradient = ctx.createRadialGradient(
          shadowX, shadowY, 0,
          shadowX, shadowY, shadowWidth / 2
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        // Draw elliptical shadow
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, shadowWidth / 2, shadowHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        if (packageImage.complete) {
          ctx.drawImage(packageImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
          packageImage.onload = () => {
            ctx.drawImage(packageImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          };
        }
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

    // Spawn obstacles (cars) - reduced frequency
    state.spawnTimer++;
    if (state.spawnTimer > 300 / state.gameSpeed) {
      const minY = ROAD_Y + 20;
      const maxY = ROAD_Y + ROAD_WIDTH - 100;
      const randomY = minY + Math.random() * (maxY - minY);

      state.obstacles.push({
        x: CANVAS_WIDTH,
        y: randomY,
        width: 60,
        height: 80,
        type: 'car'
      });
      state.spawnTimer = 0;
    }

    // Spawn packages
    state.packageSpawnTimer++;
    if (state.packageSpawnTimer > 400 / state.gameSpeed) {
      const minY = ROAD_Y + 20;
      const maxY = ROAD_Y + ROAD_WIDTH - 80;
      const randomY = minY + Math.random() * (maxY - minY);

      state.obstacles.push({
        x: CANVAS_WIDTH,
        y: randomY,
        width: 60,
        height: 60,
        type: 'package'
      });
      state.packageSpawnTimer = 0;
    }

    // Move obstacles and check collisions
    state.obstacles = state.obstacles.filter(obstacle => {
      obstacle.x -= state.gameSpeed;

      // Check collision with player
      const player = state.player;
      if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {

        if (obstacle.type === 'car') {
          playGameOverSound();
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
          }
          return false;
        } else if (obstacle.type === 'package') {
          setBonusPoints(prev => prev + 50);
          return false;
        }
      }

      return obstacle.x > -80;
    });

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
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
      }
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = true;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
      }
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

  // Audio control functions
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (startSoundRef.current) startSoundRef.current.muted = !isMuted;
    if (drivingSoundRef.current) drivingSoundRef.current.muted = !isMuted;
    if (gameOverSoundRef.current) gameOverSoundRef.current.muted = !isMuted;
  };

  const playStartSound = () => {
    if (startSoundRef.current && !isMuted) {
      startSoundRef.current.currentTime = 0;
      startSoundRef.current.play();
    }
  };

  const playDrivingSound = useCallback(() => {
    const drivingSound = drivingSoundRef.current;
    if (!drivingSound) {
      console.log("Driving sound element not found");
      return;
    }

    if (isMuted) {
      console.log("Sound is muted");
      return;
    }

    try {
      drivingSound.volume = 0.5;
      drivingSound.loop = true;
      drivingSound.currentTime = 0;

      // Force load the audio
      drivingSound.load();

      const playPromise = drivingSound.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Driving sound started playing");
          })
          .catch(error => {
            console.error("Error playing driving sound:", error);
          });
      }
    } catch (error) {
      console.error("Error in playDrivingSound:", error);
    }
  }, [isMuted]);

  const playGameOverSound = () => {
    if (gameOverSoundRef.current && !isMuted) {
      drivingSoundRef.current?.pause();
      gameOverSoundRef.current.currentTime = 0;
      gameOverSoundRef.current.play();
    }
  };

  // Audio effects
  useEffect(() => {
    console.log("Game state changed:", { isPlaying, gameOver });

    if (isPlaying && !gameOver) {
      console.log("Attempting to play driving sound");
      playDrivingSound();
    } else {
      console.log("Stopping driving sound");
      if (drivingSoundRef.current) {
        drivingSoundRef.current.pause();
        drivingSoundRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, gameOver, playDrivingSound]);

  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    setIsPlaying(true);
    playStartSound();
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      console.log("Pausing game and sound");
      drivingSoundRef.current?.pause();
    } else {
      console.log("Resuming game and sound");
      playDrivingSound();
    }
  };

  // Initialize audio when component mounts
  useEffect(() => {
    const drivingSound = drivingSoundRef.current;
    if (drivingSound) {
      drivingSound.addEventListener('canplaythrough', () => {
        console.log("Driving sound is ready to play");
      });

      drivingSound.addEventListener('error', (e) => {
        console.error("Error loading driving sound:", e);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fff6d9' }}>
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-0 overflow-hidden">
        <CardHeader className="text-center relative overflow-hidden" style={{ backgroundColor: '#2f57a4' }}>
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-white rounded-full -translate-x-10 -translate-y-10"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-4 border-white rounded-full translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-white rounded-full -translate-x-6 translate-y-6"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-4 border-white rounded-full translate-x-12 translate-y-12"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <Button
              variant="ghost"
              onClick={onBackToMenu}
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-full p-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
              Paturain Racer
            </CardTitle>
            <Button
              variant="ghost"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-full p-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>

        {/* Audio elements */}
        <audio
          ref={startSoundRef}
          src="/sounds/game-start.mp3"
          preload="auto"
        />
        <audio
          ref={drivingSoundRef}
          src="/sounds/car-driving.mp3"
          preload="auto"
          crossOrigin="anonymous"
        />
        <audio
          ref={gameOverSoundRef}
          src="/sounds/game-over.mp3"
          preload="auto"
        />

        <CardContent className="p-8" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="flex flex-col gap-8">
            {/* Game Canvas */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-4 rounded-2xl shadow-2xl"
                  style={{
                    borderColor: '#2f57a4',
                    boxShadow: '0 20px 40px rgba(47, 87, 164, 0.3)'
                  }}
                />

                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                    <div className="text-center text-white p-8 rounded-2xl" style={{ backgroundColor: 'rgba(47, 87, 164, 0.9)' }}>
                      <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                      <p className="text-xl mb-6">Score: {score}</p>
                      <Button
                        onClick={startGame}
                        className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Opnieuw Spelen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Card */}
              <Card className="border-0 shadow-lg overflow-hidden" style={{ backgroundColor: '#fff6d9' }}>
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="p-4 rounded-full" style={{ backgroundColor: '#2f57a4' }}>
                      <p className="text-sm text-white font-medium mb-1">Score</p>
                      <p className="text-3xl font-bold text-white">{score}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="text-sm text-gray-600 mb-1">Bonus Points</p>
                      <p className="text-xl font-semibold" style={{ color: '#2f57a4' }}>{bonusPoints}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="text-sm text-gray-600 mb-1">High Score</p>
                      <p className="text-xl font-semibold" style={{ color: '#2f57a4' }}>{highScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls Card */}
              <Card className="border-0 shadow-lg overflow-hidden" style={{ backgroundColor: '#fff6d9' }}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {!isPlaying && !gameOver && (
                      <Button
                        onClick={startGame}
                        className="w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: '#2f57a4',
                          color: 'white'
                        }}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Spel
                      </Button>
                    )}

                    {isPlaying && (
                      <Button
                        onClick={togglePause}
                        className="w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: '#2f57a4',
                          color: 'white'
                        }}
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pauzeer
                      </Button>
                    )}

                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full py-3 rounded-xl transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: '#2f57a4',
                        color: '#2f57a4',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions Card */}
              <Card className="border-0 shadow-lg overflow-hidden" style={{ backgroundColor: '#fff6d9' }}>
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4 text-lg" style={{ color: '#2f57a4' }}>Besturing:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="font-medium" style={{ color: '#2f57a4' }}>↑ ↓ Pijltjestoetsen</p>
                      <p className="text-gray-600">om te sturen</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="font-medium" style={{ color: '#2f57a4' }}>🚗 Ontwijk de rode auto's!</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="font-medium" style={{ color: '#2f57a4' }}>📦 Vang verpakkingen</p>
                      <p className="text-gray-600">voor 50 bonus punten!</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                      <p className="font-medium" style={{ color: '#2f57a4' }}>⚡ Hoe langer je overleeft</p>
                      <p className="text-gray-600">hoe sneller het wordt!</p>
                    </div>
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
