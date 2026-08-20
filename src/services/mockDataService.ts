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
    id: 'subzero-node-0',
    nodeName: 'node0.testnet.rialo.io (Subzero Genesis)',
    version: 'v0.9.4-rex-parallel',
    region: 'North America',
    country: 'United States',
    lat: 38.03,
    lng: -78.47,
    status: 'synced',
    uptimePct: 100.0,
    pingMs: 12,
    blockHeight: 18492042
  },
  {
    id: 'subzero-node-1',
    nodeName: 'node1.testnet.rialo.io (Subzero Core)',
    version: 'v0.9.4-rex-parallel',
    region: 'Europe',
    country: 'Germany',
    lat: 50.11,
    lng: 8.68,
    status: 'synced',
    uptimePct: 100.0,
    pingMs: 24,
    blockHeight: 18492042
  },
  {
    id: 'subzero-node-2',
    nodeName: 'node2.testnet.rialo.io (Subzero AP)',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'Japan',
    lat: 35.67,
    lng: 139.65,
    status: 'synced',
    uptimePct: 99.98,
    pingMs: 34,
    blockHeight: 18492042
  },
  {
    id: 'val-p2p-org',
    nodeName: 'testnet-validator.rialo.p2p.org',
    version: 'v0.9.4-rex-parallel',
    region: 'Europe',
    country: 'United Kingdom',
    lat: 51.50,
    lng: -0.12,
    status: 'synced',
    uptimePct: 99.99,
    pingMs: 18,
    blockHeight: 18492042
  },
  {
    id: 'val-keplr',
    nodeName: 'rialo-testnet-validator.keplr.app',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'South Korea',
    lat: 37.56,
    lng: 126.97,
    status: 'synced',
    uptimePct: 99.96,
    pingMs: 42,
    blockHeight: 18492042
  },
  {
    id: 'val-nodeinfra',
    nodeName: 'rialo-testnet-validator.nodeinfra.com',
    version: 'v0.9.4-rex-parallel',
    region: 'North America',
    country: 'Canada',
    lat: 43.65,
    lng: -79.38,
    status: 'synced',
    uptimePct: 99.95,
    pingMs: 28,
    blockHeight: 18492042
  },
  {
    id: 'val-bharvest',
    nodeName: 'rialo-testnet-validator.bharvest.io',
    version: 'v0.9.4-rex-parallel',
    region: 'Asia Pacific',
    country: 'Singapore',
    lat: 1.35,
    lng: 103.81,
    status: 'synced',
    uptimePct: 99.94,
    pingMs: 56,
    blockHeight: 18492042
  },
  {
    id: 'val-citadel',
    nodeName: 'rialo-tn-val.citadel.one',
    version: 'v0.9.3-rex-parallel',
    region: 'Europe',
    country: 'Netherlands',
    lat: 52.36,
    lng: 4.90,
    status: 'synced',
    uptimePct: 99.91,
    pingMs: 36,
    blockHeight: 18492042
  },
  {
    id: 'val-infstones',
    nodeName: 'rialo.validator.infstones.com',
    version: 'v0.9.4-rex-parallel',
    region: 'North America',
    country: 'United States',
    lat: 37.77,
    lng: -122.41,
    status: 'synced',
    uptimePct: 99.97,
    pingMs: 22,
    blockHeight: 18492042
  },
  {
    id: 'val-nodes-guru',
    nodeName: 'rialo-testnet-validator.nodes.guru',
    version: 'v0.9.4-rex-parallel',
    region: 'Europe',
    country: 'Finland',
    lat: 60.16,
    lng: 24.93,
    status: 'synced',
    uptimePct: 99.88,
    pingMs: 48,
    blockHeight: 18492041
  },
  {
    id: 'val-pops-one',
    nodeName: 'val.rialo.testnet.pops.one',
    version: 'v0.9.4-rex-parallel',
    region: 'Europe',
    country: 'Switzerland',
    lat: 47.37,
    lng: 8.54,
    status: 'synced',
    uptimePct: 99.92,
    pingMs: 39,
    blockHeight: 18492042
  },
  {
    id: 'val-banansen',
    nodeName: 'validator.rialo.staking.banansen.dev',
    version: 'v0.9.2-rex-parallel',
    region: 'Europe',
    country: 'Sweden',
    lat: 59.32,
    lng: 18.06,
    status: 'syncing',
    uptimePct: 98.60,
    pingMs: 78,
    blockHeight: 18492039
  }
];

export const GENESIS_REGISTRY_CONFIG = {
  repoUrl: 'https://github.com/SubzeroLabs/rialo-testnet',
  configHash: 'b1cdca444af9a8e74f56fd9140c9820e3fa162e833cee90192383b1a9335d0f6',
  creationTimeMs: 1765313149509,
  defaultUdpPort: 4000,
  verifiedSignaturesCount: 13,
  genesisProposers: [
    'node0.testnet.rialo.io',
    'node1.testnet.rialo.io',
    'node2.testnet.rialo.io',
    'testnet-validator.rialo.p2p.org',
    'rialo-testnet-validator.keplr.app',
    'rialo-testnet-validator.nodeinfra.com',
    'rialo-testnet-validator.bharvest.io',
    'rialo-tn-val.citadel.one',
    'rialo.validator.infstones.com',
    'rialo-testnet-validator.nodes.guru',
    'val.rialo.testnet.pops.one',
    'validator.rialo.staking.banansen.dev',
    'fp-rialo-testnet-validator.felixinfra.xyz'
  ]
};

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
  },
  {
    id: 'rialo_getGenesisConfig',
    name: 'SubzeroLabs Genesis Config',
    method: 'rialo_getGenesisConfig',
    description: 'Fetch official testnet genesis parameters and state root config hash',
    paramsJson: '[]'
  },
  {
    id: 'rialo_getGenesisSignatures',
    name: 'Genesis Validator Signatures',
    method: 'rialo_getGenesisSignatures',
    description: 'Fetch multi-sig quorum signatures verified during Rialo Genesis',
    paramsJson: '[]'
  }
];

export const INITIAL_FAUCET_STATUS: FaucetStatus = {
  poolBalanceRialo: 500000,
  maxDripAmount: 100,
  status: 'active',
  totalDripped24h: 12450
};
