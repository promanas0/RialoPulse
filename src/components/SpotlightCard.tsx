import React, { useRef, useState, useCallback } from 'react';
import { playHoverSound } from '../services/soundService';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  withBorderBeam?: boolean;
  onClick?: () => void;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(200, 90, 39, 0.15)',
  withBorderBeam = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -500, y: -500 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-none border border-rialo-border bg-rialo-surface/80 backdrop-blur-md transition-all duration-300 ${
        isHovered ? 'border-rialo-accent/40 shadow-xl' : 'hover:border-rialo-border-dark'
      } ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`
        }}
      />

      {/* Subtle Corner Ambient Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`
        }}
      />

      {/* Optional Border Beam Highlight */}
      {withBorderBeam && isHovered && (
        <div className="pointer-events-none absolute inset-0 rounded-none border border-rialo-accent/60 z-20 transition-all duration-500" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
