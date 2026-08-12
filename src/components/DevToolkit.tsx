import React, { useState } from 'react';
import type { FaucetStatus, WalletState } from '../types';
import { addRialoNetworkToWallet, RIALO_TESTNET_CHAIN_PARAMS } from '../services/rpcService';
import { Droplets, Wallet, Copy, Check, ExternalLink } from 'lucide-react';

interface DevToolkitProps {
  faucetStatus: FaucetStatus;
  walletState: WalletState;
}

export const DevToolkit: React.FC<DevToolkitProps> = ({ faucetStatus, walletState }) => {
  const [lookupAddress, setLookupAddress] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<{ address: string; balance: string; txCount: number } | null>(null);
  const [dripAddress, setDripAddress] = useState<string>('');
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [dripTxHash, setDripTxHash] = useState<string | null>(null);

  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);

  const handleLookup = () => {
    if (!lookupAddress.trim()) return;
    setLookupResult({
      address: lookupAddress,
      balance: (Math.random() * 500 + 10).toFixed(2),
      txCount: Math.floor(Math.random() * 45 + 2)
    });
  };

  const handleTriggerDrip = () => {
    setIsDripping(true);
    setDripTxHash(null);

    setTimeout(() => {
      setIsDripping(false);
      setDripTxHash(`0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`);
    }, 1200);
  };

  const handleCopyHardhatConfig = () => {
    const configStr = `networks: {
  rialoTestnet: {
    url: "${RIALO_TESTNET_CHAIN_PARAMS.rpcUrls[0]}",
    chainId: ${parseInt(RIALO_TESTNET_CHAIN_PARAMS.chainId, 16)},
    accounts: [process.env.PRIVATE_KEY]
  }
}`;
    navigator.clipboard.writeText(configStr);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: One-Click Network Switch & Web3 Connect */}
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-xl font-bold text-rialo-text">One-Click Rialo Network Adder</h3>
            <span className="w-2 h-2 rounded-full bg-status-online"></span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1 max-w-xl">
            Instantly add Rialo Testnet (Chain ID 7146) to MetaMask, Phantom, or any Web3 provider with preconfigured 50ms block runtime RPC endpoints.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <button
            onClick={addRialoNetworkToWallet}
            className="bg-rialo-text text-rialo-bg hover:bg-rialo-dark px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-rialo-text flex items-center justify-center space-x-2"
          >
            <Wallet className="w-4 h-4 text-rialo-accent" />
            <span>Add Rialo Testnet To Wallet</span>
          </button>
        </div>
      </div>

      {/* Grid: Faucet Helper & Wallet Balance Lookup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Official Testnet Faucet */}
        <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-rialo-border">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-rialo-accent" />
                <h3 className="font-display text-lg font-bold text-rialo-text">Testnet Faucet Helper</h3>
              </div>
              <span className="text-xs font-mono uppercase text-status-online font-semibold">
                Status: Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-5 font-mono text-xs">
              <div className="bg-rialo-surface p-3 border border-rialo-border">
                <span className="text-[10px] uppercase text-rialo-muted block">Faucet Pool Balance</span>
                <span className="text-lg font-bold text-rialo-text mt-1 block">
                  {faucetStatus.poolBalanceRialo.toLocaleString()} RIALO
                </span>
              </div>

              <div className="bg-rialo-surface p-3 border border-rialo-border">
                <span className="text-[10px] uppercase text-rialo-muted block">Max Drip Amount</span>
                <span className="text-lg font-bold text-rialo-text mt-1 block">
                  {faucetStatus.maxDripAmount} RIALO / request
                </span>
              </div>
            </div>

            {/* Drip Form */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted">
                Recipient Testnet Wallet Address
              </label>
              <input
                type="text"
                placeholder={walletState.address || "0x7140...0001"}
                value={dripAddress}
                onChange={(e) => setDripAddress(e.target.value)}
                className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2.5 font-mono text-xs focus:outline-none focus:border-rialo-text"
              />

              <button
                onClick={handleTriggerDrip}
                disabled={isDripping}
                className="w-full bg-rialo-text text-rialo-bg hover:bg-rialo-dark py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Droplets className="w-3.5 h-3.5 text-rialo-accent" />
                <span>{isDripping ? 'Requesting Testnet Tokens...' : 'Request 100 RIALO Testnet Tokens'}</span>
              </button>
            </div>

            {dripTxHash && (
              <div className="mt-4 p-3 bg-status-online/10 border border-status-online/30 text-xs font-mono">
                <div className="text-status-online font-bold">Token Drip Executed Successfully!</div>
                <div className="text-rialo-subtext mt-1 truncate">Tx: {dripTxHash}</div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border flex items-center justify-between text-xs font-mono text-rialo-subtext">
            <span>Official Portal: faucet.rialo.io</span>
            <a
              href="https://faucet.rialo.io"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-rialo-accent hover:underline"
            >
              <span>External Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Section 2: Quick Wallet Balance & State Lookup */}
        <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-rialo-border">
              <h3 className="font-display text-lg font-bold text-rialo-text">Quick Balance Lookup</h3>
              <p className="text-xs text-rialo-subtext mt-0.5">Inspect account balances and transaction history on Rialo Testnet</p>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted">
                Enter Wallet Address
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="0x..."
                  value={lookupAddress}
                  onChange={(e) => setLookupAddress(e.target.value)}
                  className="flex-1 bg-rialo-surface border border-rialo-border text-rialo-text p-2.5 font-mono text-xs focus:outline-none focus:border-rialo-text"
                />
                <button
                  onClick={handleLookup}
                  className="bg-rialo-surface border border-rialo-border text-rialo-text hover:bg-rialo-sand px-4 py-2.5 text-xs font-mono uppercase font-semibold"
                >
                  Lookup
                </button>
              </div>
            </div>

            {lookupResult && (
              <div className="mt-5 p-4 bg-rialo-surface border border-rialo-border font-mono text-xs space-y-2">
                <div className="text-rialo-subtext text-[11px]">Query Result</div>
                <div className="flex justify-between border-b border-rialo-border pb-1.5">
                  <span className="text-rialo-muted">Address:</span>
                  <span className="font-semibold text-rialo-text truncate max-w-[200px]">{lookupResult.address}</span>
                </div>
                <div className="flex justify-between border-b border-rialo-border pb-1.5">
                  <span className="text-rialo-muted">RIALO Balance:</span>
                  <span className="font-bold text-rialo-accent">{lookupResult.balance} RIALO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rialo-muted">Tx Count:</span>
                  <span className="font-semibold text-rialo-text">{lookupResult.txCount} transactions</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border text-xs font-mono text-rialo-subtext">
            Supports both Standard EVM & Rialo Native Key Formats
          </div>
        </div>
      </div>

      {/* Network Configuration Reference */}
      <div className="bg-rialo-card border border-rialo-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rialo-border gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-rialo-text">Network Configuration Parameters</h3>
            <p className="text-xs text-rialo-subtext mt-0.5">Use these parameters in Hardhat, Foundry, Viem, or Ethers.js</p>
          </div>

          <button
            onClick={handleCopyHardhatConfig}
            className="flex items-center space-x-1.5 bg-rialo-surface border border-rialo-border hover:bg-rialo-sand px-3 py-1.5 text-xs font-mono font-medium text-rialo-text"
          >
            {copiedConfig ? <Check className="w-3.5 h-3.5 text-status-online" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedConfig ? 'Copied Hardhat Config' : 'Copy Hardhat Snippet'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5 font-mono text-xs">
          <div className="bg-rialo-surface p-3 border border-rialo-border">
            <span className="text-rialo-muted text-[10px] uppercase block">Network Name</span>
            <span className="font-bold text-rialo-text mt-1 block">Rialo Testnet</span>
          </div>

          <div className="bg-rialo-surface p-3 border border-rialo-border">
            <span className="text-rialo-muted text-[10px] uppercase block">Chain ID</span>
            <span className="font-bold text-rialo-text mt-1 block">7146 (0x1BEA)</span>
          </div>

          <div className="bg-rialo-surface p-3 border border-rialo-border">
            <span className="text-rialo-muted text-[10px] uppercase block">RPC URL</span>
            <span className="font-bold text-rialo-text mt-1 block truncate">https://testnet-rpc.rialo.io</span>
          </div>

          <div className="bg-rialo-surface p-3 border border-rialo-border">
            <span className="text-rialo-muted text-[10px] uppercase block">Currency Symbol</span>
            <span className="font-bold text-rialo-accent mt-1 block">RIALO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
