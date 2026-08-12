import React, { useState } from 'react';
import type { RpcEndpoint, NetworkMetrics, TpsDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, Zap, Server, ShieldCheck, Flame } from 'lucide-react';

interface TelemetryMetricsProps {
  rpcEndpoints: RpcEndpoint[];
  metrics: NetworkMetrics;
  tpsHistory: TpsDataPoint[];
  onRefreshPings: () => void;
}

export const TelemetryMetrics: React.FC<TelemetryMetricsProps> = ({
  rpcEndpoints,
  metrics,
  tpsHistory,
  onRefreshPings
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshPings();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-status-online';
      case 'degraded':
        return 'bg-status-degraded';
      case 'offline':
      default:
        return 'bg-status-offline';
    }
  };

  return (
    <div className="space-[#EAE5D9] space-y-6">
      {/* Top Telemetry KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Block Height */}
        <div className="bg-rialo-card border border-rialo-border p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-rialo-subtext">Current Block Height</span>
            <Server className="w-4 h-4 text-rialo-muted" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-rialo-text">
              #{metrics.currentBlockHeight.toLocaleString()}
            </span>
            <div className="mt-1 flex items-center space-x-2 text-xs text-rialo-subtext">
              <span className="w-2 h-2 rounded-full bg-status-online"></span>
              <span>Avg Block Time: {metrics.avgBlockTimeMs}ms</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Live TPS */}
        <div className="bg-rialo-card border border-rialo-border p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-rialo-subtext">Live TPS (Tx/Sec)</span>
            <Zap className="w-4 h-4 text-rialo-accent" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-rialo-text">
                {metrics.liveTps.toLocaleString()}
              </span>
              <span className="text-xs text-rialo-muted">TPS</span>
            </div>
            <div className="mt-1 text-xs text-rialo-subtext font-mono">
              Peak 24h: {metrics.maxTps24h.toLocaleString()} TPS
            </div>
          </div>
        </div>

        {/* Metric 3: Gas Tracker */}
        <div className="bg-rialo-card border border-rialo-border p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-rialo-subtext">Base & Priority Fee</span>
            <Flame className="w-4 h-4 text-rialo-muted" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-rialo-text">
                {metrics.baseFeeGwei}
              </span>
              <span className="text-xs font-mono text-rialo-muted">Gwei</span>
            </div>
            <div className="mt-1 text-xs text-rialo-subtext font-mono">
              Priority Fee: {metrics.priorityFeeGwei} Gwei
            </div>
          </div>
        </div>

        {/* Metric 4: REX Runtime Execution */}
        <div className="bg-rialo-card border border-rialo-border p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-rialo-subtext">REX Parallel Executions</span>
            <ShieldCheck className="w-4 h-4 text-status-online" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-rialo-text">
                {metrics.rexExecutionCount.toLocaleString()}
              </span>
              <span className="text-xs text-rialo-muted">/ min</span>
            </div>
            <div className="mt-1 text-xs text-status-online font-medium uppercase tracking-wider">
              Network Health: 99.98%
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: TPS Live Chart & RPC Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TPS Live Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-rialo-card border border-rialo-border p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-rialo-border">
            <div>
              <h3 className="font-display text-lg font-bold text-rialo-text">Real-Time Throughput (TPS)</h3>
              <p className="text-xs text-rialo-subtext font-sans mt-0.5">
                Streaming execution rate over Rialo parallel proposer consensus
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-rialo-accent inline-block"></span>
                <span className="text-rialo-subtext">Live TPS</span>
              </div>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tpsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C85A27" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C85A27" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#8C8678"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D9D2C1' }}
                />
                <YAxis
                  stroke="#8C8678"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D9D2C1' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6EA',
                    borderColor: '#D9D2C1',
                    borderRadius: '0px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                  labelStyle={{ color: '#1C1C1A', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="tps"
                  stroke="#C85A27"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tpsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RPC Latency & Health Check Matrix (1 Col) */}
        <div className="bg-rialo-card border border-rialo-border p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-rialo-border">
            <div>
              <h3 className="font-display text-lg font-bold text-rialo-text">RPC Endpoints</h3>
              <p className="text-xs text-rialo-subtext mt-0.5">Latency & Health Matrix</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 border border-rialo-border text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface transition-colors"
              title="Ping RPC Endpoints"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="mt-4 divide-y divide-rialo-border flex-1">
            {rpcEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(endpoint.status)}`}></span>
                    <span className="font-medium text-xs text-rialo-text">{endpoint.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-rialo-muted mt-1 truncate max-w-[180px]">
                    {endpoint.url}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-semibold text-rialo-text">
                    {endpoint.latencyMs} ms
                  </div>
                  <div className="text-[10px] uppercase text-rialo-muted">
                    {endpoint.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-rialo-border flex items-center justify-between text-[11px] font-mono text-rialo-subtext">
            <span>Auto-ping interval: 3s</span>
            <span>Protocols: HTTP / WS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
