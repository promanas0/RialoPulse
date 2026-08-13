import React, { useState } from 'react';
import type { NetworkType, WalletState } from '../types';
import { addRialoNetworkToWallet } from '../services/rpcService';
import { Activity, Cpu, Globe, Terminal, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedNetwork: NetworkType;
  setSelectedNetwork: (net: NetworkType) => void;
  currentBlockHeight: number;
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedNetwork,
  setSelectedNetwork,
  currentBlockHeight,
  walletState,
  setWalletState
}) => {
  const [connecting, setConnecting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleConnectWallet = async () => {
    setConnecting(true);
    setNotification(null);

    const result = await addRialoNetworkToWallet();

    if (result.success) {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const eth = (window as any).ethereum;
        try {
          const accounts = await eth.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts[0]) {
            setWalletState({
              address: accounts[0],
              isConnected: true,
              balanceRialo: '250.00',
              networkId: '7146'
            });
          }
        } catch {
          // Default state update
        }
      } else {
        setWalletState(prev => ({ ...prev, isConnected: true }));
      }
      setNotification({ type: 'success', message: result.message });
    } else {
      setNotification({ type: 'error', message: result.message });
    }

    setConnecting(false);
    setTimeout(() => setNotification(null), 5000);
  };

  const navItems = [
    { id: 'telemetry', label: 'Core Telemetry', icon: Activity },
    { id: 'peers', label: 'Nodes & Peers', icon: Globe },
    { id: 'sandbox', label: 'Contract Sandbox', icon: Terminal },
    { id: 'toolkit', label: 'Dev Toolkit & Faucet', icon: Wrench }
  ];

  return (
    <header className="border-b border-rialo-border bg-rialo-bg sticky top-0 z-40">
      {/* Top Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold tracking-tight text-rialo-text">
              Rialo
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rialo-accent inline-block"></span>
            <span className="font-display text-xl font-medium tracking-wide text-rialo-subtext">
              Pulse
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-rialo-muted px-2 py-0.5 border border-rialo-border font-mono">
            Network Telemetry
          </span>
        </div>

        {/* Live Network & Block Height Indicator */}
        <div className="flex items-center space-x-6 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-rialo-muted font-sans">Network</span>
            <div className="flex border border-rialo-border bg-rialo-surface p-0.5 text-xs">
              <button
                onClick={() => setSelectedNetwork('Testnet')}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  selectedNetwork === 'Testnet'
                    ? 'bg-rialo-card text-rialo-text shadow-sm border border-rialo-border'
                    : 'text-rialo-subtext hover:text-rialo-text'
                }`}
              >
                Testnet
              </button>
              <button
                onClick={() => setSelectedNetwork('Devnet')}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  selectedNetwork === 'Devnet'
                    ? 'bg-rialo-card text-rialo-text shadow-sm border border-rialo-border'
                    : 'text-rialo-subtext hover:text-rialo-text'
                }`}
              >
                Devnet (REX)
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-rialo-subtext" />
            <span className="text-xs uppercase tracking-wider text-rialo-muted font-sans">Block</span>
            <span className="font-semibold text-rialo-text">
              #{currentBlockHeight.toLocaleString()}
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-status-online animate-subtle-pulse"></span>
            <span className="text-rialo-subtext font-sans uppercase tracking-wider">50ms Block Time Target</span>
          </div>

          {/* Connect / Network Switch Button */}
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className="flex items-center space-x-2 bg-rialo-text text-rialo-bg hover:bg-rialo-dark px-3.5 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors border border-rialo-text disabled:opacity-50"
          >
            <span>
              {walletState.isConnected
                ? `${walletState.address?.substring(0, 6)}...${walletState.address?.substring(38)}`
                : 'Add Rialo Network'}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Banner if any */}
      {notification && (
        <div className={`px-4 py-2 text-xs font-mono flex items-center justify-center space-x-2 ${
          notification.type === 'success' ? 'bg-status-online/10 text-status-online border-y border-status-online/20' : 'bg-status-offline/10 text-status-offline border-y border-status-offline/20'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-rialo-border">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm uppercase tracking-widest font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-rialo-text text-rialo-text font-semibold bg-rialo-surface/60'
                    : 'text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface/30'
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
