import React from 'react';
import { Cpu, Zap, Shield, Globe, Lock, Terminal, Radio, Flame } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  const items = [
    { icon: Cpu, label: 'REX Parallel Engine', highlight: '50ms Block Target' },
    { icon: Zap, label: 'Sub-Second Finality', highlight: '18,420 Live TPS' },
    { icon: Shield, label: 'Zero-Knowledge VM', highlight: 'Confidential Proofs' },
    { icon: Globe, label: '148 Global Validators', highlight: 'P2P Mesh Network' },
    { icon: Lock, label: 'EVM Equivalence', highlight: 'Solidity Native' },
    { icon: Terminal, label: 'On-Chain Paymasters', highlight: 'Gasless Execution' },
    { icon: Radio, label: 'Real-time WebSocket Feeds', highlight: 'Sub-10ms Stream' },
    { icon: Flame, label: 'Low Gas Runtime', highlight: '0.85 Gwei Base' }
  ];

  return (
    <div className="relative w-full border-y border-rialo-border bg-rialo-surface/40 backdrop-blur-md overflow-hidden py-3">
      {/* Left/Right Fade Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-rialo-bg to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-rialo-bg to-transparent z-10" />

      <div className="flex w-max animate-marquee space-x-8 font-mono text-xs">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-3 text-rialo-subtext px-3 py-1 bg-rialo-surface/60 border border-rialo-border/80 shrink-0 select-none hover:border-rialo-accent/50 hover:text-rialo-text transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-rialo-accent shrink-0" />
              <span className="font-semibold text-rialo-text">{item.label}</span>
              <span className="text-[10px] text-rialo-muted uppercase tracking-wider">/</span>
              <span className="text-rialo-muted text-[11px]">{item.highlight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
