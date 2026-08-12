import { useState, useEffect } from 'react';
import type { NetworkType, RpcEndpoint, NetworkMetrics, TpsDataPoint, PeerNode, ContractEvent, WalletState } from './types';
import { INITIAL_RPC_ENDPOINTS, INITIAL_PEERS, INITIAL_EVENTS, RPC_PRESETS, INITIAL_FAUCET_STATUS } from './services/mockDataService';
import { Header } from './components/Header';
import { TelemetryMetrics } from './components/TelemetryMetrics';
import { PeerVisualizer } from './components/PeerVisualizer';
import { ContractSandbox } from './components/ContractSandbox';
import { DevToolkit } from './components/DevToolkit';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('telemetry');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Testnet');

  // Core state
  const [rpcEndpoints, setRpcEndpoints] = useState<RpcEndpoint[]>(INITIAL_RPC_ENDPOINTS);
  const [peers] = useState<PeerNode[]>(INITIAL_PEERS);
  const [events, setEvents] = useState<ContractEvent[]>(INITIAL_EVENTS);
  
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    balanceRialo: '0.00',
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

  // Handle Real-Time Live Ticker Loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Increment block height (simulate 50ms fast block runtime)
      setMetrics((prev) => {
        const nextBlock = prev.currentBlockHeight + 1;
        const tpsJitter = Math.floor(Math.random() * 1200) - 600;
        const newTps = Math.max(14000, Math.min(26000, prev.liveTps + tpsJitter));

        return {
          ...prev,
          currentBlockHeight: nextBlock,
          liveTps: newTps,
          rexExecutionCount: prev.rexExecutionCount + Math.floor(Math.random() * 3 + 1)
        };
      });

      // Periodically update TPS history chart
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTpsHistory((prev) => {
        const lastTps = prev[prev.length - 1]?.tps || 18000;
        const jitter = Math.floor(Math.random() * 800) - 400;
        const newPoint = {
          time: nowStr,
          tps: Math.max(12000, Math.min(25000, lastTps + jitter)),
          blockHeight: metrics.currentBlockHeight,
          gasUsed: Math.floor(Math.random() * 20 + 40)
        };
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });

      // Periodically stream a new contract event log
      if (Math.random() > 0.4) {
        const isRex = Math.random() > 0.6;
        const eventNames = isRex
          ? ['REXExecutionCommit', 'REXConfidentialCompute', 'ZkProofVerify']
          : ['Transfer', 'GaslessExecution', 'StateCommitment', 'Approval'];
        const chosenEvent = eventNames[Math.floor(Math.random() * eventNames.length)];

        const newEvt: ContractEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          blockNumber: metrics.currentBlockHeight,
          txHash: `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`,
          eventName: chosenEvent,
          contractAddress: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          dataSummary: isRex
            ? `zkProof: verified, cycles: ${Math.floor(Math.random() * 3000 + 1000)}, stateHash: 0x${Math.random().toString(16).substring(2, 8)}`
            : `txSender: 0x${Math.random().toString(16).substring(2, 6)}, gasPaid: 0.000${Math.floor(Math.random() * 9 + 1)} RIALO`,
          isRexConfidential: isRex
        };

        setEvents((prev) => [newEvt, ...prev.slice(0, 19)]);
      }

      // Latency jitter for RPC endpoints
      setRpcEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          latencyMs: Math.max(8, ep.latencyMs + Math.floor(Math.random() * 5) - 2)
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [metrics.currentBlockHeight]);

  const handleRefreshPings = () => {
    setRpcEndpoints((prev) =>
      prev.map((ep) => ({
        ...ep,
        latencyMs: Math.floor(Math.random() * 25) + 12,
        lastChecked: 'Just now'
      }))
    );
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
          <PeerVisualizer peers={peers} />
        )}

        {activeTab === 'sandbox' && (
          <ContractSandbox
            events={events}
            rpcPresets={RPC_PRESETS}
            rpcEndpoints={rpcEndpoints}
            onClearEvents={() => setEvents([])}
          />
        )}

        {activeTab === 'toolkit' && (
          <DevToolkit
            faucetStatus={INITIAL_FAUCET_STATUS}
            walletState={walletState}
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
