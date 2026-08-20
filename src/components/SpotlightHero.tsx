import React from 'react';
import type { PeerNode } from '../types';
import { NetworkGlobe } from './NetworkGlobe';
import { useWallet } from '../context/WalletContext';
import { playClickSound } from '../services/soundService';
import { switchOrAddRialoNetwork } from '../services/walletService';
import { Activity, Droplets, Wallet, ArrowRight, ShieldCheck } from 'lucide-react';

interface SpotlightHeroProps {
  peers: PeerNode[];
  currentBlockHeight: number;
  onNavigateTab: (tab: string) => void;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  peers,
  currentBlockHeight,
  onNavigateTab
}) => {
  const { openConnectModal, triggerFaucetDrip, walletState } = useWallet();

  const handleFaucetClick = async () => {
    playClickSound();
    await triggerFaucetDrip();
  };

  const handleAddNetworkClick = async () => {
    playClickSound();
    await switchOrAddRialoNetwork();
  };

  return (
    <div className="relative overflow-hidden py-10 lg:py-16">
      {/* Top Radial Glow Backdrop */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(200,90,39,0.18),rgba(0,229,255,0.03)_50%,transparent_70%)] blur-3xl z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Copywriting & CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shimmering Status Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1 bg-rialo-surface/80 border border-rialo-border/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-status-online-bright animate-subtle-pulse"></span>
            <span className="text-xs font-mono tracking-wider uppercase text-rialo-text font-semibold shimmer-text">
              v1.0 Live on Testnet • 50ms Sub-Second Execution
            </span>
          </div>

          {/* Tier-1 H1 Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rialo-text tracking-tight leading-[1.15]">
            Autonomous Infrastructure for{' '}
            <span className="bg-gradient-to-r from-rialo-text via-rialo-accent to-rialo-cyan bg-clip-text text-transparent">
              Scalable Parallel Execution.
            </span>
          </h1>

          {/* Tier-1 Subtext */}
          <p className="text-sm sm:text-base text-rialo-subtext font-sans max-w-2xl leading-relaxed">
            Eliminating consensus latency through 50ms block finality, parallel REX compute, and verifiable zero-knowledge state telemetry across a global mesh of validator nodes.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playClickSound();
                onNavigateTab('telemetry');
              }}
              className="bg-rialo-text text-rialo-bg hover:bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg hover:shadow-rialo-accent/20 group"
            >
              <Activity className="w-4 h-4 text-rialo-accent" />
              <span>Explore Live Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleFaucetClick}
              className="bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-text px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Droplets className="w-4 h-4 text-rialo-accent" />
              <span>Get 100 RIALO Faucet</span>
            </button>

            {walletState.isConnected ? (
              <button
                onClick={handleAddNetworkClick}
                className="bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-text px-4 py-3 text-xs font-mono font-medium uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
                title="Add or Switch to Rialo Testnet (Chain ID 7146)"
              >
                <ShieldCheck className="w-4 h-4 text-status-online-bright" />
                <span>Rialo Testnet (7146)</span>
              </button>
            ) : (
              <button
                onClick={openConnectModal}
                className="bg-transparent hover:bg-rialo-surface border border-rialo-border text-rialo-subtext hover:text-rialo-text px-4 py-3 text-xs font-mono font-medium uppercase tracking-wider transition-colors flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Live Metrics Ticker Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-rialo-border/60 font-mono text-xs">
            <div className="bg-rialo-surface/40 p-3 border border-rialo-border/50">
              <span className="text-[10px] text-rialo-muted uppercase block">Block Target</span>
              <span className="font-bold text-rialo-text text-lg mt-0.5 block">50 ms</span>
            </div>

            <div className="bg-rialo-surface/40 p-3 border border-rialo-border/50">
              <span className="text-[10px] text-rialo-muted uppercase block">Live TPS</span>
              <span className="font-bold text-rialo-accent text-lg mt-0.5 block">18,420</span>
            </div>

            <div className="bg-rialo-surface/40 p-3 border border-rialo-border/50">
              <span className="text-[10px] text-rialo-muted uppercase block">Active Nodes</span>
              <span className="font-bold text-rialo-text text-lg mt-0.5 block">148 Peers</span>
            </div>

            <div className="bg-rialo-surface/40 p-3 border border-rialo-border/50">
              <span className="text-[10px] text-rialo-muted uppercase block">Network Health</span>
              <span className="font-bold text-status-online-bright text-lg mt-0.5 block">99.98%</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive WebGL Globe */}
        <div className="lg:col-span-5 relative">
          <div className="relative border border-rialo-border bg-rialo-surface/60 backdrop-blur-md shadow-2xl p-2">
            <NetworkGlobe
              peers={peers}
              currentBlockHeight={currentBlockHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
