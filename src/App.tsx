import { useState, useEffect, useRef } from 'react';
import type { NetworkType, RpcEndpoint, NetworkMetrics, TpsDataPoint, PeerNode, ContractEvent, WalletState } from './types';
import { INITIAL_RPC_ENDPOINTS, INITIAL_PEERS, INITIAL_EVENTS, RPC_PRESETS, INITIAL_FAUCET_STATUS } from './services/mockDataService';
import { TelemetryEngine } from './services/telemetryService';
import { Header } from './components/Header';
import { TelemetryMetrics } from './components/TelemetryMetrics';
import { PeerVisualizer } from './components/PeerVisualizer';
import { ContractSandbox } from './components/ContractSandbox';
import { DevToolkit } from './components/DevToolkit';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('telemetry');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Testnet');

  // Core telemetry state
  const [rpcEndpoints, setRpcEndpoints] = useState<RpcEndpoint[]>(INITIAL_RPC_ENDPOINTS);
  const [peers, setPeers] = useState<PeerNode[]>(INITIAL_PEERS);
  const [events, setEvents] = useState<ContractEvent[]>(INITIAL_EVENTS);
  
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    balanceRialo: '250.00',
    networkId: null
  });

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

  const handleAddContractEvent = (newEvent: ContractEvent) => {
    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  const handleAddCustomPeer = (newPeer: PeerNode) => {
    setPeers(prev => [newPeer, ...prev]);
  };

  return (
    <div className="min-h-screen bg-rialo-bg text-rialo-text flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        currentBlockHeight={metrics.currentBlockHeight}
        walletState={walletState}
        setWalletState={setWalletState}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'telemetry' && (
          <TelemetryMetrics
            rpcEndpoints={rpcEndpoints}
            metrics={metrics}
            tpsHistory={tpsHistory}
            onRefreshPings={handleRefreshPings}
          />
        )}

        {activeTab === 'peers' && (
          <PeerVisualizer
            peers={peers}
            onAddPeer={handleAddCustomPeer}
            currentBlockHeight={metrics.currentBlockHeight}
          />
        )}

        {activeTab === 'sandbox' && (
          <ContractSandbox
            events={events}
            rpcPresets={RPC_PRESETS}
            rpcEndpoints={rpcEndpoints}
            onClearEvents={() => setEvents([])}
            onAddEvent={handleAddContractEvent}
            currentBlockHeight={metrics.currentBlockHeight}
          />
        )}

        {activeTab === 'toolkit' && (
          <DevToolkit
            faucetStatus={INITIAL_FAUCET_STATUS}
            walletState={walletState}
            setWalletState={setWalletState}
            onAddEvent={handleAddContractEvent}
            currentBlockHeight={metrics.currentBlockHeight}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-rialo-border bg-rialo-bg py-6 text-xs text-rialo-subtext font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-rialo-text font-display text-sm">RialoPulse</span>
            <span>•</span>
            <span>Real-time Network Telemetry Platform</span>
          </div>

          <div className="flex items-center space-x-6">
            <span>Rialo Extended Execution (REX) Runtime</span>
            <span>Block Time Target: 50ms</span>
            <a
              href="https://rialo.io/for-devs"
              target="_blank"
              rel="noreferrer"
              className="text-rialo-text hover:underline font-semibold"
            >
              Developer Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
