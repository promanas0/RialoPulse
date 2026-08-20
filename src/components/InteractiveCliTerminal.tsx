import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { playTerminalKeystroke, playClickSound, playSuccessSound } from '../services/soundService';
import { CornerDownLeft, Trash2, Shield, Activity, Droplets } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
  timestamp?: string;
}

export const InteractiveCliTerminal: React.FC = () => {
  const { walletState, triggerFaucetDrip } = useWallet();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      content: '⚡ Rialo Extended Execution (REX) CLI Playground v0.9.4 initialized.'
    },
    {
      id: 'init-2',
      type: 'system',
      content: 'Connected to Rialo Testnet (Chain ID: 7146) • Consensus target: 50ms block runtime.'
    },
    {
      id: 'init-3',
      type: 'output',
      content: 'Type "help" to view interactive commands, or click the quick action chips below.'
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    playClickSound();

    const newLines: TerminalLine[] = [
      ...history,
      {
        id: `cmd-${Date.now()}`,
        type: 'input',
        content: `rialo@pulse:~$ ${trimmed}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    const lower = trimmed.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      return;
    }

    if (lower === 'help') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Available Interactive Commands:
  • status     - Check live Rialo validator quorum & consensus health
  • genesis    - Inspect official SubzeroLabs genesis config & hash
  • validators - List official genesis validator nodes & providers
  • faucet     - Instant testnet drip (100.00 RIALO) to active wallet
  • tps        - Stream live throughput & parallel transaction velocity
  • nodes      - Query validator latency matrix across global peers
  • rex        - Inspect confidential compute & Zero-Knowledge VM state
  • wallet     - Inspect active Web3 session address & balance
  • clear      - Clear terminal buffer`
      });
    } else if (lower === 'status') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'success',
        content: `> Consensus Protocol: Rialo Parallel Proposer (RPP)
> Block Time Target: 50ms [VERIFIED]
> Active Validator Nodes: 148 global peers [ONLINE]
> Current Base Fee: 0.85 Gwei • Priority Fee: 0.05 Gwei
> Runtime Health: 99.98% • Zero dropped execution frames`
      });
    } else if (lower === 'tps') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `> Measuring TPS over parallel pipeline...
[████████████████████████████████] 100%
> Current Live TPS: 18,420 transactions/sec
> Peak 24h TPS: 24,890 transactions/sec
> Theoretical REX Ceiling: 100,000+ TPS`
      });
    } else if (lower === 'faucet') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `> Initiating 100.00 RIALO Testnet Faucet drip for ${walletState.address || '0x7140...7140'}...`
      });
      setHistory(newLines);

      const res = await triggerFaucetDrip();
      if (res.success) {
        playSuccessSound();
        setHistory(prev => [
          ...prev,
          {
            id: `faucet-succ-${Date.now()}`,
            type: 'success',
            content: `✓ Drip Confirmed! 100.00 RIALO minted.
> Tx Hash: ${res.txHash}
> Explorer: https://explorer.rialo.io/tx/${res.txHash}`
          }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          {
            id: `faucet-err-${Date.now()}`,
            type: 'error',
            content: `✗ Faucet request failed. Check network connectivity.`
          }
        ]);
      }
      return;
    } else if (lower === 'nodes') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Active Global Validator Latency Matrix:
  [●] Tokyo-JP-01       : 14ms (Synced #18492042)
  [●] Frankfurt-DE-02   : 22ms (Synced #18492042)
  [●] London-UK-01      : 19ms (Synced #18492042)
  [●] SanFrancisco-US-03: 16ms (Synced #18492042)
  [●] Singapore-SG-01   : 28ms (Synced #18492042)
  [●] SaoPaulo-BR-01    : 38ms (Synced #18492042)`
      });
    } else if (lower === 'rex') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `> REX Engine: Parallel Off-Chain Confidential Compute v0.9.4
> Cryptographic Verification: Zero-Knowledge SNARKs
> Worker Threads: 32 parallel pipelines
> State Root: 0x8f7a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a
> Confidential Execution: ACTIVE [CONFIRMED]`
      });
    } else if (lower === 'genesis') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'success',
        content: `> SubzeroLabs Genesis Registry (SubzeroLabs/rialo-testnet):
  • Config Hash: b1cdca444af9a8e74f56fd9140c9820e3fa162e833cee90192383b1a9335d0f6
  • Creation Timestamp: 1765313149509 (Genesis Verified)
  • Default P2P Port: UDP 4000
  • Genesis Multi-Sig Quorum: 13 Proposer Signatures [VALID]
  • Core Seed: /dns/node0.testnet.rialo.io/udp/4000`
      });
    } else if (lower === 'validators') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Official Genesis Validator Quorum:
  [1] node0.testnet.rialo.io (Subzero Core Genesis)
  [2] node1.testnet.rialo.io (Subzero Core Germany)
  [3] node2.testnet.rialo.io (Subzero Core Japan)
  [4] testnet-validator.rialo.p2p.org (P2P.org Validator)
  [5] rialo-testnet-validator.keplr.app (Keplr Staking)
  [6] rialo-testnet-validator.nodeinfra.com (NodeInfra Validator)
  [7] rialo-testnet-validator.bharvest.io (B-Harvest Validator)
  [8] rialo-tn-val.citadel.one (Citadel.one Validator)
  [9] rialo.validator.infstones.com (InfStones Validator)`
      });
    } else if (lower === 'wallet') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `> Web3 Wallet State:
  • Connected: ${walletState.isConnected ? 'YES' : 'NO (Sandbox Mode)'}
  • Address: ${walletState.address || '0x7140B35e69b59C39110B6C0753549fC054097140'}
  • Balance: ${walletState.balanceRialo} RIALO
  • Chain ID: ${walletState.networkId || '7146'} (Rialo Testnet)`
      });
    } else {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'error',
        content: `Command not recognized: "${trimmed}". Type "help" for a list of valid commands.`
      });
    }

    setHistory(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playTerminalKeystroke();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className="w-full bg-[#0D0D0B] border border-rialo-border rounded-none shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-[#141412] px-4 py-2.5 border-b border-rialo-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80 inline-block"></span>
          </div>
          <span className="text-rialo-muted text-[11px] ml-2">rialo-rex-interactive-cli</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[11px] text-rialo-subtext hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-subtle-pulse"></span>
            <span>WebSocket Live</span>
          </div>

          <button
            onClick={() => setHistory([])}
            className="text-rialo-muted hover:text-rialo-text transition-colors p-1"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Logs */}
      <div className="p-4 sm:p-5 h-64 sm:h-72 overflow-y-auto space-y-2 select-text scanline bg-[#0A0A09]/90">
        {history.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.type === 'input' && (
              <span className="text-rialo-accent font-semibold">{line.content}</span>
            )}
            {line.type === 'system' && (
              <span className="text-rialo-muted text-[11px]">{line.content}</span>
            )}
            {line.type === 'output' && (
              <pre className="text-rialo-subtext whitespace-pre-wrap font-mono text-[11px]">{line.content}</pre>
            )}
            {line.type === 'success' && (
              <pre className="text-status-online-bright whitespace-pre-wrap font-mono font-semibold text-[11px]">{line.content}</pre>
            )}
            {line.type === 'error' && (
              <span className="text-status-offline font-semibold text-[11px]">{line.content}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Command Chips */}
      <div className="px-4 py-2 bg-[#121210] border-t border-rialo-border flex items-center space-x-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-rialo-muted text-[10px] uppercase shrink-0">Quick Run:</span>
        <button
          onClick={() => handleCommand('status')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 flex items-center space-x-1 transition-colors"
        >
          <Activity className="w-3 h-3 text-rialo-accent" />
          <span>status</span>
        </button>
        <button
          onClick={() => handleCommand('faucet')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 flex items-center space-x-1 transition-colors"
        >
          <Droplets className="w-3 h-3 text-rialo-accent" />
          <span>faucet</span>
        </button>
        <button
          onClick={() => handleCommand('tps')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 transition-colors"
        >
          tps
        </button>
        <button
          onClick={() => handleCommand('nodes')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 transition-colors"
        >
          nodes
        </button>
        <button
          onClick={() => handleCommand('genesis')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 flex items-center space-x-1 transition-colors"
        >
          <Shield className="w-3 h-3 text-rialo-accent" />
          <span>genesis</span>
        </button>
        <button
          onClick={() => handleCommand('rex')}
          className="px-2 py-0.5 bg-rialo-card hover:bg-rialo-border text-rialo-text border border-rialo-border shrink-0 flex items-center space-x-1 transition-colors"
        >
          <Shield className="w-3 h-3 text-status-online" />
          <span>rex</span>
        </button>
      </div>

      {/* Terminal Input Bar */}
      <div className="p-3 bg-[#0D0D0B] border-t border-rialo-border flex items-center space-x-2">
        <span className="text-rialo-accent font-bold">rialo@pulse:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type command (e.g. "status", "faucet", "tps", "help")...'
          className="flex-1 bg-transparent text-rialo-text focus:outline-none font-mono text-xs placeholder:text-rialo-muted/60"
        />
        <button
          onClick={() => {
            handleCommand(inputVal);
            setInputVal('');
          }}
          className="text-rialo-subtext hover:text-rialo-text p-1 transition-colors"
          title="Execute Command"
        >
          <CornerDownLeft className="w-4 h-4 text-rialo-accent" />
        </button>
      </div>
    </div>
  );
};
