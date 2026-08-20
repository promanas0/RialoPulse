import { useState, useEffect, useRef } from 'react';
import type { NetworkType, RpcEndpoint, NetworkMetrics, TpsDataPoint, PeerNode, ContractEvent } from './types';
import { INITIAL_RPC_ENDPOINTS, INITIAL_PEERS, INITIAL_EVENTS, RPC_PRESETS, INITIAL_FAUCET_STATUS } from './services/mockDataService';
import { TelemetryEngine } from './services/telemetryService';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { SpotlightHero } from './components/SpotlightHero';
import { MarqueeStrip } from './components/MarqueeStrip';
import { InteractiveCliTerminal } from './components/InteractiveCliTerminal';
import { BentoGrid } from './components/BentoGrid';
import { TelemetryMetrics } from './components/TelemetryMetrics';
import { PeerVisualizer } from './components/PeerVisualizer';
import { ContractSandbox } from './components/ContractSandbox';
import { DevToolkit } from './components/DevToolkit';
import { MarketReflexGame } from './components/MarketReflexGame';
import { WalletConnectModal } from './components/WalletConnectModal';
import { AccountModal } from './components/AccountModal';
import { WrongNetworkBanner } from './components/WrongNetworkBanner';
import { Gamepad2 } from 'lucide-react';
import { Toaster } from 'sonner';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Testnet');

  // Core telemetry state
  const [rpcEndpoints, setRpcEndpoints] = useState<RpcEndpoint[]>(INITIAL_RPC_ENDPOINTS);
  const [peers, setPeers] = useState<PeerNode[]>(INITIAL_PEERS);
  const [events, setEvents] = useState<ContractEvent[]>(INITIAL_EVENTS);

  const { setOnAddEvent } = useWallet();

  const [metrics, setMetrics] = useState<NetworkMetrics>({
    currentBlockHeight: 18492042,
    avgBlockTimeMs: 50,
    liveTps: 18420,
    maxTps24h: 24890,
    baseFeeGwei: 0.85,
    priorityFeeGwei: 0.05,
    activePeersCount: 148,
    rexExecutionCount: 4821,
    uptimePercentage: 99.98
  });

  const [tpsHistory, setTpsHistory] = useState<TpsDataPoint[]>([
    { time: '12:45', tps: 16200, blockHeight: 18491800, gasUsed: 42 },
    { time: '12:46', tps: 17800, blockHeight: 18491850, gasUsed: 46 },
    { time: '12:47', tps: 15400, blockHeight: 18491900, gasUsed: 39 },
    { time: '12:48', tps: 19200, blockHeight: 18491950, gasUsed: 52 },
    { time: '12:49', tps: 18100, blockHeight: 18492000, gasUsed: 48 },
    { time: '12:50', tps: 18420, blockHeight: 18492042, gasUsed: 50 }
  ]);

  const engineRef = useRef<TelemetryEngine | null>(null);

  const handleAddContractEvent = (newEvent: ContractEvent) => {
    setEvents(prev => [newEvent, ...prev.slice(0, 24)]);
  };

  // Wire up WalletContext event callback to live streamer
  useEffect(() => {
    setOnAddEvent(handleAddContractEvent);
  }, [setOnAddEvent]);

  // Initialize Telemetry Engine
  useEffect(() => {
    const engine = new TelemetryEngine(INITIAL_RPC_ENDPOINTS);
    engineRef.current = engine;

    const unsubscribe = engine.subscribe((newMetrics, newHistory, newEndpoints) => {
      setMetrics(newMetrics);
      setTpsHistory(newHistory);
      setRpcEndpoints(newEndpoints);

      // Keep peers block height in sync with current network block height
      setPeers(prev => prev.map(p => ({
        ...p,
        blockHeight: p.status === 'synced' ? newMetrics.currentBlockHeight : newMetrics.currentBlockHeight - 4,
        pingMs: Math.max(10, p.pingMs + (newMetrics.currentBlockHeight % 3) - 1)
      })));
    });

    engine.start();

    return () => {
      unsubscribe();
      engine.stop();
    };
  }, []);

  const handleRefreshPings = () => {
    if (engineRef.current) {
      engineRef.current.pingAllEndpoints();
    }
  };

  const handleAddCustomPeer = (newPeer: PeerNode) => {
    setPeers(prev => [newPeer, ...prev]);
  };

  return (
    <div className="min-h-screen bg-rialo-bg text-rialo-text flex flex-col font-sans relative selection:bg-rialo-accent selection:text-white">
      {/* 3% Matte Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Top Radial Spotlight Glow */}
      <div className="pointer-events-none fixed inset-0 spotlight-glow z-0" />
      <div className="pointer-events-none fixed inset-0 spotlight-glow-secondary z-0" />

      {/* Wrong Network Banner */}
      <WrongNetworkBanner />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        currentBlockHeight={metrics.currentBlockHeight}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-12">
        {/* Tier-1 Overview Landing Page Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* 1. Tier-1 Spotlight Hero Section with 3D Globe */}
            <SpotlightHero
              peers={peers}
              currentBlockHeight={metrics.currentBlockHeight}
              onNavigateTab={setActiveTab}
            />

            {/* 2. Auto-scrolling Infinite Marquee Tech Strip */}
            <MarqueeStrip />

            {/* 3. Market Reflex Arcade Quick Launch Banner */}
            <div className="relative overflow-hidden border border-rialo-accent/40 bg-gradient-to-r from-rialo-accent/10 via-rialo-surface to-rialo-cyan/10 p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-rialo-accent text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span>Arcade Reflex Challenge</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-rialo-text">
                  Can Your Reflexes Beat Rialo's 50ms Block Finality?
                </h3>
                <p className="text-xs text-rialo-subtext font-sans max-w-xl">
                  Test your microsecond instincts in the Market Reflex Game. Match live streaming candlesticks, build combo streaks, and claim testnet token rewards!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('game')}
                className="bg-rialo-accent hover:bg-rialo-accent-hover text-white px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-rialo-accent/30 shrink-0 cursor-pointer flex items-center space-x-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Reflex Game</span>
              </button>
            </div>

            {/* 4. Live On-Chain Interactive CLI Terminal Playground */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-rialo-text tracking-tight flex items-center space-x-2">
                    <span>Interactive On-Chain Playground</span>
                    <span className="w-2 h-2 rounded-full bg-status-online-bright animate-subtle-pulse"></span>
                  </h2>
                  <p className="text-xs text-rialo-subtext mt-1">
                    Execute real-time consensus queries, testnet drips, and parallel VM inspection directly from your browser
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rialo-muted border border-rialo-border px-2 py-1 hidden sm:inline-block">
                  Live Terminal v0.9.4
                </span>
              </div>

              <InteractiveCliTerminal />
            </div>

            {/* 5. Bento Grid Architectural Highlights */}
            <BentoGrid
              onNavigateTab={setActiveTab}
              currentBlockHeight={metrics.currentBlockHeight}
            />
          </div>
        )}

        {/* Market Reflex Arcade Game Tab */}
        {activeTab === 'game' && (
          <div className="animate-in fade-in duration-300">
            <MarketReflexGame />
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="animate-in fade-in duration-300">
            <TelemetryMetrics
              rpcEndpoints={rpcEndpoints}
              metrics={metrics}
              tpsHistory={tpsHistory}
              onRefreshPings={handleRefreshPings}
            />
          </div>
        )}

        {activeTab === 'peers' && (
          <div className="animate-in fade-in duration-300">
            <PeerVisualizer
              peers={peers}
              onAddPeer={handleAddCustomPeer}
              currentBlockHeight={metrics.currentBlockHeight}
            />
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="animate-in fade-in duration-300">
            <ContractSandbox
              events={events}
              rpcPresets={RPC_PRESETS}
              rpcEndpoints={rpcEndpoints}
              onClearEvents={() => setEvents([])}
              onAddEvent={handleAddContractEvent}
              currentBlockHeight={metrics.currentBlockHeight}
            />
          </div>
        )}

        {activeTab === 'toolkit' && (
          <div className="animate-in fade-in duration-300">
            <DevToolkit
              faucetStatus={INITIAL_FAUCET_STATUS}
              currentBlockHeight={metrics.currentBlockHeight}
            />
          </div>
        )}
      </main>

      {/* Wallet Modals */}
      <WalletConnectModal />
      <AccountModal />

      {/* Toast Notification Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true
        }}
      />

      {/* Clean Cyberpunk Footer */}
      <footer className="border-t border-rialo-border bg-rialo-surface/80 backdrop-blur-md py-8 text-xs text-rialo-subtext font-mono relative z-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-rialo-text font-display text-base">Rialo</span>
              <span className="w-2 h-2 rounded-full bg-rialo-accent inline-block"></span>
              <span className="font-display text-sm text-rialo-subtext">Pulse</span>
            </div>
            <span>•</span>
            <span className="text-rialo-muted">Tier-1 Real-Time Infrastructure Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <span>REX Parallel Engine</span>
            <span>50ms Block Target</span>
            <a
              href="https://explorer.rialo.io"
              target="_blank"
              rel="noreferrer"
              className="text-rialo-accent hover:underline font-semibold"
            >
              Block Explorer ↗
            </a>
            <a
              href="https://rialo.io/for-devs"
              target="_blank"
              rel="noreferrer"
              className="text-rialo-text hover:underline font-semibold"
            >
              Developer Docs ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <WalletProvider>
      <DashboardContent />
    </WalletProvider>
  );
}

export default App;
