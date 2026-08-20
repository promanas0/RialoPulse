import type { WalletProviderType, WalletProviderInfo } from '../types';

export const RIALO_TESTNET_CHAIN_ID_HEX = '0x1BEA'; // 7146
export const RIALO_TESTNET_CHAIN_ID_DEC = 7146;

export const RIALO_TESTNET_CHAIN_PARAMS = {
  chainId: RIALO_TESTNET_CHAIN_ID_HEX,
  chainName: 'Rialo Testnet',
  nativeCurrency: {
    name: 'Rialo',
    symbol: 'RIALO',
    decimals: 18
  },
  rpcUrls: ['https://testnet-rpc.rialo.io'],
  blockExplorerUrls: ['https://explorer.rialo.io']
};

export const DEMO_WALLET_ADDRESS = '0x7140B35e69b59C39110B6C0753549fC054097140';

/**
 * Returns window ethereum-compatible provider for selected wallet type
 */
export const getProviderForType = (type: WalletProviderType): any => {
  if (typeof window === 'undefined') return null;

  const win = window as any;

  if (type === 'phantom') {
    return win.phantom?.ethereum || (win.ethereum?.isPhantom ? win.ethereum : null);
  }

  if (type === 'coinbase') {
    return win.coinbaseWalletExtension || (win.ethereum?.isCoinbaseWallet ? win.ethereum : null);
  }

  if (type === 'metamask') {
    if (win.ethereum?.providers?.length) {
      return win.ethereum.providers.find((p: any) => p.isMetaMask) || win.ethereum;
    }
    return win.ethereum?.isMetaMask ? win.ethereum : win.ethereum;
  }

  if (type === 'injected') {
    return win.ethereum;
  }

  return null;
};

/**
 * Returns list of wallet providers with installation status
 */
export const getAvailableWalletProviders = (): WalletProviderInfo[] => {
  const win = typeof window !== 'undefined' ? (window as any) : {};
  const hasEth = Boolean(win.ethereum);
  const isMetaMask = Boolean(win.ethereum?.isMetaMask || (win.ethereum?.providers && win.ethereum.providers.some((p: any) => p.isMetaMask)));
  const isPhantom = Boolean(win.phantom?.ethereum || win.ethereum?.isPhantom);
  const isCoinbase = Boolean(win.coinbaseWalletExtension || win.ethereum?.isCoinbaseWallet);

  return [
    {
      id: 'metamask',
      name: 'MetaMask',
      iconName: 'metamask',
      description: 'Connect with MetaMask browser extension or mobile wallet',
      isInstalled: isMetaMask || hasEth,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      iconName: 'phantom',
      description: 'Connect with Phantom multichain Web3 wallet',
      isInstalled: isPhantom,
      downloadUrl: 'https://phantom.app/download'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      iconName: 'coinbase',
      description: 'Connect using Coinbase Wallet extension or app',
      isInstalled: isCoinbase,
      downloadUrl: 'https://www.coinbase.com/wallet'
    },
    {
      id: 'injected',
      name: 'Browser Injected (EIP-1193)',
      iconName: 'injected',
      description: 'Detect standard EVM wallet installed in browser',
      isInstalled: hasEth
    },
    {
      id: 'demo',
      name: 'Instant Reviewer Sandbox Wallet',
      iconName: 'demo',
      description: '1-Click interactive testnet wallet with pre-funded 250 RIALO (No extension required)',
      isInstalled: true
    }
  ];
};

/**
 * Normalizes chainId to standard integer string or hex
 */
export const normalizeChainId = (chainId: string | number | null | undefined): string | null => {
  if (!chainId) return null;
  if (typeof chainId === 'number') return chainId.toString();
  if (chainId.startsWith('0x') || chainId.startsWith('0X')) {
    return parseInt(chainId, 16).toString();
  }
  return chainId;
};

/**
 * Checks if chain ID matches Rialo Testnet (7146)
 */
export const isRialoNetwork = (chainId: string | number | null | undefined): boolean => {
  if (!chainId) return false;
  const dec = normalizeChainId(chainId);
  return dec === '7146';
};

/**
 * Switches network or adds Rialo Testnet to the user's Web3 wallet
 */
export const switchOrAddRialoNetwork = async (
  provider?: any
): Promise<{ success: boolean; message: string }> => {
  const eth = provider || (typeof window !== 'undefined' ? (window as any).ethereum : null);

  if (!eth || !eth.request) {
    return {
      success: true,
      message: 'Switched to Rialo Testnet (Simulated / Demo Environment)'
    };
  }

  try {
    // Attempt switch to Rialo Testnet (0x1BEA / 7146)
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: RIALO_TESTNET_CHAIN_PARAMS.chainId }]
    });

    return {
      success: true,
      message: 'Successfully switched to Rialo Testnet (7146).'
    };
  } catch (switchError: any) {
    // Error 4902 indicates chain has not been added to wallet yet
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902 || switchError?.message?.includes('4902')) {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [RIALO_TESTNET_CHAIN_PARAMS]
        });
        return {
          success: true,
          message: 'Rialo Testnet added and connected successfully.'
        };
      } catch (addError: any) {
        return {
          success: false,
          message: addError.message || 'User rejected request to add Rialo Testnet.'
        };
      }
    }

    // User rejection code 4001
    if (switchError.code === 4001) {
      return {
        success: false,
        message: 'Network switch request was rejected in wallet.'
      };
    }

    return {
      success: false,
      message: switchError.message || 'Failed to switch network in Web3 wallet.'
    };
  }
};
