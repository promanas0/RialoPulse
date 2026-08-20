import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  playGameHitSound,
  playGameMissSound,
  playComboSound,
  playGameOverSound,
  playClickSound
} from '../services/soundService';
import {
  TrendingUp,
  TrendingDown,
  Heart,
  Zap,
  RotateCcw,
  Share2,
  Trophy,
  Droplets,
  Flame,
  Activity,
  Play,
  Crosshair,
  ShieldAlert
} from 'lucide-react';

interface CandleData {
  id: number;
  type: 'up' | 'down';
  x: number;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  hit: boolean;
  missed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

interface FloatingFeedback {
  id: number;
  text: string;
  type: 'perfect' | 'great' | 'good' | 'miss';
  x: number;
  y: number;
  opacity: number;
}

export const MarketReflexGame: React.FC = () => {
  const { triggerFaucetDrip } = useWallet();

  // Game states
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('rialo_reflex_highscore') || '0', 10);
    }
    return 0;
  });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [currentLivePrice, setCurrentLivePrice] = useState(142.50);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Engine refs
  const candlesRef = useRef<CandleData[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextCandleId = useRef(1);
  const lastSpawnTime = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const currentSpeed = useRef(320); // px/sec
  const lastPrice = useRef(142.50);

  // Target Crosshair Position
  const targetX = 160;
  const hitTolerance = 60; // px

  const getRank = (finalScore: number) => {
    if (finalScore >= 3000) return { title: 'Diamond Reflex Trader', color: 'text-rialo-accent' };
    if (finalScore >= 1500) return { title: 'High-Frequency Arbitrageur', color: 'text-rialo-cyan' };
    if (finalScore >= 500) return { title: 'Degen Scalper', color: 'text-status-online-bright' };
    return { title: 'Novice Scalper', color: 'text-rialo-subtext' };
  };

  const addFeedback = (text: string, type: 'perfect' | 'great' | 'good' | 'miss') => {
    const newFb: FloatingFeedback = {
      id: Date.now() + Math.random(),
      text,
      type,
      x: targetX,
      y: 110,
      opacity: 1
    };
    setFeedbacks(prev => [...prev.slice(-3), newFb]);
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1
      });
    }
  };

  const endGame = useCallback(() => {
    setGameState('gameover');
    playGameOverSound();
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
  }, []);

  const triggerDamage = useCallback(() => {
    playGameMissSound();
    addFeedback('MISS! -1 LIFE', 'miss');
    setStreak(0);
    setMultiplier(1);
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        endGame();
      }
      return Math.max(0, nextLives);
    });
  }, [endGame]);

  const startGame = () => {
    playClickSound();
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setMultiplier(1);
    setTotalGuesses(0);
    setSuccessfulHits(0);
    setFeedbacks([]);
    candlesRef.current = [];
    particlesRef.current = [];
    currentSpeed.current = 320;
    lastPrice.current = 142.50;
    lastSpawnTime.current = performance.now();
    lastFrameTime.current = performance.now();
    setGameState('playing');
  };

  // User input action
  const handleAction = useCallback((direction: 'up' | 'down') => {
    if (gameState !== 'playing') return;

    setTotalGuesses(prev => prev + 1);

    const candidates = candlesRef.current.filter(c => !c.hit && !c.missed);
    let bestCandle: CandleData | null = null;
    let minDistance = Infinity;

    for (const c of candidates) {
      const dist = Math.abs(c.x - targetX);
      if (dist < minDistance && dist <= hitTolerance) {
        minDistance = dist;
        bestCandle = c;
      }
    }

    if (!bestCandle) {
      triggerDamage();
      return;
    }

    if (bestCandle.type === direction) {
      bestCandle.hit = true;
      playGameHitSound();

      let points = 100;
      let fbText = 'GOOD! +100 XP';
      let fbType: 'perfect' | 'great' | 'good' = 'good';

      if (minDistance < 20) {
        points = 200;
        fbText = 'PERFECT! +200 XP';
        fbType = 'perfect';
      } else if (minDistance < 40) {
        points = 150;
        fbText = 'GREAT! +150 XP';
        fbType = 'great';
      }

      setSuccessfulHits(prev => prev + 1);

      // Particle explosion at target location
      spawnParticles(targetX, 190, direction === 'up' ? '#10B981' : '#EF4444');

      // Streak & multiplier calculations
      setStreak(prev => {
        const nextStreak = prev + 1;
        setMaxStreak(ms => Math.max(ms, nextStreak));

        if (nextStreak === 5 || nextStreak === 10 || nextStreak === 20) {
          playComboSound();
        }

        let nextMult = 1;
        if (nextStreak >= 20) nextMult = 5;
        else if (nextStreak >= 10) nextMult = 3;
        else if (nextStreak >= 5) nextMult = 2;

        setMultiplier(nextMult);
        return nextStreak;
      });

      const awardedScore = points * multiplier;
      setScore(prev => {
        const newScore = prev + awardedScore;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('rialo_reflex_highscore', newScore.toString());
        }
        currentSpeed.current = Math.min(720, 320 + Math.floor(newScore / 250) * 25);
        return newScore;
      });

      addFeedback(fbText, fbType);
    } else {
      bestCandle.missed = true;
      triggerDamage();
    }
  }, [gameState, multiplier, highScore, triggerDamage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'gameover') && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }

      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleAction('up');
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleAction('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleAction]);

  // Main Canvas & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnimId: number;

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 360 * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (time: number) => {
      const dt = Math.min(0.1, (time - (lastFrameTime.current || time)) / 1000);
      lastFrameTime.current = time;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = 360;

      // 1. Clear background
      ctx.fillStyle = '#0A0A09';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Financial Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      // Horizontal price lines
      const gridLevels = [60, 120, 180, 240, 300];
      gridLevels.forEach((y, i) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width - 65, y);
        ctx.stroke();

        // Right side price axis labels
        ctx.fillStyle = 'rgba(163, 158, 147, 0.5)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        const priceLabel = (145.0 - i * 1.25).toFixed(2);
        ctx.fillText(`$${priceLabel}`, width - 10, y + 3);
      });

      // Price Axis divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(width - 65, 0);
      ctx.lineTo(width - 65, height);
      ctx.stroke();

      // Vertical time grid lines
      for (let gx = 0; gx < width - 65; gx += 80) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // 3. Spawning & Moving Candlesticks when playing
      if (gameState === 'playing') {
        const spawnIntervalMs = Math.max(360, 1000 - (currentSpeed.current - 320) * 1.3);
        if (time - lastSpawnTime.current > spawnIntervalMs) {
          lastSpawnTime.current = time;

          const type: 'up' | 'down' = Math.random() > 0.48 ? 'up' : 'down';
          const priceDelta = (0.3 + Math.random() * 0.8) * (type === 'up' ? 1 : -1);
          const newPrice = Math.max(138, Math.min(148, lastPrice.current + priceDelta));
          const openPrice = lastPrice.current;
          const closePrice = newPrice;
          const highPrice = Math.max(openPrice, closePrice) + Math.random() * 0.4;
          const lowPrice = Math.min(openPrice, closePrice) - Math.random() * 0.4;
          lastPrice.current = newPrice;
          setCurrentLivePrice(newPrice);

          candlesRef.current.push({
            id: nextCandleId.current++,
            type,
            x: width - 70,
            openPrice,
            closePrice,
            highPrice,
            lowPrice,
            volume: 15 + Math.random() * 45,
            hit: false,
            missed: false
          });
        }

        // Move Candlesticks
        const deltaX = currentSpeed.current * dt;
        candlesRef.current.forEach(c => {
          c.x -= deltaX;

          if (!c.hit && !c.missed && c.x < targetX - hitTolerance) {
            c.missed = true;
            triggerDamage();
          }
        });

        // Filter out-of-bounds candles
        candlesRef.current = candlesRef.current.filter(c => c.x > -40);
      }

      // 4. Render Target Strike Zone Laser
      ctx.save();
      // Glowing laser background
      const laserGrad = ctx.createLinearGradient(targetX - 25, 0, targetX + 25, 0);
      laserGrad.addColorStop(0, 'rgba(200, 90, 39, 0)');
      laserGrad.addColorStop(0.5, 'rgba(200, 90, 39, 0.18)');
      laserGrad.addColorStop(1, 'rgba(200, 90, 39, 0)');
      ctx.fillStyle = laserGrad;
      ctx.fillRect(targetX - 25, 0, 50, height);

      // Vertical Laser Line
      ctx.strokeStyle = '#C85A27';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#C85A27';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(targetX, 0);
      ctx.lineTo(targetX, height);
      ctx.stroke();
      ctx.restore();

      // Laser Reticle Ring
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(targetX, 180, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Draw EMA Trend Line across candles
      if (candlesRef.current.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const priceToY = (p: number) => {
          // Map price range 138-148 to y range 300-60
          return 300 - ((p - 138) / 10) * 240;
        };

        candlesRef.current.forEach((c, idx) => {
          const cy = priceToY(c.closePrice);
          if (idx === 0) ctx.moveTo(c.x, cy);
          else ctx.lineTo(c.x, cy);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw Candlesticks & Volume Bars
      const priceToY = (p: number) => 300 - ((p - 138) / 10) * 240;

      candlesRef.current.forEach(c => {
        const isUp = c.type === 'up';
        const color = isUp ? '#10B981' : '#EF4444';
        const alpha = c.hit ? 0.2 : c.missed ? 0.3 : 1;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Bottom Volume Histogram Bar
        ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(c.x - 7, height - c.volume, 14, c.volume);

        // Candle Wick
        const highY = priceToY(c.highPrice);
        const lowY = priceToY(c.lowPrice);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.x, highY);
        ctx.lineTo(c.x, lowY);
        ctx.stroke();

        // Candle Body
        const openY = priceToY(c.openPrice);
        const closeY = priceToY(c.closePrice);
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(4, Math.abs(closeY - openY));

        ctx.fillStyle = color;
        ctx.fillRect(c.x - 7, bodyTop, 14, bodyHeight);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(c.x - 7, bodyTop, 14, bodyHeight);

        ctx.restore();
      });

      // 7. Render Particles
      particlesRef.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * 1.8;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      // 8. Live Current Price Marker on right axis
      const curY = priceToY(currentLivePrice);
      ctx.save();
      ctx.fillStyle = '#C85A27';
      ctx.fillRect(width - 65, curY - 9, 65, 18);
      ctx.fillStyle = '#0A0A09';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`$${currentLivePrice.toFixed(2)}`, width - 32, curY + 4);
      ctx.restore();

      localAnimId = requestAnimationFrame(render);
    };

    localAnimId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(localAnimId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, currentLivePrice, triggerDamage]);

  // Floating feedbacks decay
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedbacks(prev =>
        prev
          .map(fb => ({ ...fb, y: fb.y - 2, opacity: fb.opacity - 0.04 }))
          .filter(fb => fb.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleShareTwitter = () => {
    playClickSound();
    const rank = getRank(score);
    const text = `I just scored ${score.toLocaleString()} XP in Rialo Market Reflex! [Rank: ${rank.title} | Max Streak: ${maxStreak}x]\n\nTesting neural reflex against Rialo 50ms sub-second block finality.\n\nPlay live: https://github.com/promanas0/RialoPulse`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleClaimFaucet = async () => {
    playClickSound();
    setIsClaimingFaucet(true);
    await triggerFaucetDrip();
    setIsClaimingFaucet(false);
  };

  const accuracy = totalGuesses > 0 ? Math.round((successfulHits / totalGuesses) * 100) : 100;
  const currentRank = getRank(score);

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rialo-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-bold text-rialo-text tracking-tight flex items-center space-x-2">
              <Crosshair className="w-6 h-6 text-rialo-accent" />
              <span>Market Reflex Arcade</span>
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-rialo-accent/10 text-rialo-accent border border-rialo-accent/30 px-2 py-0.5 font-bold">
              50ms Block Conveyor
            </span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1">
            Real-time candlestick trading reflex challenge. Time your executions with Rialo sub-second block finality.
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs">
          <div className="bg-rialo-surface px-3 py-1.5 border border-rialo-border flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-rialo-accent" />
            <span className="text-rialo-muted">High Score:</span>
            <span className="font-bold text-rialo-text">{highScore.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena Container */}
      <div
        ref={containerRef}
        className="relative w-full bg-[#0A0A09] border border-rialo-border overflow-hidden select-none shadow-2xl flex flex-col justify-between"
      >
        {/* Top HUD Overlay */}
        <div className="p-3 sm:p-4 flex items-center justify-between z-20 font-mono text-xs border-b border-rialo-border/60 bg-[#0C0C0B]/90 backdrop-blur-md">
          {/* Score & Multiplier */}
          <div className="flex items-center space-x-3">
            <div className="bg-rialo-surface border border-rialo-border px-3 py-1.5">
              <span className="text-[10px] text-rialo-muted uppercase block">Score XP</span>
              <span className="font-bold text-lg sm:text-xl text-rialo-text">{score.toLocaleString()}</span>
            </div>

            {multiplier > 1 && (
              <div className="bg-rialo-accent/15 border border-rialo-accent px-3 py-1.5 flex items-center space-x-1.5 animate-pulse">
                <Flame className="w-4 h-4 text-rialo-accent" />
                <span className="font-bold text-xs sm:text-sm text-rialo-accent">{multiplier}X MULTIPLIER</span>
              </div>
            )}
          </div>

          {/* Streak, Price & Lives */}
          <div className="flex items-center space-x-3">
            <div className="bg-rialo-surface border border-rialo-border px-3 py-1.5 hidden sm:block">
              <span className="text-[10px] text-rialo-muted uppercase block">Streak</span>
              <span className="font-bold text-rialo-cyan text-sm">{streak} in-a-row</span>
            </div>

            {/* 3 Hearts Indicator */}
            <div className="flex items-center space-x-1.5 bg-rialo-surface border border-rialo-border px-3 py-2">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-4 h-4 transition-all ${
                    h <= lives
                      ? 'text-status-offline fill-status-offline scale-100'
                      : 'text-rialo-border/40 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* HTML5 Candlestick Chart Canvas */}
        <div className="relative w-full h-[360px] bg-[#0A0A09]">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Floating Feedback Badges */}
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className={`absolute font-mono font-extrabold text-xs px-2.5 py-1 pointer-events-none uppercase tracking-wider shadow-xl transition-all ${
                fb.type === 'perfect'
                  ? 'bg-status-online text-black border border-white'
                  : fb.type === 'great'
                  ? 'bg-rialo-accent text-white border border-rialo-accent'
                  : fb.type === 'good'
                  ? 'bg-rialo-surface text-rialo-text border border-rialo-border'
                  : 'bg-status-offline text-white border border-status-offline'
              }`}
              style={{
                left: `${fb.x}px`,
                top: `${fb.y}px`,
                transform: 'translate(-50%, -50%)',
                opacity: fb.opacity
              }}
            >
              {fb.text}
            </div>
          ))}

          {/* Welcome Screen Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
              <div className="w-12 h-12 bg-rialo-accent/10 border border-rialo-accent flex items-center justify-center">
                <Activity className="w-6 h-6 text-rialo-accent" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-rialo-text">
                  Market Reflex Trading Arena
                </h2>
                <p className="text-xs text-rialo-subtext font-mono max-w-md mt-1 leading-relaxed">
                  Candlesticks will stream into the strike zone. Execute PUMP (UP) on green candles and DUMP (DOWN) on red candles as they cross the laser line!
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono text-rialo-muted bg-rialo-surface px-4 py-2 border border-rialo-border">
                <span>[W / UP] = Bullish Pump</span>
                <span>•</span>
                <span>[S / DOWN] = Bearish Dump</span>
              </div>

              <button
                onClick={startGame}
                className="bg-rialo-accent text-white hover:bg-rialo-accent-hover px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-rialo-accent/30 flex items-center space-x-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START CHALLENGE</span>
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <div className="flex items-center justify-center space-x-1.5 text-status-offline text-xs font-mono font-bold uppercase tracking-widest">
                  <ShieldAlert className="w-4 h-4" />
                  <span>EXECUTION TERMINATED</span>
                </div>
                <h2 className="font-display text-3xl font-extrabold text-rialo-text mt-1">
                  {score.toLocaleString()} XP
                </h2>
                <div className={`text-xs font-mono font-bold mt-1 ${currentRank.color}`}>
                  Rank: {currentRank.title}
                </div>
              </div>

              {/* Stats Summary Matrix */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm font-mono text-xs">
                <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                  <span className="text-[10px] text-rialo-muted block uppercase">Max Streak</span>
                  <span className="font-bold text-rialo-cyan text-sm">{maxStreak}x</span>
                </div>
                <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                  <span className="text-[10px] text-rialo-muted block uppercase">Accuracy</span>
                  <span className="font-bold text-status-online-bright text-sm">{accuracy}%</span>
                </div>
                <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                  <span className="text-[10px] text-rialo-muted block uppercase">Hits</span>
                  <span className="font-bold text-rialo-text text-sm">{successfulHits}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={startGame}
                  className="bg-rialo-text text-rialo-bg hover:bg-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rialo-accent" />
                  <span>Play Again</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2] text-[#1DA1F2] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on X</span>
                </button>

                {score >= 500 && (
                  <button
                    onClick={handleClaimFaucet}
                    disabled={isClaimingFaucet}
                    className="bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-text px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Droplets className="w-3.5 h-3.5 text-rialo-accent" />
                    <span>{isClaimingFaucet ? 'Claiming...' : 'Claim 100 RIALO'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Touch Controls Bar */}
        <div className="p-3 bg-[#121210] border-t border-rialo-border grid grid-cols-2 gap-3 z-20">
          <button
            onClick={() => handleAction('up')}
            disabled={gameState !== 'playing'}
            className="py-3 sm:py-4 bg-[#10B981]/15 hover:bg-[#10B981]/25 active:bg-[#10B981]/40 border border-[#10B981] text-[#10B981] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-status-online-bright" />
            <span>PUMP (UP)</span>
          </button>

          <button
            onClick={() => handleAction('down')}
            disabled={gameState !== 'playing'}
            className="py-3 sm:py-4 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 active:bg-[#EF4444]/40 border border-[#EF4444] text-[#EF4444] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
          >
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF4444]" />
            <span>DUMP (DOWN)</span>
          </button>
        </div>
      </div>

      {/* Rules & Reflex Guide Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-rialo-surface p-4 border border-rialo-border">
          <div className="flex items-center space-x-2 text-rialo-text font-bold">
            <Zap className="w-4 h-4 text-rialo-accent" />
            <span>50ms Sub-Second Speed</span>
          </div>
          <p className="text-[11px] text-rialo-subtext mt-1.5 leading-relaxed font-sans">
            As your score climbs, the candle conveyor speeds up to test your neural reflexes against high-frequency blocks.
          </p>
        </div>

        <div className="bg-rialo-surface p-4 border border-rialo-border">
          <div className="flex items-center space-x-2 text-rialo-text font-bold">
            <Flame className="w-4 h-4 text-rialo-cyan" />
            <span>Combo Multipliers</span>
          </div>
          <p className="text-[11px] text-rialo-subtext mt-1.5 leading-relaxed font-sans">
            Hit 5 in a row for 2x XP, 10 for 3x XP, and 20 for a 5x multiplier. One mistake resets your multiplier.
          </p>
        </div>

        <div className="bg-rialo-surface p-4 border border-rialo-border">
          <div className="flex items-center space-x-2 text-rialo-text font-bold">
            <Droplets className="w-4 h-4 text-status-online-bright" />
            <span>Web3 Faucet Rewards</span>
          </div>
          <p className="text-[11px] text-rialo-subtext mt-1.5 leading-relaxed font-sans">
            Achieve 500+ XP in a single run to unlock 1-click testnet token rewards directly deposited to your wallet.
          </p>
        </div>
      </div>
    </div>
  );
};
