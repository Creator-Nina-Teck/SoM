import React, { useState, useEffect, useCallback } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const AXOLOTL_SIZE = 60;
const FOOD_SIZE = 25;
const OBSTACLE_SIZE = 35;

const AxolotlGame = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [axolotl, setAxolotl] = useState({ x: 100, y: 300, direction: 'right' });
  const [food, setFood] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameSpeed, setGameSpeed] = useState(2);

  // Custom 2D Axolotl Component
  const AxolotlSprite = ({ direction, isMoving }) => {
    const flipX = direction === 'left';
    
    return (
      <div 
        className={`relative transition-transform duration-200 ${isMoving ? 'animate-pulse' : ''}`}
        style={{ 
          width: AXOLOTL_SIZE, 
          height: AXOLOTL_SIZE,
          transform: `scaleX(${flipX ? -1 : 1})`
        }}
      >
        {/* Axolotl body */}
        <div className="absolute inset-0">
          {/* Main body */}
          <div 
            className="absolute bg-pink-300 rounded-full border-2 border-pink-400"
            style={{
              left: '20%',
              top: '30%',
              width: '50%',
              height: '40%'
            }}
          />
          
          {/* Head */}
          <div 
            className="absolute bg-pink-400 rounded-full border-2 border-pink-500"
            style={{
              left: '60%',
              top: '25%',
              width: '35%',
              height: '50%'
            }}
          />
          
          {/* Tail */}
          <div 
            className="absolute bg-pink-300 border-2 border-pink-400"
            style={{
              left: '5%',
              top: '35%',
              width: '25%',
              height: '30%',
              borderRadius: '50% 0 0 50%'
            }}
          />
          
          {/* External gills (feathery) */}
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '70%',
              top: '15%',
              width: '3px',
              height: '15px',
              borderRadius: '50%'
            }}
          />
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '75%',
              top: '12%',
              width: '3px',
              height: '18px',
              borderRadius: '50%'
            }}
          />
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '80%',
              top: '15%',
              width: '3px',
              height: '15px',
              borderRadius: '50%'
            }}
          />
          
          {/* Bottom gills */}
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '70%',
              top: '70%',
              width: '3px',
              height: '15px',
              borderRadius: '50%'
            }}
          />
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '75%',
              top: '73%',
              width: '3px',
              height: '18px',
              borderRadius: '50%'
            }}
          />
          <div 
            className="absolute bg-pink-500"
            style={{
              left: '80%',
              top: '70%',
              width: '3px',
              height: '15px',
              borderRadius: '50%'
            }}
          />
          
          {/* Eyes */}
          <div 
            className="absolute bg-black rounded-full"
            style={{
              left: '75%',
              top: '35%',
              width: '4px',
              height: '4px'
            }}
          />
          <div 
            className="absolute bg-black rounded-full"
            style={{
              left: '75%',
              top: '45%',
              width: '4px',
              height: '4px'
            }}
          />
          
          {/* Fins */}
          <div 
            className="absolute bg-pink-200 border border-pink-300"
            style={{
              left: '35%',
              top: '20%',
              width: '15px',
              height: '8px',
              borderRadius: '50%'
            }}
          />
          <div 
            className="absolute bg-pink-200 border border-pink-300"
            style={{
              left: '35%',
              top: '65%',
              width: '15px',
              height: '8px',
              borderRadius: '50%'
            }}
          />
          
          {/* Spots */}
          <div 
            className="absolute bg-pink-500 rounded-full"
            style={{
              left: '40%',
              top: '40%',
              width: '3px',
              height: '3px'
            }}
          />
          <div 
            className="absolute bg-pink-500 rounded-full"
            style={{
              left: '30%',
              top: '50%',
              width: '2px',
              height: '2px'
            }}
          />
        </div>
      </div>
    );
  };

  // Bug component
  const BugSprite = () => (
    <div className="relative animate-bounce" style={{ width: FOOD_SIZE, height: FOOD_SIZE }}>
      <div className="absolute inset-0 bg-green-600 rounded-full"></div>
      <div className="absolute top-1 left-1 bg-green-800 rounded-full w-2 h-2"></div>
      <div className="absolute top-1 right-1 bg-green-800 rounded-full w-2 h-2"></div>
      <div className="absolute top-3 left-2 bg-black rounded-full w-1 h-1"></div>
      <div className="absolute top-3 right-2 bg-black rounded-full w-1 h-1"></div>
      <div className="absolute -top-1 left-3 bg-green-700 w-1 h-3 rounded-full"></div>
      <div className="absolute -top-1 right-3 bg-green-700 w-1 h-3 rounded-full"></div>
    </div>
  );

  // Plastic obstacle component
  const PlasticObstacle = () => {
    const plasticTypes = [
      // Plastic bottle
      <div key="bottle" className="relative" style={{ width: OBSTACLE_SIZE, height: OBSTACLE_SIZE }}>
        <div className="absolute inset-0 bg-blue-300 opacity-70 rounded-lg border-2 border-blue-400"></div>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-blue-400 w-2 h-2 rounded-full"></div>
        <div className="absolute bottom-2 left-2 text-xs text-blue-700">🥤</div>
      </div>,
      
      // Plastic bag
      <div key="bag" className="relative" style={{ width: OBSTACLE_SIZE, height: OBSTACLE_SIZE }}>
        <div className="absolute inset-0 bg-gray-200 opacity-60 rounded-lg border-2 border-gray-400"></div>
        <div className="absolute top-2 left-2 text-lg">🛍️</div>
      </div>,
      
      // Plastic container
      <div key="container" className="relative" style={{ width: OBSTACLE_SIZE, height: OBSTACLE_SIZE }}>
        <div className="absolute inset-0 bg-red-300 opacity-70 rounded border-2 border-red-400"></div>
        <div className="absolute top-1 left-1 bg-red-400 w-4 h-1 rounded"></div>
        <div className="absolute bottom-2 left-2 text-xs text-red-700">📦</div>
      </div>
    ];
    
    return plasticTypes[Math.floor(Math.random() * plasticTypes.length)];
  };

  // Generate random food
  const generateFood = useCallback(() => {
    return {
      x: GAME_WIDTH,
      y: Math.random() * (GAME_HEIGHT - 100) + 50,
      id: Math.random()
    };
  }, []);

  // Generate random obstacles
  const generateObstacle = useCallback(() => {
    return {
      x: GAME_WIDTH,
      y: Math.random() * (GAME_HEIGHT - 100) + 50,
      id: Math.random(),
      type: Math.floor(Math.random() * 3) // 0: bottle, 1: bag, 2: container
    };
  }, []);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setAxolotl({ x: 100, y: 300, direction: 'right' });
    setFood([]);
    setObstacles([]);
    setScore(0);
    setLives(3);
    setGameSpeed(2);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      setAxolotl(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = prev.direction;
        
        switch(e.key) {
          case 'ArrowUp':
          case 'w':
            newY = Math.max(0, prev.y - 25);
            break;
          case 'ArrowDown':
          case 's':
            newY = Math.min(GAME_HEIGHT - AXOLOTL_SIZE, prev.y + 25);
            break;
          case 'ArrowLeft':
          case 'a':
            newX = Math.max(0, prev.x - 25);
            newDirection = 'left';
            break;
          case 'ArrowRight':
          case 'd':
            newX = Math.min(GAME_WIDTH - AXOLOTL_SIZE, prev.x + 25);
            newDirection = 'right';
            break;
        }
        
        return { x: newX, y: newY, direction: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Move food and obstacles
      setFood(prev => prev.map(f => ({ ...f, x: f.x - gameSpeed })).filter(f => f.x > -FOOD_SIZE));
      setObstacles(prev => prev.map(o => ({ ...o, x: o.x - gameSpeed })).filter(o => o.x > -OBSTACLE_SIZE));

      // Spawn new food (bugs)
      if (Math.random() < 0.025) {
        setFood(prev => [...prev, generateFood()]);
      }

      // Spawn new obstacles (plastic)
      if (Math.random() < 0.02) {
        setObstacles(prev => [...prev, generateObstacle()]);
      }

      // Increase game speed gradually
      setGameSpeed(prev => Math.min(prev + 0.002, 6));
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, gameSpeed, generateFood, generateObstacle]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Check food collision
    food.forEach(f => {
      if (Math.abs(axolotl.x - f.x) < AXOLOTL_SIZE && 
          Math.abs(axolotl.y - f.y) < AXOLOTL_SIZE) {
        setFood(prev => prev.filter(item => item.id !== f.id));
        setScore(prev => prev + 15);
      }
    });

    // Check obstacle collision
    obstacles.forEach(o => {
      if (Math.abs(axolotl.x - o.x) < AXOLOTL_SIZE && 
          Math.abs(axolotl.y - o.y) < AXOLOTL_SIZE) {
        setObstacles(prev => prev.filter(item => item.id !== o.id));
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          }
          return newLives;
        });
      }
    });
  }, [axolotl, food, obstacles, gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white mb-2">🌊 Axolotl Ocean Cleanup 🌊</h1>
        {gameState === 'playing' && (
          <div className="text-white text-xl">
            Score: {score} | Lives: {'❤️'.repeat(lives)} | Speed: {gameSpeed.toFixed(1)}
          </div>
        )}
      </div>

      <div 
        className="relative bg-gradient-to-b from-cyan-200 to-blue-400 border-4 border-blue-800 rounded-lg overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <h2 className="text-3xl mb-4">Help the Axolotl Clean the Ocean!</h2>
              <p className="mb-2">Use arrow keys or WASD to swim around</p>
              <p className="mb-2">🐛 Collect bugs for food (+15 points)</p>
              <p className="mb-2">🥤 Avoid plastic pollution or lose lives</p>
              <p className="mb-6">Save the axolotl's underwater home!</p>
              <button 
                onClick={startGame}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
              >
                Start Cleanup Mission!
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <h2 className="text-3xl mb-4">Mission Complete!</h2>
              <p className="text-xl mb-2">You helped clean the ocean!</p>
              <p className="text-lg mb-4">Final Score: {score}</p>
              <button 
                onClick={startGame}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
              >
                Start New Mission!
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* Axolotl */}
            <div
              className="absolute transition-all duration-150"
              style={{
                left: axolotl.x,
                top: axolotl.y,
                zIndex: 10
              }}
            >
              <AxolotlSprite direction={axolotl.direction} isMoving={true} />
            </div>

            {/* Food (Bugs) */}
            {food.map(f => (
              <div
                key={f.id}
                className="absolute"
                style={{
                  left: f.x,
                  top: f.y,
                  zIndex: 5
                }}
              >
                <BugSprite />
              </div>
            ))}

            {/* Obstacles (Plastic) */}
            {obstacles.map(o => (
              <div
                key={o.id}
                className="absolute animate-pulse"
                style={{
                  left: o.x,
                  top: o.y,
                  zIndex: 5
                }}
              >
                <PlasticObstacle />
              </div>
            ))}

            {/* Underwater bubbles */}
            <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white bg-opacity-40 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 12 + 6}px`,
                    height: `${Math.random() * 12 + 6}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 4 + 3}s`
                  }}
                />
              ))}
            </div>

            {/* Seaweed for atmosphere */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-400 to-transparent opacity-60"></div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-green-500 opacity-50 animate-pulse"
                style={{
                  left: `${i * 12 + 5}%`,
                  width: '8px',
                  height: `${Math.random() * 40 + 30}px`,
                  borderRadius: '50% 50% 0 0'
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-4 text-center text-white max-w-md">
        <p className="font-semibold">Use Arrow Keys or WASD to move your axolotl!</p>
        <p className="text-sm mt-2">🐛 Eat bugs for energy (+15 points) and avoid 🥤 plastic waste!</p>
        <p className="text-xs mt-1 opacity-80">Help save the axolotl's aquatic ecosystem!</p>
      </div>
    </div>
  );
};

export default AxolotlGame;