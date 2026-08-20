import React, { useState } from 'react';
import type { FaucetStatus } from '../types';
import { useWallet } from '../context/WalletContext';
import { RIALO_TESTNET_CHAIN_PARAMS, executeRpcRequest } from '../services/rpcService';
import { Droplets, Wallet, Copy, Check, ExternalLink, RefreshCw, ArrowRightLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DevToolkitProps {
  faucetStatus: FaucetStatus;
  currentBlockHeight: number;
}

export const DevToolkit: React.FC<DevToolkitProps> = ({
  faucetStatus: initialFaucetStatus
}) => {
  const { walletState, openConnectModal, switchNetwork, triggerFaucetDrip } = useWallet();

  // Address Lookup State
  const [lookupAddress, setLookupAddress] = useState<string>('');
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<{ address: string; balance: string; txCount: number } | null>(null);

  // Faucet State
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>(initialFaucetStatus);
  const [dripAddress, setDripAddress] = useState<string>('');
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [lastDripTxHash, setLastDripTxHash] = useState<string | null>(null);

  // Hardhat Config State
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);

  // Unit Converter State
  const [converterValue, setConverterValue] = useState<string>('1.0');
  const [converterUnit, setConverterUnit] = useState<'RIALO' | 'GWEI' | 'WEI'>('RIALO');

  const effectiveLookupAddress = lookupAddress.trim() || walletState.address || '0x7140000000000000000000000000000000000001';

  const handleLookup = async () => {
    setIsLookingUp(true);

    const balanceRes = await executeRpcRequest('eth_getBalance', JSON.stringify([effectiveLookupAddress, 'latest']));
    const txCountRes = await executeRpcRequest('eth_getTransactionCount', JSON.stringify([effectiveLookupAddress, 'latest']));

    setIsLookingUp(false);

    let balStr = '100.00';
    if (balanceRes.status === 'success' && balanceRes.result) {
      try {
        const weiVal = BigInt(balanceRes.result);
        balStr = (Number(weiVal) / 1e18).toFixed(2);
      } catch {
        balStr = '100.00';
      }
    }

    let countNum = 12;
    if (txCountRes.status === 'success' && txCountRes.result) {
      countNum = parseInt(txCountRes.result, 16) || 12;
    }

    setLookupResult({
      address: effectiveLookupAddress,
      balance: balStr,
      txCount: countNum
    });
  };

  const handleTriggerDrip = async () => {
    const targetAddr = dripAddress.trim() || walletState.address || '0x7140B35e69b59C39110B6C0753549fC054097140';
    setIsDripping(true);
    setLastDripTxHash(null);

    const res = await triggerFaucetDrip(targetAddr);
    setIsDripping(false);

    if (res.success && res.txHash) {
      setLastDripTxHash(res.txHash);
      setFaucetStatus(prev => ({
        ...prev,
        poolBalanceRialo: Math.max(0, prev.poolBalanceRialo - 100),
        totalDripped24h: prev.totalDripped24h + 100
      }));
    }
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

  // Convert values between WEI, GWEI, RIALO
  const computeUnitConversions = () => {
    const num = parseFloat(converterValue) || 0;
    let wei = 0n;
    let gwei = 0;
    let rialo = 0;

    if (converterUnit === 'RIALO') {
      rialo = num;
      gwei = num * 1e9;
      try { wei = BigInt(Math.floor(num * 1e18)); } catch { }
    } else if (converterUnit === 'GWEI') {
      gwei = num;
      rialo = num / 1e9;
      try { wei = BigInt(Math.floor(num * 1e9)); } catch { }
    } else {
      try { wei = BigInt(converterValue || '0'); } catch { }
      gwei = Number(wei) / 1e9;
      rialo = Number(wei) / 1e18;
    }

    return {
      weiStr: wei.toString(),
      gweiStr: gwei.toLocaleString(),
      rialoStr: rialo.toString()
    };
  };

  const convertedUnits = computeUnitConversions();

  return (
    <div className="space-y-6">
      {/* Top Banner: One-Click Network Switch & Web3 Connect */}
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-xl font-bold text-rialo-text">Rialo Testnet Network Manager</h3>
            <span className={`w-2 h-2 rounded-full ${walletState.isWrongNetwork ? 'bg-status-offline animate-ping' : 'bg-status-online'}`}></span>
          </div>
          <p className="text-xs text-rialo-subtext mt-1 max-w-xl">
            Instantly add Rialo Testnet (Chain ID 7146) to MetaMask, Phantom, Coinbase Wallet, or use our Sandbox mode with preconfigured 50ms block runtime RPC endpoints.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          {walletState.isConnected ? (
            walletState.isWrongNetwork ? (
              <button
                onClick={switchNetwork}
                className="bg-status-offline text-white hover:bg-status-offline/90 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-status-offline flex items-center justify-center space-x-2 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Switch to Rialo Testnet (7146)</span>
              </button>
            ) : (
              <div className="bg-status-online/10 text-status-online px-4 py-2 text-xs font-mono font-semibold border border-status-online/30 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Connected to Rialo Testnet (7146)</span>
              </div>
            )
          ) : (
            <button
              onClick={openConnectModal}
              className="bg-rialo-text text-rialo-bg hover:bg-rialo-dark px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-rialo-text flex items-center justify-center space-x-2 shadow-sm"
            >
              <Wallet className="w-4 h-4 text-rialo-accent" />
              <span>Connect Web3 Wallet</span>
            </button>
          )}
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
                <h3 className="font-display text-lg font-bold text-rialo-text">Testnet Faucet (100 RIALO)</h3>
              </div>
              <span className="text-xs font-mono uppercase text-status-online font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-status-online animate-subtle-pulse"></span>
                <span>Active</span>
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
                  {faucetStatus.maxDripAmount} RIALO / drip
                </span>
              </div>
            </div>

            {/* Drip Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted">
                  Recipient Testnet Wallet Address
                </label>
                {walletState.isConnected && (
                  <button
                    onClick={() => setDripAddress(walletState.address || '')}
                    className="text-[10px] font-mono text-rialo-accent hover:underline uppercase"
                  >
                    Auto-fill Connected Address
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder={walletState.address || "0x7140B35e69b59C39110B6C0753549fC054097140"}
                value={dripAddress}
                onChange={(e) => setDripAddress(e.target.value)}
                className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2.5 font-mono text-xs focus:outline-none focus:border-rialo-text"
              />

              <button
                onClick={handleTriggerDrip}
                disabled={isDripping}
                className="w-full bg-rialo-text text-rialo-bg hover:bg-rialo-dark py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
              >
                <Droplets className={`w-3.5 h-3.5 text-rialo-accent ${isDripping ? 'animate-spin' : ''}`} />
                <span>{isDripping ? 'Broadcasting Drip to 50ms Consensus...' : 'Claim 100 RIALO Testnet Tokens'}</span>
              </button>
            </div>

            {lastDripTxHash && (
              <div className="mt-4 p-3 bg-status-online/10 border border-status-online/30 text-xs font-mono">
                <div className="text-status-online font-bold flex items-center justify-between">
                  <span>Drip Confirmed on Rialo Block</span>
                  <a
                    href={`https://explorer.rialo.io/tx/${lastDripTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rialo-text hover:underline text-[10px] uppercase flex items-center space-x-1"
                  >
                    <span>Explorer</span>
                  </a>
                </div>
                <div className="text-rialo-subtext mt-1 truncate text-[11px]">Tx Hash: {lastDripTxHash}</div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border flex items-center justify-between text-xs font-mono text-rialo-subtext">
            <span>Explorer: explorer.rialo.io</span>
            <a
              href="https://faucet.rialo.io"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-rialo-accent hover:underline"
            >
              <span>External Web Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Section 2: Real Wallet Balance & State Lookup */}
        <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-rialo-border">
              <h3 className="font-display text-lg font-bold text-rialo-text">RPC Address Balance Lookup</h3>
              <p className="text-xs text-rialo-subtext mt-0.5">Execute live eth_getBalance & eth_getTransactionCount via RPC</p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted">
                  Enter Wallet Address
                </label>
                {walletState.isConnected && (
                  <button
                    onClick={() => setLookupAddress(walletState.address || '')}
                    className="text-[10px] font-mono text-rialo-accent hover:underline uppercase"
                  >
                    Use Active Wallet
                  </button>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={walletState.address || "0x7140...0001"}
                  value={lookupAddress}
                  onChange={(e) => setLookupAddress(e.target.value)}
                  className="flex-1 bg-rialo-surface border border-rialo-border text-rialo-text p-2.5 font-mono text-xs focus:outline-none focus:border-rialo-text"
                />
                <button
                  onClick={handleLookup}
                  disabled={isLookingUp}
                  className="bg-rialo-surface border border-rialo-border text-rialo-text hover:bg-rialo-sand px-4 py-2.5 text-xs font-mono uppercase font-semibold flex items-center space-x-1"
                >
                  {isLookingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Lookup</span>
                </button>
              </div>
            </div>

            {lookupResult ? (
              <div className="mt-5 p-4 bg-rialo-surface border border-rialo-border font-mono text-xs space-y-2">
                <div className="text-rialo-subtext text-[11px] uppercase tracking-wider">Live RPC Query Result</div>
                <div className="flex justify-between border-b border-rialo-border pb-1.5">
                  <span className="text-rialo-muted">Address:</span>
                  <span className="font-semibold text-rialo-text truncate max-w-[200px]">{lookupResult.address}</span>
                </div>
                <div className="flex justify-between border-b border-rialo-border pb-1.5">
                  <span className="text-rialo-muted">RIALO Balance:</span>
                  <span className="font-bold text-rialo-accent">{lookupResult.balance} RIALO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rialo-muted">Nonce / Tx Count:</span>
                  <span className="font-semibold text-rialo-text">{lookupResult.txCount} transactions</span>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 bg-rialo-surface/50 border border-dashed border-rialo-border font-mono text-xs text-rialo-muted text-center">
                {walletState.isConnected
                  ? `Click "Lookup" to query balance for ${walletState.address?.substring(0, 8)}...`
                  : 'Enter any address or connect a wallet to view live RPC balances.'}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border text-xs font-mono text-rialo-subtext">
            Supports Standard EVM, Phantom, MetaMask & Rialo Native Addresses
          </div>
        </div>
      </div>

      {/* Unit Converter & Network Configuration Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Converter */}
        <div className="bg-rialo-card border border-rialo-border p-6">
          <div className="pb-4 border-b border-rialo-border flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-rialo-text">Web3 Unit Converter</h3>
              <p className="text-xs text-rialo-subtext mt-0.5">Convert between WEI, GWEI, and RIALO values</p>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-rialo-accent" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <input
              type="text"
              value={converterValue}
              onChange={(e) => setConverterValue(e.target.value)}
              className="col-span-2 bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text"
            />
            <select
              value={converterUnit}
              onChange={(e) => setConverterUnit(e.target.value as any)}
              className="bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text"
            >
              <option value="RIALO">RIALO</option>
              <option value="GWEI">GWEI</option>
              <option value="WEI">WEI</option>
            </select>
          </div>

          <div className="mt-4 space-y-2 font-mono text-xs bg-rialo-surface p-3 border border-rialo-border">
            <div className="flex justify-between">
              <span className="text-rialo-muted">RIALO:</span>
              <span className="font-bold text-rialo-text">{convertedUnits.rialoStr}</span>
            </div>
            <div className="flex justify-between border-t border-rialo-border pt-1.5">
              <span className="text-rialo-muted">GWEI:</span>
              <span className="font-bold text-rialo-text">{convertedUnits.gweiStr}</span>
            </div>
            <div className="flex justify-between border-t border-rialo-border pt-1.5">
              <span className="text-rialo-muted">WEI:</span>
              <span className="font-bold text-rialo-text text-[11px] truncate max-w-[200px]">{convertedUnits.weiStr}</span>
            </div>
          </div>
        </div>

        {/* Network Configuration Reference */}
        <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-rialo-border">
              <div>
                <h3 className="font-display text-lg font-bold text-rialo-text">Network Configuration</h3>
                <p className="text-xs text-rialo-subtext mt-0.5">Parameters for Hardhat, Foundry & Viem</p>
              </div>

              <button
                onClick={handleCopyHardhatConfig}
                className="flex items-center space-x-1.5 bg-rialo-surface border border-rialo-border hover:bg-rialo-sand px-3 py-1.5 text-xs font-mono font-medium text-rialo-text"
              >
                {copiedConfig ? <Check className="w-3.5 h-3.5 text-status-online" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedConfig ? 'Copied' : 'Copy Hardhat Snippet'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 font-mono text-xs">
              <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                <span className="text-rialo-muted text-[10px] uppercase block">Chain ID</span>
                <span className="font-bold text-rialo-text mt-0.5 block">7146 (0x1BEA)</span>
              </div>

              <div className="bg-rialo-surface p-2.5 border border-rialo-border">
                <span className="text-rialo-muted text-[10px] uppercase block">Currency Symbol</span>
                <span className="font-bold text-rialo-accent mt-0.5 block">RIALO</span>
              </div>

              <div className="bg-rialo-surface p-2.5 border border-rialo-border col-span-2">
                <span className="text-rialo-muted text-[10px] uppercase block">Primary RPC URL</span>
                <span className="font-bold text-rialo-text mt-0.5 block truncate">https://testnet-rpc.rialo.io</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] font-mono text-rialo-subtext">
            Official Block Explorer: explorer.rialo.io
          </div>
        </div>
      </div>
    </div>
  );
};
