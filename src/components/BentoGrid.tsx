import { SpotlightCard } from './SpotlightCard';
import { Cpu, Globe, Shield, ArrowUpRight } from 'lucide-react';

interface BentoGridProps {
  onNavigateTab: (tab: string) => void;
  currentBlockHeight: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  onNavigateTab,
  currentBlockHeight
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-rialo-text tracking-tight">
            Architectural Highlights
          </h2>
          <p className="text-xs text-rialo-subtext mt-1">
            Engineered for high-frequency on-chain compute with parallel consensus verification
          </p>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-rialo-muted border border-rialo-border px-2 py-1 hidden sm:inline-block">
          Ecosystem Grid
        </span>
      </div>

      {/* Bento Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bento Item 1: REX Parallel Engine */}
        <SpotlightCard
          withBorderBeam
          className="p-6 flex flex-col justify-between group cursor-pointer"
          onClick={() => onNavigateTab('telemetry')}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-none bg-rialo-accent/10 border border-rialo-accent/30 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-rialo-accent" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-rialo-muted group-hover:text-rialo-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <h3 className="font-display text-lg font-bold text-rialo-text mt-4">
              50ms Block Runtime (REX)
            </h3>
            <p className="text-xs text-rialo-subtext mt-1.5 leading-relaxed">
              Multi-threaded off-chain execution pipelines verified on-chain in sub-second cycles with zero state bloat.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border font-mono text-xs flex items-center justify-between text-rialo-subtext">
            <span>Live Cycle Target</span>
            <span className="font-bold text-rialo-accent">50ms / Block</span>
          </div>
        </SpotlightCard>

        {/* Bento Item 2: Global Validator Mesh */}
        <SpotlightCard
          withBorderBeam
          className="p-6 flex flex-col justify-between group cursor-pointer"
          onClick={() => onNavigateTab('peers')}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-none bg-status-online/10 border border-status-online/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-status-online" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-rialo-muted group-hover:text-rialo-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <h3 className="font-display text-lg font-bold text-rialo-text mt-4">
              148 Global Validators
            </h3>
            <p className="text-xs text-rialo-subtext mt-1.5 leading-relaxed">
              P2P consensus routing across Tokyo, Frankfurt, London, and San Francisco with 14ms average peer latency.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border font-mono text-xs flex items-center justify-between text-rialo-subtext">
            <span>Network Health</span>
            <span className="font-bold text-status-online-bright">99.98% Synced</span>
          </div>
        </SpotlightCard>

        {/* Bento Item 3: Zero-Knowledge Compute */}
        <SpotlightCard
          withBorderBeam
          className="p-6 flex flex-col justify-between group cursor-pointer"
          onClick={() => onNavigateTab('sandbox')}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-none bg-rialo-cyan/10 border border-rialo-cyan/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rialo-cyan" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-rialo-muted group-hover:text-rialo-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <h3 className="font-display text-lg font-bold text-rialo-text mt-4">
              Verifiable RPC Sandbox
            </h3>
            <p className="text-xs text-rialo-subtext mt-1.5 leading-relaxed">
              Execute live JSON-RPC queries, simulate confidential smart contracts, and stream real-time events.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rialo-border font-mono text-xs flex items-center justify-between text-rialo-subtext">
            <span>Block Height</span>
            <span className="font-bold text-rialo-text">#{currentBlockHeight.toLocaleString()}</span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
