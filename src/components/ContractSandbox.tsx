import React, { useState } from 'react';
import type { ContractEvent, RpcPreset, RpcResponse, RpcEndpoint } from '../types';
import { executeRpcRequest } from '../services/rpcService';
import { Play, Pause, Trash2, Copy, Check, Cpu, Terminal } from 'lucide-react';

interface ContractSandboxProps {
  events: ContractEvent[];
  rpcPresets: RpcPreset[];
  rpcEndpoints: RpcEndpoint[];
  onClearEvents: () => void;
}

export const ContractSandbox: React.FC<ContractSandboxProps> = ({
  events,
  rpcPresets,
  rpcEndpoints,
  onClearEvents
}) => {
  // Event streamer state
  const [eventFilter, setEventFilter] = useState<'ALL' | 'REX' | 'TRANSFER'>('ALL');
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);

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
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'REX') return e.isRexConfidential;
    if (eventFilter === 'TRANSFER') return e.eventName === 'Transfer';
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Live Event Streamer */}
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col h-[640px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rialo-border gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-lg font-bold text-rialo-text">Live Event Streamer</h3>
              <span className={`w-2 h-2 rounded-full ${isStreamPaused ? 'bg-status-degraded' : 'bg-status-online animate-subtle-pulse'}`}></span>
            </div>
            <p className="text-xs text-rialo-subtext mt-0.5">Real-time WebSocket event logs on Rialo chain</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsStreamPaused(!isStreamPaused)}
              className="p-1.5 border border-rialo-border text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface transition-colors flex items-center space-x-1 text-xs font-mono"
              title={isStreamPaused ? 'Resume Stream' : 'Pause Stream'}
            >
              {isStreamPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
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

        {/* Filter Controls */}
        <div className="py-3 flex items-center space-x-2 text-xs font-mono border-b border-rialo-border">
          <span className="text-rialo-muted font-sans uppercase">Filter:</span>
          {(['ALL', 'REX', 'TRANSFER'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setEventFilter(f)}
              className={`px-2.5 py-0.5 uppercase transition-colors ${
                eventFilter === f
                  ? 'bg-rialo-text text-rialo-bg font-semibold'
                  : 'text-rialo-subtext hover:text-rialo-text'
              }`}
            >
              {f === 'REX' ? 'REX Confidential' : f}
            </button>
          ))}
        </div>

        {/* Streaming Logs Container */}
        <div className="flex-1 mt-4 overflow-y-auto space-y-3 font-mono text-xs pr-1">
          {filteredEvents.length === 0 ? (
            <div className="h-full flex items-center justify-center text-rialo-muted">
              No contract events captured in stream.
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
      <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col h-[640px]">
        <div className="pb-4 border-b border-rialo-border">
          <h3 className="font-display text-lg font-bold text-rialo-text">Quick Contract Call Sandbox</h3>
          <p className="text-xs text-rialo-subtext mt-0.5">Send custom RPC payloads & test smart contract interfaces</p>
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
            <span>{isExecuting ? 'Executing Request...' : 'Send RPC Request'}</span>
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
