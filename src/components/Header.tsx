import React, { useState } from 'react';
import type { NetworkType } from '../types';
import { useWallet } from '../context/WalletContext';
import { playClickSound, toggleSound, isSoundEnabled } from '../services/soundService';
import { Activity, Cpu, Globe, Terminal, Wrench, Droplets, Wallet, AlertTriangle, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedNetwork: NetworkType;
  setSelectedNetwork: (net: NetworkType) => void;
  currentBlockHeight: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedNetwork,
  setSelectedNetwork,
  currentBlockHeight
}) => {
  const { walletState, openConnectModal, openAccountModal, triggerFaucetDrip } = useWallet();
  const [isDrippingFaucet, setIsDrippingFaucet] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleHeaderFaucetClick = async () => {
    playClickSound();
    setIsDrippingFaucet(true);
    await triggerFaucetDrip();
    setIsDrippingFaucet(false);
  };

  const handleTabClick = (tabId: string) => {
    playClickSound();
    setActiveTab(tabId);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'telemetry', label: 'Core Telemetry', icon: Activity },
    { id: 'peers', label: 'Nodes & Peers', icon: Globe },
    { id: 'sandbox', label: 'Contract Sandbox', icon: Terminal },
    { id: 'toolkit', label: 'Dev Toolkit & Faucet', icon: Wrench }
  ];

  return (
    <header className="border-b border-rialo-border bg-rialo-bg/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('overview')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold tracking-tight text-rialo-text group-hover:text-white transition-colors">
              Rialo
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rialo-accent inline-block animate-subtle-pulse"></span>
            <span className="font-display text-xl font-medium tracking-wide text-rialo-subtext">
              Pulse
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-rialo-muted px-2 py-0.5 border border-rialo-border font-mono bg-rialo-surface/50">
            v1.0 Testnet
          </span>
        </div>

        {/* Live Network & Block Height Indicator & Wallet Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm font-mono">
          {/* Network Switcher Tabs */}
          <div className="flex items-center space-x-1.5">
            <div className="flex border border-rialo-border bg-rialo-surface p-0.5 text-xs">
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedNetwork('Testnet');
                }}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  selectedNetwork === 'Testnet'
                    ? 'bg-rialo-card text-rialo-text shadow-sm border border-rialo-border font-bold'
                    : 'text-rialo-subtext hover:text-rialo-text'
                }`}
              >
                Testnet
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedNetwork('Devnet');
                }}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  selectedNetwork === 'Devnet'
                    ? 'bg-rialo-card text-rialo-text shadow-sm border border-rialo-border font-bold'
                    : 'text-rialo-subtext hover:text-rialo-text'
                }`}
              >
                Devnet (REX)
              </button>
            </div>
          </div>

          {/* Block Height Pill */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-rialo-surface border border-rialo-border text-xs">
            <Cpu className="w-3.5 h-3.5 text-rialo-subtext" />
            <span className="text-rialo-muted font-sans text-[11px]">Block</span>
            <span className="font-semibold text-rialo-text">
              #{currentBlockHeight.toLocaleString()}
            </span>
          </div>

          {/* Sound Toggle Button (Pro Dev Polish) */}
          <button
            onClick={handleSoundToggle}
            className="p-1.5 bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-subtext hover:text-rialo-text transition-colors"
            title={soundOn ? 'Sound FX On (Click to Mute)' : 'Sound FX Muted (Click to Unmute)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-rialo-accent" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Quick Faucet Mint Button */}
          <button
            onClick={handleHeaderFaucetClick}
            disabled={isDrippingFaucet}
            className="flex items-center space-x-1.5 bg-rialo-surface hover:bg-rialo-card border border-rialo-border text-rialo-text px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors disabled:opacity-50"
            title="Instant 100 RIALO Testnet Faucet Drip"
          >
            <Droplets className={`w-3.5 h-3.5 text-rialo-accent ${isDrippingFaucet ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Faucet (100 RIALO)</span>
            <span className="sm:hidden">Faucet</span>
          </button>

          {/* Connect / Account Button */}
          {walletState.isConnected && walletState.address ? (
            <button
              onClick={() => {
                playClickSound();
                openAccountModal();
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all border ${
                walletState.isWrongNetwork
                  ? 'bg-status-offline/10 border-status-offline text-status-offline hover:bg-status-offline/20'
                  : 'bg-rialo-surface hover:bg-rialo-card border-rialo-border text-rialo-text shadow-sm'
              }`}
            >
              {walletState.isWrongNetwork ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-status-offline shrink-0" />
                  <span className="font-bold">Wrong Chain</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-status-online-bright shrink-0"></span>
                  <span className="font-bold">
                    {walletState.address.substring(0, 6)}...{walletState.address.substring(walletState.address.length - 4)}
                  </span>
                  <span className="hidden sm:inline text-rialo-muted font-normal">|</span>
                  <span className="hidden sm:inline text-rialo-accent font-semibold">
                    {walletState.balanceRialo} RIALO
                  </span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                openConnectModal();
              }}
              className="flex items-center space-x-2 bg-rialo-text text-rialo-bg hover:bg-white px-3.5 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors border border-rialo-text shadow-sm font-mono font-bold"
            >
              <Wallet className="w-3.5 h-3.5 text-rialo-accent" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-rialo-border">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm uppercase tracking-widest font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-rialo-accent text-rialo-text font-bold bg-rialo-surface/80 shadow-xs'
                    : 'text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rialo-accent' : 'text-rialo-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
