export type NetworkType = 'Testnet' | 'Devnet';

export type NodeStatusType = 'online' | 'degraded' | 'offline';
export type SyncStatusType = 'synced' | 'syncing';

export interface RpcEndpoint {
  id: string;
  name: string;
  url: string;
  network: NetworkType;
  latencyMs: number;
  status: NodeStatusType;
  lastChecked: string;
  blockHeight: number;
}

export interface NetworkMetrics {
  currentBlockHeight: number;
  avgBlockTimeMs: number; // Rialo targeting 50ms block execution
  liveTps: number;
  maxTps24h: number;
  baseFeeGwei: number;
  priorityFeeGwei: number;
  activePeersCount: number;
  rexExecutionCount: number;
  uptimePercentage: number;
}

export interface TpsDataPoint {
  time: string;
  tps: number;
  blockHeight: number;
  gasUsed: number;
}

export interface PeerNode {
  id: string;
  nodeName: string;
  version: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  status: SyncStatusType;
  uptimePct: number;
  pingMs: number;
  blockHeight: number;
}

export interface ContractEvent {
  id: string;
  timestamp: string;
  blockNumber: number;
  txHash: string;
  eventName: string;
  contractAddress: string;
  dataSummary: string;
  isRexConfidential?: boolean;
}

export interface RpcPreset {
  id: string;
  name: string;
  method: string;
  description: string;
  paramsJson: string;
}

export interface RpcResponse {
  status: 'success' | 'error';
  result?: any;
  error?: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface FaucetStatus {
  poolBalanceRialo: number;
  maxDripAmount: number;
  status: 'active' | 'degraded' | 'empty';
  totalDripped24h: number;
}

export type WalletProviderType = 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balanceRialo: string;
  networkId: string | null;
  chainIdHex: string | null;
  isWrongNetwork: boolean;
  walletType: WalletProviderType | null;
  isConnecting: boolean;
}

export interface WalletProviderInfo {
  id: WalletProviderType;
  name: string;
  iconName: string;
  description: string;
  isInstalled: boolean;
  downloadUrl?: string;
}

export interface TxFeedbackOptions {
  title?: string;
  description?: string;
  txHash?: string;
  explorerUrl?: string;
}

