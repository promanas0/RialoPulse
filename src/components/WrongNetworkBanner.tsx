import React from 'react';
import { useWallet } from '../context/WalletContext';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const WrongNetworkBanner: React.FC = () => {
  const { walletState, switchNetwork } = useWallet();

  if (!walletState.isConnected || !walletState.isWrongNetwork) {
    return null;
  }

  return (
    <div className="bg-[#C43D3D] text-white px-4 py-2.5 shadow-md font-mono text-xs z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 text-white shrink-0 animate-bounce" />
          <span>
            <strong>Wrong Network Detected:</strong> You are currently connected to an unsupported network (Chain ID:{' '}
            {walletState.networkId || walletState.chainIdHex || 'Unknown'}). Please switch to <strong>Rialo Testnet (Chain ID 7146)</strong>.
          </span>
        </div>

        <button
          onClick={switchNetwork}
          className="bg-white text-[#C43D3D] hover:bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Switch Network Now</span>
        </button>
      </div>
    </div>
  );
};
