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
  Play
} from 'lucide-react';

interface Candle {
  id: number;
  type: 'up' | 'down'; // 'up' = green, 'down' = red
  x: number; // percentage or px position (1000 = right edge, 0 = left edge)
  height: number;
  wickHeight: number;
  hit: boolean;
  missed: boolean;
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

  // Game state
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

  // Refs for animation loop
  const candlesRef = useRef<Candle[]>([]);
  const nextCandleId = useRef(1);
  const lastSpawnTime = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const currentSpeed = useRef(350); // pixels per second
  const containerRef = useRef<HTMLDivElement>(null);

  // Target Crosshair Position (px from left of container)
  const targetX = 160;
  const hitTolerance = 65; // px

  // Calculate Rank based on score
  const getRank = (finalScore: number) => {
    if (finalScore >= 3000) return { title: '50ms Diamond Reflex Master 💎', color: 'text-rialo-accent' };
    if (finalScore >= 1500) return { title: 'High-Frequency Arbitrageur 🤖', color: 'text-rialo-cyan' };
    if (finalScore >= 500) return { title: 'Degen Scalper ⚡', color: 'text-status-online-bright' };
    return { title: 'Paper Hands 📄', color: 'text-rialo-subtext' };
  };

  const addFeedback = (text: string, type: 'perfect' | 'great' | 'good' | 'miss') => {
    const newFb: FloatingFeedback = {
      id: Date.now() + Math.random(),
      text,
      type,
      x: targetX,
      y: 120,
      opacity: 1
    };
    setFeedbacks(prev => [...prev.slice(-3), newFb]);
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
    currentSpeed.current = 360;
    lastSpawnTime.current = performance.now();
    lastFrameTime.current = performance.now();
    setGameState('playing');
  };

  // User Action Evaluation
  const handleAction = useCallback((direction: 'up' | 'down') => {
    if (gameState !== 'playing') return;

    setTotalGuesses(prev => prev + 1);

    // Find the closest unhit candle to the target line
    const candidates = candlesRef.current.filter(c => !c.hit && !c.missed);
    let bestCandle: Candle | null = null;
    let minDistance = Infinity;

    for (const c of candidates) {
      const dist = Math.abs(c.x - targetX);
      if (dist < minDistance && dist <= hitTolerance) {
        minDistance = dist;
        bestCandle = c;
      }
    }

    if (!bestCandle) {
      // Pressed too early or with no candle nearby
      triggerDamage();
      return;
    }

    // Check if prediction matches candle type
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

      // Streak & Multiplier
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
        // Accelerate speed dynamically
        currentSpeed.current = Math.min(750, 360 + Math.floor(newScore / 250) * 25);
        return newScore;
      });

      addFeedback(fbText, fbType);
    } else {
      // Wrong direction pressed!
      bestCandle.missed = true;
      triggerDamage();
    }
  }, [gameState, multiplier, highScore, triggerDamage]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'idle' && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }
      if (gameState === 'gameover' && (e.key === ' ' || e.key === 'Enter')) {
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

  // Main 60 FPS Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = (time: number) => {
      const dt = (time - lastFrameTime.current) / 1000;
      lastFrameTime.current = time;

      const containerWidth = containerRef.current?.clientWidth || 800;

      // 1. Spawn New Candlesticks at dynamic intervals
      const spawnIntervalMs = Math.max(380, 1100 - (currentSpeed.current - 360) * 1.4);
      if (time - lastSpawnTime.current > spawnIntervalMs) {
        lastSpawnTime.current = time;
        const type: 'up' | 'down' = Math.random() > 0.5 ? 'up' : 'down';
        const height = 40 + Math.floor(Math.random() * 50);
        const wickHeight = height + 25 + Math.floor(Math.random() * 20);

        candlesRef.current.push({
          id: nextCandleId.current++,
          type,
          x: containerWidth + 40,
          height,
          wickHeight,
          hit: false,
          missed: false
        });
      }

      // 2. Move Candlesticks Leftwards
      const deltaX = currentSpeed.current * dt;
      candlesRef.current.forEach(c => {
        c.x -= deltaX;

        // If candle crosses target line without hit, count as missed life loss
        if (!c.hit && !c.missed && c.x < targetX - hitTolerance) {
          c.missed = true;
          triggerDamage();
        }
      });

      // 3. Remove out-of-screen candles
      candlesRef.current = candlesRef.current.filter(c => c.x > -60);

      // 4. Update floating feedback opacity
      setFeedbacks(prev =>
        prev
          .map(fb => ({ ...fb, y: fb.y - 1.5, opacity: fb.opacity - 0.03 }))
          .filter(fb => fb.opacity > 0)
      );

      animFrameId.current = requestAnimationFrame(loop);
    };

    lastFrameTime.current = performance.now();
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [gameState, triggerDamage]);

  // Twitter Share Intent
  const handleShareTwitter = () => {
    playClickSound();
    const rank = getRank(score);
    const text = `I just scored ${score.toLocaleString()} XP in Rialo Market Reflex! ⚡\nRank: ${rank.title}\nMax Streak: ${maxStreak}x 🔥\n\nCan your reflexes beat Rialo's 50ms sub-second block finality? 🌐\n\nPlay live at: https://github.com/promanas0/RialoPulse`;
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
              <span>Market Reflex Arcade</span>
              <span className="w-2 h-2 rounded-full bg-status-online-bright animate-subtle-pulse"></span>
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-rialo-accent/10 text-rialo-accent border border-rialo-accent/30 px-2 py-0.5 font-bold">
              50ms Reflex Challenge
            </span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1">
            Test your microsecond market instincts against Rialo's 50ms sub-second consensus conveyor.
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
        className="relative w-full h-[400px] sm:h-[440px] bg-[#0C0C0B] border-2 border-rialo-border overflow-hidden select-none shadow-2xl flex flex-col justify-between"
      >
        {/* Top HUD Overlay */}
        <div className="p-4 flex items-center justify-between z-20 font-mono text-xs bg-gradient-to-b from-[#0C0C0B] to-transparent">
          {/* Score & Multiplier */}
          <div className="flex items-center space-x-3">
            <div className="bg-rialo-surface/90 border border-rialo-border px-3 py-1.5 backdrop-blur-md">
              <span className="text-[10px] text-rialo-muted uppercase block">Current XP</span>
              <span className="font-bold text-xl text-rialo-text">{score.toLocaleString()}</span>
            </div>

            {multiplier > 1 && (
              <div className="bg-rialo-accent/20 border border-rialo-accent px-3 py-1.5 flex items-center space-x-1.5 animate-bounce">
                <Flame className="w-4 h-4 text-rialo-accent" />
                <span className="font-bold text-base text-rialo-accent">{multiplier}x MULTIPLIER</span>
              </div>
            )}
          </div>

          {/* Streak & Lives */}
          <div className="flex items-center space-x-4">
            <div className="bg-rialo-surface/90 border border-rialo-border px-3 py-1.5 backdrop-blur-md hidden sm:block">
              <span className="text-[10px] text-rialo-muted uppercase block">Streak</span>
              <span className="font-bold text-rialo-cyan text-base">{streak}x</span>
            </div>

            {/* 3 Hearts */}
            <div className="flex items-center space-x-1 bg-rialo-surface/90 border border-rialo-border px-3 py-2 backdrop-blur-md">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-5 h-5 transition-all ${
                    h <= lives
                      ? 'text-[#FF4D4D] fill-[#FF4D4D] scale-100'
                      : 'text-rialo-border/40 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Conveyor Stream Visual */}
        <div className="relative flex-1 w-full overflow-hidden flex items-center">
          {/* Horizontal Center Price Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-12 pointer-events-none opacity-20">
            <div className="border-b border-dashed border-rialo-muted w-full"></div>
            <div className="border-b border-rialo-muted w-full"></div>
            <div className="border-b border-dashed border-rialo-muted w-full"></div>
          </div>

          {/* Target Strike Zone Laser Line */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none flex flex-col items-center justify-between"
            style={{ left: `${targetX}px` }}
          >
            <div className="px-2 py-0.5 bg-rialo-accent text-[9px] font-mono font-bold text-black uppercase tracking-widest shadow-lg -translate-x-1/2">
              STRIKE ZONE
            </div>

            <div className="w-[3px] flex-1 bg-gradient-to-b from-rialo-accent via-rialo-cyan to-rialo-accent shadow-[0_0_15px_#C85A27] animate-pulse"></div>

            <div className="w-3 h-3 rounded-full bg-rialo-accent shadow-[0_0_12px_#C85A27] mb-2 -translate-x-1/2"></div>
          </div>

          {/* Candlesticks Rendered in Real-Time */}
          {candlesRef.current.map((c) => {
            const isUp = c.type === 'up';
            const colorClass = isUp ? 'bg-status-online-bright border-[#10B981]' : 'bg-[#EF4444] border-[#DC2626]';
            const wickColor = isUp ? '#10B981' : '#EF4444';

            return (
              <div
                key={c.id}
                className="absolute flex flex-col items-center justify-center pointer-events-none transition-transform"
                style={{
                  left: `${c.x}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: c.hit ? 0.2 : c.missed ? 0.3 : 1
                }}
              >
                {/* Upper Wick */}
                <div
                  className="w-[2px]"
                  style={{ height: `${c.wickHeight / 2}px`, backgroundColor: wickColor }}
                />

                {/* Candle Body */}
                <div
                  className={`w-7 sm:w-8 border-2 shadow-lg flex items-center justify-center ${colorClass}`}
                  style={{ height: `${c.height}px` }}
                >
                  {isUp ? (
                    <TrendingUp className="w-3.5 h-3.5 text-black font-bold" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-white font-bold" />
                  )}
                </div>

                {/* Lower Wick */}
                <div
                  className="w-[2px]"
                  style={{ height: `${c.wickHeight / 2}px`, backgroundColor: wickColor }}
                />
              </div>
            );
          })}

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

          {/* Idle / Welcome Screen */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
              <div className="w-14 h-14 rounded-none bg-rialo-accent/10 border-2 border-rialo-accent flex items-center justify-center">
                <Activity className="w-8 h-8 text-rialo-accent" />
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-rialo-text">
                  Market Reflex Arcade
                </h2>
                <p className="text-xs text-rialo-subtext font-mono max-w-md mt-1">
                  Candlesticks will stream into the strike zone. Match green with UP and red with DOWN before they cross the line!
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono text-rialo-muted bg-rialo-surface px-4 py-2 border border-rialo-border">
                <span>[▲] or [W] = Bullish PUMP</span>
                <span>•</span>
                <span>[▼] or [S] = Bearish DUMP</span>
              </div>

              <button
                onClick={startGame}
                className="bg-rialo-accent text-white hover:bg-rialo-accent-hover px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-rialo-accent/30 flex items-center space-x-2 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                <span>START CHALLENGE</span>
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-status-offline font-bold">
                  GAME OVER
                </span>
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
                  <span className="text-[10px] text-rialo-muted block">Max Streak</span>
                  <span className="font-bold text-rialo-cyan text-sm">{maxStreak}x</span>
                </div>
                <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                  <span className="text-[10px] text-rialo-muted block">Accuracy</span>
                  <span className="font-bold text-status-online-bright text-sm">{accuracy}%</span>
                </div>
                <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                  <span className="text-[10px] text-rialo-muted block">Hits</span>
                  <span className="font-bold text-rialo-text text-sm">{successfulHits}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={startGame}
                  className="bg-rialo-text text-rialo-bg hover:bg-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rialo-accent" />
                  <span>Play Again</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2] text-[#1DA1F2] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on X</span>
                </button>

                {score >= 500 && (
                  <button
                    onClick={handleClaimFaucet}
                    disabled={isClaimingFaucet}
                    className="bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-text px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 disabled:opacity-50"
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
        <div className="p-3 bg-[#141412] border-t border-rialo-border grid grid-cols-2 gap-3 z-20">
          <button
            onClick={() => handleAction('up')}
            disabled={gameState !== 'playing'}
            className="py-3 sm:py-4 bg-[#10B981]/15 hover:bg-[#10B981]/25 active:bg-[#10B981]/40 border-2 border-[#10B981] text-[#10B981] text-sm font-mono font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
          >
            <TrendingUp className="w-5 h-5 text-status-online-bright" />
            <span>PUMP (UP ▲)</span>
          </button>

          <button
            onClick={() => handleAction('down')}
            disabled={gameState !== 'playing'}
            className="py-3 sm:py-4 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 active:bg-[#EF4444]/40 border-2 border-[#EF4444] text-[#EF4444] text-sm font-mono font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
          >
            <TrendingDown className="w-5 h-5 text-[#EF4444]" />
            <span>DUMP (DOWN ▼)</span>
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
            Hit 5 in a row for 2x XP, 10 for 3x XP, and 20 for a 5x GODLIKE multiplier. One mistake resets your multiplier.
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
