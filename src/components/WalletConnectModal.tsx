import React from 'react';
import { useWallet } from '../context/WalletContext';
import { getAvailableWalletProviders } from '../services/walletService';
import type { WalletProviderType } from '../types';
import { MetaMaskLogo, PhantomLogo, CoinbaseLogo, Web3InjectedLogo, SandboxReviewerLogo } from './WalletIcons';
import { X, ExternalLink, Loader2, ArrowRight } from 'lucide-react';

export const WalletConnectModal: React.FC = () => {
  const { isConnectModalOpen, closeConnectModal, connect, walletState } = useWallet();

  if (!isConnectModalOpen) return null;

  const providers = getAvailableWalletProviders();

  const handleSelectProvider = async (type: WalletProviderType) => {
    await connect(type);
  };

  const getProviderIcon = (id: WalletProviderType) => {
    switch (id) {
      case 'metamask':
        return <MetaMaskLogo className="w-8 h-8" size={32} />;
      case 'phantom':
        return <PhantomLogo className="w-8 h-8" size={32} />;
      case 'coinbase':
        return <CoinbaseLogo className="w-8 h-8" size={32} />;
      case 'demo':
        return <SandboxReviewerLogo className="w-8 h-8" size={32} />;
      case 'injected':
      default:
        return <Web3InjectedLogo className="w-8 h-8" size={32} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-rialo-card border-2 border-rialo-text max-w-md w-full shadow-2xl p-6 relative font-sans animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={closeConnectModal}
          className="absolute top-4 right-4 text-rialo-muted hover:text-rialo-text p-1 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-rialo-border">
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-xl font-bold text-rialo-text">Connect Web3 Wallet</h3>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-rialo-accent/10 text-rialo-accent px-2 py-0.5 font-bold border border-rialo-accent/20">
              Rialo 50ms
            </span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1">
            Choose your preferred wallet provider to interact with Rialo Testnet (Chain ID 7146).
          </p>
        </div>

        {/* Provider List */}
        <div className="mt-4 space-y-2.5">
          {providers.map((p) => {
            const isDemo = p.id === 'demo';

            return (
              <div
                key={p.id}
                className={`border transition-all ${
                  isDemo
                    ? 'bg-rialo-accent/5 border-rialo-accent/40 hover:border-rialo-accent'
                    : 'bg-rialo-surface border-rialo-border hover:border-rialo-text hover:bg-rialo-sand/40'
                }`}
              >
                <button
                  onClick={() => handleSelectProvider(p.id)}
                  disabled={walletState.isConnecting}
                  className="w-full p-3.5 flex items-center justify-between text-left disabled:opacity-60 group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {getProviderIcon(p.id)}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-rialo-text font-display">
                          {p.name}
                        </span>
                        {isDemo && (
                          <span className="text-[9px] uppercase font-mono tracking-wider bg-rialo-accent text-rialo-bg px-1.5 py-0.2 font-semibold">
                            Recommended for Review
                          </span>
                        )}
                        {!isDemo && p.isInstalled && (
                          <span className="text-[9px] uppercase font-mono tracking-wider text-status-online font-semibold">
                            Installed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-rialo-subtext truncate mt-0.5 font-sans">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="pl-2 shrink-0">
                    {walletState.isConnecting ? (
                      <Loader2 className="w-4 h-4 text-rialo-accent animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-rialo-muted group-hover:text-rialo-text group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>

                {/* If not installed and has download url, provide direct link */}
                {!isDemo && !p.isInstalled && p.downloadUrl && (
                  <div className="px-3.5 pb-2.5 pt-0 flex justify-end">
                    <a
                      href={p.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-rialo-muted hover:text-rialo-accent flex items-center space-x-1"
                    >
                      <span>Install extension</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Notes */}
        <div className="mt-5 pt-3 border-t border-rialo-border flex items-center justify-between text-[11px] font-mono text-rialo-subtext">
          <span>Network: Rialo Testnet (0x1BEA)</span>
          <span>Target: 50ms Block Time</span>
        </div>
      </div>
    </div>
  );
};
