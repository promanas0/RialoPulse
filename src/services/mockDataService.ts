import type { RpcEndpoint, PeerNode, ContractEvent, RpcPreset, FaucetStatus } from '../types';

export const INITIAL_RPC_ENDPOINTS: RpcEndpoint[] = [
  {
    id: 'rialo-testnet-primary',
    name: 'Rialo Primary Testnet RPC',
    url: 'https://testnet-rpc.rialo.io',
    network: 'Testnet',
    latencyMs: 18,
    status: 'online',
    lastChecked: 'Just now',
    blockHeight: 18492042
  },
  {
    id: 'rialo-testnet-us-east',
    name: 'US-East Sequencer RPC',
    url: 'https://us-east-rpc.rialo.io',
    network: 'Testnet',
    latencyMs: 24,
    status: 'online',
    lastChecked: 'Just now',
    blockHeight: 18492042
  },
  {
    id: 'rialo-testnet-eu-central',
    name: 'EU-Central Sequencer RPC',
    url: 'https://eu-central-rpc.rialo.io',
    network: 'Testnet',
    latencyMs: 42,
    status: 'online',
    lastChecked: 'Just now',
    blockHeight: 18492041
  },
  {
    id: 'rialo-devnet-primary',
    name: 'Rialo Devnet (REX Runtime)',
    url: 'https://devnet-rpc.rialo.io',
    network: 'Devnet',
    latencyMs: 14,
    status: 'online',
    lastChecked: 'Just now',
    blockHeight: 9241088
  },
  {
    id: 'rialo-testnet-ap-south',
    name: 'AP-South Validator RPC',
    url: 'https://ap-south-rpc.rialo.io',
    network: 'Testnet',
    latencyMs: 88,
    status: 'degraded',
    lastChecked: '2s ago',
    blockHeight: 18492039
  }
];

export const INITIAL_PEERS: PeerNode[] = [
  {
    id: 'node-us-east-1',
    nodeName: 'Sequencer-Virginia-01',
    version: 'v0.9.4-rex-parallel',
    region: 'North America',
    country: 'United States',
    lat: 38.03,
    lng: -78.47,
    status: 'synced',
    uptimePct: 99.98,
    pingMs: 14,
    blockHeight: 18492042
  },
  {
    id: 'node-us-west-1',
    nodeName: 'Validator-Oregon-04',
    version: 'v0.9.4-rex-parallel',
    region: 'North America',
    country: 'United States',
    lat: 45.52,
    lng: -122.67,
    status: 'synced',
    uptimePct: 99.95,
    pingMs: 32,
    blockHeight: 18492042
  },
  {
    id: 'node-eu-west-1',
    nodeName: 'Validator-Frankfurt-02',
    version: 'v0.9.4-rex-parallel',
    region: 'Europe',
    country: 'Germany',
    lat: 50.11,
    lng: 8.68,
    status: 'synced',
    uptimePct: 99.99,
    pingMs: 38,
    blockHeight: 18492042
  },
  {
    id: 'node-eu-north-1',
    nodeName: 'Validator-Stockholm-01',
    version: 'v0.9.3-rex-parallel',
    region: 'Europe',
    country: 'Sweden',
    lat: 59.32,
    lng: 18.06,
    status: 'synced',
    uptimePct: 99.89,
    pingMs: 44,
    blockHeight: 18492041
  },
  {
    id: 'node-ap-east-1',
    nodeName: 'Validator-Tokyo-08',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'Japan',
    lat: 35.67,
    lng: 139.65,
    status: 'synced',
    uptimePct: 99.94,
    pingMs: 92,
    blockHeight: 18492042
  },
  {
    id: 'node-ap-south-1',
    nodeName: 'Validator-Singapore-03',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'Singapore',
    lat: 1.35,
    lng: 103.81,
    status: 'synced',
    uptimePct: 99.91,
    pingMs: 104,
    blockHeight: 18492042
  },
  {
    id: 'node-sa-east-1',
    nodeName: 'Validator-SaoPaulo-01',
    version: 'v0.9.2-rex-parallel',
    region: 'South America',
    country: 'Brazil',
    lat: -23.55,
    lng: -46.63,
    status: 'syncing',
    uptimePct: 98.40,
    pingMs: 142,
    blockHeight: 18492038
  },
  {
    id: 'node-ap-south-2',
    nodeName: 'Validator-Mumbai-02',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'India',
    lat: 19.07,
    lng: 72.87,
    status: 'synced',
    uptimePct: 99.97,
    pingMs: 82,
    blockHeight: 18492042
  }
];

export const INITIAL_EVENTS: ContractEvent[] = [
  {
    id: 'evt-1001',
    timestamp: new Date().toLocaleTimeString(),
    blockNumber: 18492042,
    txHash: '0x7f9a2b8e4c1d0f3a5b6c7d8e9f0a1b2c3d4e5f6a',
    eventName: 'Transfer',
    contractAddress: '0x3a4f89d12e567890abcdef1234567890abcdef12',
    dataSummary: 'from: 0x8a...29, to: 0x4c...91, amount: 250.00 RIALO'
  },
  {
    id: 'evt-1002',
    timestamp: new Date(Date.now() - 1200).toLocaleTimeString(),
    blockNumber: 18492041,
    txHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    eventName: 'REXExecutionCommit',
    contractAddress: '0x71400000000000000000000000000000000000ff',
    dataSummary: 'zkProof: verified, computationCycles: 4210, memoryStateHash: 0x9b...fa',
    isRexConfidential: true
  },
  {
    id: 'evt-1003',
    timestamp: new Date(Date.now() - 2500).toLocaleTimeString(),
    blockNumber: 18492040,
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    eventName: 'GaslessExecution',
    contractAddress: '0x9999888877776666555544443333222211110000',
    dataSummary: 'relayer: 0x11...88, sponsor: RialoDevnetPaymaster, gasPaid: 0.000000 RIALO'
  },
  {
    id: 'evt-1004',
    timestamp: new Date(Date.now() - 4000).toLocaleTimeString(),
    blockNumber: 18492039,
    txHash: '0xe9f8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0',
    eventName: 'StateCommitment',
    contractAddress: '0x0000000000000000000000000000000000007140',
    dataSummary: 'batchRoot: 0x4a...c9, txCount: 1420, executionTimeMs: 48.2'
  }
];

export const RPC_PRESETS: RpcPreset[] = [
  {
    id: 'eth_blockNumber',
    name: 'Get Latest Block Height',
    method: 'eth_blockNumber',
    description: 'Fetch the latest produced block number on Rialo network',
    paramsJson: '[]'
  },
  {
    id: 'rialo_getREXState',
    name: 'Rialo REX Runtime Status',
    method: 'rialo_getREXState',
    description: 'Query parallel execution engine stats and confidential computing status',
    paramsJson: '[]'
  },
  {
    id: 'eth_getBalance',
    name: 'Get Wallet Balance',
    method: 'eth_getBalance',
    description: 'Fetch account RIALO token balance in Hex Wei',
    paramsJson: '["0x7140000000000000000000000000000000000001", "latest"]'
  },
  {
    id: 'eth_gasPrice',
    name: 'Get Real-Time Gas Price',
    method: 'eth_gasPrice',
    description: 'Query current base gas price on Rialo execution engine',
    paramsJson: '[]'
  },
  {
    id: 'eth_getBlockByNumber',
    name: 'Get Block By Number',
    method: 'eth_getBlockByNumber',
    description: 'Fetch detailed block metadata including transactions and REX state',
    paramsJson: '["latest", false]'
  }
];

export const INITIAL_FAUCET_STATUS: FaucetStatus = {
  poolBalanceRialo: 500000,
  maxDripAmount: 100,
  status: 'active',
  totalDripped24h: 12450
};
