import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { getExplorerAddressUrl } from '../services/transactionToast';
import { X, Copy, Check, ExternalLink, Droplets, LogOut, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    closeAccountModal,
    walletState,
    disconnect,
    switchNetwork,
    refreshBalance,
    triggerFaucetDrip
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [isDripping, setIsDripping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isAccountModalOpen || !walletState.isConnected || !walletState.address) {
    return null;
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletState.address!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleClaimFaucet = async () => {
    setIsDripping(true);
    await triggerFaucetDrip(walletState.address!);
    setIsDripping(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-rialo-card border-2 border-rialo-text max-w-md w-full shadow-2xl p-6 relative font-sans animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={closeAccountModal}
          className="absolute top-4 right-4 text-rialo-muted hover:text-rialo-text p-1 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-rialo-border">
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-xl font-bold text-rialo-text">Connected Account</h3>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-rialo-surface text-rialo-subtext px-2 py-0.5 border border-rialo-border font-semibold">
              {walletState.walletType?.toUpperCase() || 'WEB3'}
            </span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1">
            Active wallet session on the Rialo ecosystem
          </p>
        </div>

        {/* Address Card */}
        <div className="mt-4 p-3.5 bg-rialo-surface border border-rialo-border font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-rialo-muted text-[11px] uppercase tracking-wider">Wallet Address</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAddress}
                className="flex items-center space-x-1 text-rialo-subtext hover:text-rialo-text transition-colors"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-status-online" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={getExplorerAddressUrl(walletState.address)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-rialo-accent hover:underline"
                title="View on Rialo Explorer"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="font-bold text-rialo-text break-all text-[13px] pt-1">
            {walletState.address}
          </div>
        </div>

        {/* Network & Balance Overview */}
        <div className="grid grid-cols-2 gap-3 mt-3 font-mono text-xs">
          {/* Network Pill */}
          <div className={`p-3 border ${
            walletState.isWrongNetwork
              ? 'bg-status-offline/10 border-status-offline/30'
              : 'bg-rialo-surface border-rialo-border'
          }`}>
            <span className="text-rialo-muted text-[10px] uppercase block">Network Status</span>
            <div className="mt-1 flex items-center space-x-1.5 font-bold">
              {walletState.isWrongNetwork ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-status-offline shrink-0" />
                  <span className="text-status-offline text-[11px]">Wrong Chain ({walletState.networkId || '?'})</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-online shrink-0" />
                  <span className="text-status-online text-[11px]">Rialo Testnet</span>
                </>
              )}
            </div>
          </div>

          {/* Balance Pill */}
          <div className="p-3 bg-rialo-surface border border-rialo-border">
            <div className="flex items-center justify-between">
              <span className="text-rialo-muted text-[10px] uppercase block">Balance</span>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-rialo-muted hover:text-rialo-text"
                title="Refresh Balance"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="mt-1 font-bold text-rialo-text text-sm truncate">
              <span className="text-rialo-accent">{walletState.balanceRialo}</span> RIALO
            </div>
          </div>
        </div>

        {/* Wrong Network Action Button */}
        {walletState.isWrongNetwork && (
          <div className="mt-3">
            <button
              onClick={switchNetwork}
              className="w-full bg-status-offline text-white hover:bg-status-offline/90 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Switch to Rialo Testnet (7146)</span>
            </button>
          </div>
        )}

        {/* Quick Faucet Claim Button */}
        <div className="mt-3">
          <button
            onClick={handleClaimFaucet}
            disabled={isDripping}
            className="w-full bg-rialo-surface hover:bg-rialo-sand border border-rialo-border text-rialo-text py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Droplets className="w-4 h-4 text-rialo-accent" />
            <span>{isDripping ? 'Dripping 100 RIALO...' : 'Get 100 RIALO Testnet Faucet'}</span>
          </button>
        </div>

        {/* Disconnect Action */}
        <div className="mt-4 pt-4 border-t border-rialo-border flex items-center justify-between">
          <button
            onClick={disconnect}
            className="text-xs font-mono uppercase tracking-wider text-status-offline hover:underline flex items-center space-x-1.5 font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect Wallet</span>
          </button>

          <button
            onClick={closeAccountModal}
            className="text-xs font-mono uppercase tracking-wider text-rialo-subtext hover:text-rialo-text px-3 py-1 border border-rialo-border"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
