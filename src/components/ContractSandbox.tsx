import React, { useState } from 'react';
import type { ContractEvent, RpcPreset, RpcResponse, RpcEndpoint } from '../types';
import { executeRpcRequest } from '../services/rpcService';
import { Play, Pause, Trash2, Copy, Check, Cpu, Terminal, Zap, Search } from 'lucide-react';

interface ContractSandboxProps {
  events: ContractEvent[];
  rpcPresets: RpcPreset[];
  rpcEndpoints: RpcEndpoint[];
  onClearEvents: () => void;
  onAddEvent: (newEvent: ContractEvent) => void;
  currentBlockHeight: number;
}

export const ContractSandbox: React.FC<ContractSandboxProps> = ({
  events,
  rpcPresets,
  rpcEndpoints,
  onClearEvents,
  onAddEvent,
  currentBlockHeight
}) => {
  // Event streamer state
  const [eventFilter, setEventFilter] = useState<'ALL' | 'REX' | 'TRANSFER'>('ALL');
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');

  // Sandbox state
  const [selectedPreset, setSelectedPreset] = useState<RpcPreset>(rpcPresets[0]);
  const [customMethod, setCustomMethod] = useState<string>(rpcPresets[0].method);
  const [paramsJson, setParamsJson] = useState<string>(rpcPresets[0].paramsJson);
  const [selectedRpcUrl, setSelectedRpcUrl] = useState<string>(rpcEndpoints[0].url);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [response, setResponse] = useState<RpcResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (preset: RpcPreset) => {
    setSelectedPreset(preset);
    setCustomMethod(preset.method);
    setParamsJson(preset.paramsJson);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    const res = await executeRpcRequest(customMethod, paramsJson, selectedRpcUrl);
    setResponse(res);
    setIsExecuting(false);

    if (!isStreamPaused) {
      const isRex = customMethod.includes('REX') || customMethod.includes('rialo');
      const hexHash = `0x${(Date.now() * 17).toString(16)}${(Date.now() * 31).toString(16)}`;

      const newEvt: ContractEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        blockNumber: currentBlockHeight,
        txHash: hexHash.substring(0, 42),
        eventName: isRex ? 'REXExecutionCommit' : (customMethod.startsWith('eth_') ? customMethod.replace('eth_', '') : 'RpcCallExecuted'),
        contractAddress: selectedRpcUrl.includes('testnet') ? '0x71400000000000000000000000000000000000ff' : '0x3a4f89d12e567890abcdef1234567890abcdef12',
        dataSummary: res.status === 'success'
          ? `method: ${customMethod}, execTime: ${res.executionTimeMs}ms, result: ${JSON.stringify(res.result).substring(0, 45)}...`
          : `error: ${res.error}`,
        isRexConfidential: isRex
      };

      onAddEvent(newEvt);
    }
  };

  const handleTriggerQuickSample = (type: 'TRANSFER' | 'REX' | 'GASLESS') => {
    const txId = Date.now();
    let newEvt: ContractEvent;

    if (type === 'REX') {
      newEvt = {
        id: `evt-${txId}`,
        timestamp: new Date().toLocaleTimeString(),
        blockNumber: currentBlockHeight,
        txHash: `0x${(txId * 41).toString(16)}${(txId * 19).toString(16)}`.substring(0, 42),
        eventName: 'REXConfidentialCompute',
        contractAddress: '0x71400000000000000000000000000000000000ff',
        dataSummary: `zkProof: verified, cycles: ${3200 + (txId % 1500)}, memoryStateRoot: 0x8f7a...fa`,
        isRexConfidential: true
      };
    } else if (type === 'GASLESS') {
      newEvt = {
        id: `evt-${txId}`,
        timestamp: new Date().toLocaleTimeString(),
        blockNumber: currentBlockHeight,
        txHash: `0x${(txId * 23).toString(16)}${(txId * 37).toString(16)}`.substring(0, 42),
        eventName: 'GaslessExecution',
        contractAddress: '0x9999888877776666555544443333222211110000',
        dataSummary: 'relayer: 0x11...88, sponsor: RialoDevnetPaymaster, gasPaid: 0.000000 RIALO',
        isRexConfidential: false
      };
    } else {
      newEvt = {
        id: `evt-${txId}`,
        timestamp: new Date().toLocaleTimeString(),
        blockNumber: currentBlockHeight,
        txHash: `0x${(txId * 13).toString(16)}${(txId * 29).toString(16)}`.substring(0, 42),
        eventName: 'Transfer',
        contractAddress: '0x3a4f89d12e567890abcdef1234567890abcdef12',
        dataSummary: `from: 0x8a...29, to: 0x4c...91, amount: ${((txId % 1000) / 10 + 5).toFixed(2)} RIALO`,
        isRexConfidential: false
      };
    }

    onAddEvent(newEvt);
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'REX' && !e.isRexConfidential) return false;
    if (eventFilter === 'TRANSFER' && e.eventName !== 'Transfer') return false;

    const query = eventSearchQuery.toLowerCase().trim();
    if (query) {
      const matchName = e.eventName.toLowerCase().includes(query);
      const matchAddr = e.contractAddress.toLowerCase().includes(query);
      const matchTx = e.txHash.toLowerCase().includes(query);
      const matchSummary = e.dataSummary.toLowerCase().includes(query);
      if (!matchName && !matchAddr && !matchTx && !matchSummary) return false;
    }

    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Live Event Streamer */}
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col h-[660px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rialo-border gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-lg font-bold text-rialo-text">Live Event Streamer</h3>
              <span className={`w-2 h-2 rounded-full ${isStreamPaused ? 'bg-status-degraded' : 'bg-status-online animate-subtle-pulse'}`}></span>
            </div>
            <p className="text-xs text-rialo-subtext mt-0.5">Real-time block events captured from RPC & contract executions</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsStreamPaused(!isStreamPaused)}
              className="p-1.5 border border-rialo-border text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface transition-colors flex items-center space-x-1 text-xs font-mono"
              title={isStreamPaused ? 'Resume Stream' : 'Pause Stream'}
            >
              {isStreamPaused ? <Play className="w-3.5 h-3.5 text-status-online" /> : <Pause className="w-3.5 h-3.5 text-status-degraded" />}
              <span>{isStreamPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={onClearEvents}
              className="p-1.5 border border-rialo-border text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface transition-colors text-xs font-mono"
              title="Clear Event Log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Sample Trigger Buttons & Filter Bar */}
        <div className="py-2.5 flex flex-col space-y-2 border-b border-rialo-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 text-xs font-mono">
              <span className="text-rialo-muted text-[11px] uppercase mr-1">Filter:</span>
              {(['ALL', 'REX', 'TRANSFER'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={`px-2 py-0.5 uppercase transition-colors text-[11px] ${
                    eventFilter === f
                      ? 'bg-rialo-text text-rialo-bg font-semibold'
                      : 'text-rialo-subtext hover:text-rialo-text'
                  }`}
                >
                  {f === 'REX' ? 'REX Only' : f}
                </button>
              ))}
            </div>

            {/* Event Search Input */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-rialo-muted" />
              <input
                type="text"
                placeholder="Search event/tx..."
                value={eventSearchQuery}
                onChange={(e) => setEventSearchQuery(e.target.value)}
                className="bg-rialo-surface border border-rialo-border pl-6 pr-2 py-1 text-[11px] font-mono text-rialo-text focus:outline-none focus:border-rialo-text w-36 sm:w-48"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className="text-rialo-muted">Trigger Sample:</span>
            <button
              onClick={() => handleTriggerQuickSample('TRANSFER')}
              className="px-2 py-0.5 border border-rialo-border text-rialo-text hover:bg-rialo-surface flex items-center space-x-1"
            >
              <Zap className="w-3 h-3 text-rialo-accent" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => handleTriggerQuickSample('REX')}
              className="px-2 py-0.5 border border-rialo-border text-rialo-text hover:bg-rialo-surface flex items-center space-x-1"
            >
              <Cpu className="w-3 h-3 text-status-online" />
              <span>REX Confidential</span>
            </button>
            <button
              onClick={() => handleTriggerQuickSample('GASLESS')}
              className="px-2 py-0.5 border border-rialo-border text-rialo-text hover:bg-rialo-surface"
            >
              Gasless Tx
            </button>
          </div>
        </div>

        {/* Streaming Logs Container */}
        <div className="flex-1 mt-3 overflow-y-auto space-y-2.5 font-mono text-xs pr-1">
          {filteredEvents.length === 0 ? (
            <div className="h-full flex items-center justify-center text-rialo-muted text-xs">
              No contract events matching current filter.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-3 border transition-colors ${
                  evt.isRexConfidential
                    ? 'bg-rialo-surface/80 border-rialo-accent/40'
                    : 'bg-rialo-surface/40 border-rialo-border hover:border-rialo-border-dark'
                }`}
              >
                <div className="flex items-center justify-between text-rialo-subtext text-[11px] mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-rialo-text">#{evt.blockNumber}</span>
                    <span>•</span>
                    <span className="text-rialo-muted">{evt.timestamp}</span>
                  </div>
                  {evt.isRexConfidential && (
                    <span className="flex items-center space-x-1 text-rialo-accent text-[10px] uppercase font-semibold">
                      <Cpu className="w-3 h-3" />
                      <span>REX Confidential</span>
                    </span>
                  )}
                </div>

                <div className="font-semibold text-rialo-text flex items-center space-x-2">
                  <span className="text-rialo-accent font-mono">[{evt.eventName}]</span>
                  <span className="text-rialo-subtext text-[11px] truncate">{evt.contractAddress}</span>
                </div>

                <div className="mt-1 text-rialo-muted text-[11px] bg-rialo-card p-1.5 border border-rialo-border/60 overflow-x-auto">
                  {evt.dataSummary}
                </div>

                <div className="mt-1.5 text-[10px] text-rialo-subtext truncate">
                  Tx: {evt.txHash}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel 2: Quick RPC Contract Call / Sandbox */}
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col h-[660px]">
        <div className="pb-4 border-b border-rialo-border">
          <h3 className="font-display text-lg font-bold text-rialo-text">Quick Contract Call Sandbox</h3>
          <p className="text-xs text-rialo-subtext mt-0.5">Send JSON-RPC payloads & inspect execution response times</p>
        </div>

        {/* Preset Selector */}
        <div className="mt-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted mb-1.5">
            RPC Preset Template
          </label>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = rpcPresets.find(pr => pr.id === e.target.value);
              if (p) handleSelectPreset(p);
            }}
            className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text"
          >
            {rpcPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.method})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-rialo-subtext mt-1">{selectedPreset.description}</p>
        </div>

        {/* Method & RPC Target */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted mb-1">
              Method
            </label>
            <input
              type="text"
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted mb-1">
              Target RPC Node
            </label>
            <select
              value={selectedRpcUrl}
              onChange={(e) => setSelectedRpcUrl(e.target.value)}
              className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text"
            >
              {rpcEndpoints.map((ep) => (
                <option key={ep.id} value={ep.url}>
                  {ep.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameters Editor */}
        <div className="mt-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-rialo-muted mb-1">
            Parameters (JSON Array)
          </label>
          <textarea
            rows={2}
            value={paramsJson}
            onChange={(e) => setParamsJson(e.target.value)}
            className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 font-mono text-xs focus:outline-none focus:border-rialo-text resize-none"
          />
        </div>

        {/* Execute Button */}
        <div className="mt-3">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-rialo-text text-rialo-bg hover:bg-rialo-dark py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Executing RPC Request...' : 'Send RPC Request'}</span>
          </button>
        </div>

        {/* Response Console */}
        <div className="mt-4 flex-1 bg-rialo-surface border border-rialo-border p-3 flex flex-col overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-rialo-border text-rialo-subtext">
            <span className="text-[11px] uppercase tracking-wider">Response Output</span>
            {response && (
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-rialo-text">{response.executionTimeMs} ms</span>
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center space-x-1 text-rialo-accent hover:underline"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 mt-2 overflow-y-auto">
            {response ? (
              <pre className="text-rialo-text whitespace-pre-wrap text-[11px]">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <span className="text-rialo-muted text-[11px]">
                Click "Send RPC Request" to execute call.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
