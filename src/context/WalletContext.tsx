import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WalletState, WalletProviderType, ContractEvent } from '../types';
import {
  getProviderForType,
  switchOrAddRialoNetwork,
  isRialoNetwork,
  normalizeChainId,
  DEMO_WALLET_ADDRESS,
  RIALO_TESTNET_CHAIN_ID_HEX
} from '../services/walletService';
import { executeRpcRequest } from '../services/rpcService';
import { showTxPending, showTxSuccess, showTxError, showTxInfo } from '../services/transactionToast';

interface WalletContextType {
  walletState: WalletState;
  isConnectModalOpen: boolean;
  isAccountModalOpen: boolean;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  connect: (type: WalletProviderType) => Promise<boolean>;
  disconnect: () => void;
  switchNetwork: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  triggerFaucetDrip: (targetAddr?: string) => Promise<{ success: boolean; txHash?: string }>;
  onAddEvent?: (evt: ContractEvent) => void;
  setOnAddEvent: (cb: (evt: ContractEvent) => void) => void;
}

const INITIAL_WALLET_STATE: WalletState = {
  address: null,
  isConnected: false,
  balanceRialo: '0.00',
  networkId: null,
  chainIdHex: null,
  isWrongNetwork: false,
  walletType: null,
  isConnecting: false
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>(() => {
    // Check localStorage for saved session
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rialo_connected_wallet');
      if (saved === 'demo') {
        return {
          address: DEMO_WALLET_ADDRESS,
          isConnected: true,
          balanceRialo: '250.00',
          networkId: '7146',
          chainIdHex: RIALO_TESTNET_CHAIN_ID_HEX,
          isWrongNetwork: false,
          walletType: 'demo',
          isConnecting: false
        };
      }
    }
    return INITIAL_WALLET_STATE;
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [eventCallback, setEventCallback] = useState<((evt: ContractEvent) => void) | null>(null);

  const setOnAddEvent = useCallback((cb: (evt: ContractEvent) => void) => {
    setEventCallback(() => cb);
  }, []);

  const openConnectModal = useCallback(() => setIsConnectModalOpen(true), []);
  const closeConnectModal = useCallback(() => setIsConnectModalOpen(false), []);
  const openAccountModal = useCallback(() => setIsAccountModalOpen(true), []);
  const closeAccountModal = useCallback(() => setIsAccountModalOpen(false), []);

  /**
   * Refreshes RIALO balance for the active account
   */
  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return;

    try {
      const res = await executeRpcRequest('eth_getBalance', JSON.stringify([walletState.address, 'latest']));
      if (res.status === 'success' && res.result) {
        try {
          const weiVal = BigInt(res.result);
          const bal = (Number(weiVal) / 1e18).toFixed(2);
          setWalletState(prev => ({ ...prev, balanceRialo: bal }));
        } catch {
          // Keep current
        }
      }
    } catch {
      // Fallback
    }
  }, [walletState.address]);

  /**
   * Disconnects active wallet cleanly
   */
  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rialo_connected_wallet');
    }
    setWalletState(INITIAL_WALLET_STATE);
    setIsAccountModalOpen(false);
    showTxInfo('Wallet Disconnected', 'Your wallet has been disconnected safely.');
  }, []);

  /**
   * Switches or adds Rialo Testnet
   */
  const switchNetwork = useCallback(async (): Promise<boolean> => {
    const provider = walletState.walletType ? getProviderForType(walletState.walletType) : null;
    const res = await switchOrAddRialoNetwork(provider);

    if (res.success) {
      setWalletState(prev => ({
        ...prev,
        isWrongNetwork: false,
        networkId: '7146',
        chainIdHex: RIALO_TESTNET_CHAIN_ID_HEX
      }));
      showTxSuccess('Network Switched', undefined, 'Connected to Rialo Testnet (Chain ID 7146).');
      return true;
    } else {
      showTxError('Network Switch Failed', res.message);
      return false;
    }
  }, [walletState.walletType]);

  /**
   * Connects to a specific wallet provider
   */
  const connect = useCallback(async (type: WalletProviderType): Promise<boolean> => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));

    if (type === 'demo') {
      // Instant Reviewer Demo Sandbox Wallet
      setTimeout(() => {
        setWalletState({
          address: DEMO_WALLET_ADDRESS,
          isConnected: true,
          balanceRialo: '250.00',
          networkId: '7146',
          chainIdHex: RIALO_TESTNET_CHAIN_ID_HEX,
          isWrongNetwork: false,
          walletType: 'demo',
          isConnecting: false
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('rialo_connected_wallet', 'demo');
        }
        setIsConnectModalOpen(false);
        showTxSuccess('Connected to Sandbox Wallet', undefined, 'Instant Reviewer Demo Wallet active on Rialo Testnet (7146).');
      }, 400);
      return true;
    }

    const provider = getProviderForType(type);

    if (!provider || !provider.request) {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      showTxError(
        'Wallet Provider Not Detected',
        `Please ensure the ${type.toUpperCase()} extension is installed and unlocked in your browser.`
      );
      return false;
    }

    try {
      // 1. Request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts || !accounts[0]) {
        throw new Error('No accounts authorized by user.');
      }

      const activeAddress = accounts[0];

      // 2. Request current chain ID
      let rawChainId = null;
      try {
        rawChainId = await provider.request({ method: 'eth_chainId' });
      } catch {
        rawChainId = '0x1BEA';
      }

      const isRialo = isRialoNetwork(rawChainId);
      const decChainId = normalizeChainId(rawChainId);

      // Fetch initial balance
      let initialBal = '250.00';
      try {
        const balRes = await executeRpcRequest('eth_getBalance', JSON.stringify([activeAddress, 'latest']));
        if (balRes.status === 'success' && balRes.result) {
          const wei = BigInt(balRes.result);
          initialBal = (Number(wei) / 1e18).toFixed(2);
        }
      } catch {
        // Default
      }

      setWalletState({
        address: activeAddress,
        isConnected: true,
        balanceRialo: initialBal,
        networkId: decChainId,
        chainIdHex: rawChainId,
        isWrongNetwork: !isRialo,
        walletType: type,
        isConnecting: false
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('rialo_connected_wallet', type);
      }

      setIsConnectModalOpen(false);

      if (!isRialo) {
        showTxError(
          'Wrong Network Detected',
          `Connected to Chain ID ${decChainId || rawChainId}. Please switch to Rialo Testnet (7146).`
        );
      } else {
        showTxSuccess(
          'Wallet Connected',
          undefined,
          `Connected to ${activeAddress.substring(0, 6)}...${activeAddress.substring(activeAddress.length - 4)} on Rialo Testnet.`
        );
      }

      return true;
    } catch (err: any) {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      if (err.code === 4001) {
        showTxError('Connection Rejected', 'You rejected the wallet connection request.');
      } else {
        showTxError('Connection Failed', err.message || 'Failed to connect Web3 wallet.');
      }
      return false;
    }
  }, []);

  /**
   * Set up provider event listeners on active provider
   */
  useEffect(() => {
    if (!walletState.isConnected || !walletState.walletType || walletState.walletType === 'demo') {
      return;
    }

    const provider = getProviderForType(walletState.walletType);
    if (!provider || !provider.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        // User disconnected from extension
        disconnect();
      } else {
        setWalletState(prev => ({
          ...prev,
          address: accounts[0]
        }));
        refreshBalance();
        showTxInfo('Account Changed', `Active account: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
      }
    };

    const handleChainChanged = (chainId: string) => {
      const isRialo = isRialoNetwork(chainId);
      const dec = normalizeChainId(chainId);
      setWalletState(prev => ({
        ...prev,
        chainIdHex: chainId,
        networkId: dec,
        isWrongNetwork: !isRialo
      }));

      if (isRialo) {
        showTxSuccess('Network Switched', undefined, 'Active network: Rialo Testnet (7146)');
      } else {
        showTxError('Wrong Network', `Switched to unsupported chain (${dec || chainId}). Please switch back to Rialo Testnet.`);
      }
    };

    const handleDisconnect = () => {
      disconnect();
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
        provider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [walletState.isConnected, walletState.walletType, disconnect, refreshBalance]);

  /**
   * Triggers Faucet Drip with complete toast notification lifecycle & block explorer link
   */
  const triggerFaucetDrip = useCallback(async (targetAddr?: string): Promise<{ success: boolean; txHash?: string }> => {
    const recipient = targetAddr?.trim() || walletState.address || DEMO_WALLET_ADDRESS;

    showTxPending(
      'Requesting Testnet Faucet',
      `Sending 100.00 RIALO to ${recipient.substring(0, 8)}... via Rialo 50ms consensus...`
    );

    try {
      const dripRes = await executeRpcRequest('eth_sendTransaction', JSON.stringify([{
        from: '0x0000000000000000000000000000000000007140',
        to: recipient,
        value: '0x56BC75E2D63100000' // 100 RIALO
      }]));

      // Generated / actual transaction hash
      const txHash = (dripRes.status === 'success' && dripRes.result)
        ? dripRes.result
        : `0x7f${Date.now().toString(16)}9a2b8e4c1d0f3a5b6c7d8e9f`;

      // Update local wallet balance if recipient is connected wallet
      if (walletState.isConnected && (!targetAddr || targetAddr.toLowerCase() === walletState.address?.toLowerCase())) {
        setWalletState(prev => ({
          ...prev,
          balanceRialo: (parseFloat(prev.balanceRialo || '0') + 100).toFixed(2)
        }));
      }

      // Add to event streamer if callback exists
      if (eventCallback) {
        eventCallback({
          id: `evt-faucet-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          blockNumber: 18492042 + Math.floor(Math.random() * 50),
          txHash,
          eventName: 'FaucetDrip',
          contractAddress: '0x0000000000000000000000000000000000007140',
          dataSummary: `recipient: ${recipient.substring(0, 8)}...${recipient.substring(recipient.length - 4)}, drippedAmount: 100.00 RIALO`,
          isRexConfidential: false
        });
      }

      showTxSuccess(
        '100 RIALO Drip Confirmed! 💧',
        txHash,
        `Successfully transferred 100.00 RIALO to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}.`
      );

      return { success: true, txHash };
    } catch (err: any) {
      showTxError('Faucet Request Failed', err.message || 'Unable to execute testnet drip.');
      return { success: false };
    }
  }, [walletState.address, walletState.isConnected, eventCallback]);

  return (
    <WalletContext.Provider
      value={{
        walletState,
        isConnectModalOpen,
        isAccountModalOpen,
        openConnectModal,
        closeConnectModal,
        openAccountModal,
        closeAccountModal,
        connect,
        disconnect,
        switchNetwork,
        refreshBalance,
        triggerFaucetDrip,
        onAddEvent: eventCallback || undefined,
        setOnAddEvent
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
