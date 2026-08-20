import React, { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe, { type Marker, type Arc } from 'cobe';
import type { PeerNode } from '../types';
import { RotateCw, Pause, Play, MapPin } from 'lucide-react';

interface NetworkGlobeProps {
  peers: PeerNode[];
  onSelectPeer?: (peer: PeerNode) => void;
  selectedPeer?: PeerNode | null;
  currentBlockHeight: number;
}

export const NetworkGlobe: React.FC<NetworkGlobeProps> = ({
  peers,
  onSelectPeer,
  selectedPeer,
  currentBlockHeight: _currentBlockHeight
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const rRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.2);
  const isDragging = useRef(false);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeNode, setActiveNode] = useState<PeerNode | null>(selectedPeer || peers[0] || null);

  // Sync activeNode when selectedPeer prop changes
  useEffect(() => {
    if (selectedPeer) {
      setActiveNode(selectedPeer);
      const targetPhi = ((selectedPeer.lng + 180) * Math.PI) / 180;
      const targetTheta = (selectedPeer.lat * Math.PI) / 180;
      phiRef.current = targetPhi;
      thetaRef.current = Math.max(-0.8, Math.min(0.8, targetTheta * 0.5));
    }
  }, [selectedPeer]);

  // Convert peer list to cobe markers format
  const markers: Marker[] = React.useMemo(() => {
    return peers.map((p) => ({
      location: [p.lat, p.lng] as [number, number],
      size: activeNode?.id === p.id ? 0.09 : (p.status === 'synced' ? 0.06 : 0.04),
      color: (activeNode?.id === p.id
        ? [0.78, 0.35, 0.15]
        : (p.status === 'synced' ? [0.18, 0.49, 0.32] : [0.77, 0.51, 0.15])) as [number, number, number]
    }));
  }, [peers, activeNode?.id]);

  // Live consensus routing arcs between validator peers
  const arcs: Arc[] = React.useMemo(() => [
    { from: [37.77, -122.41], to: [35.67, 139.65], color: [0.78, 0.35, 0.15] },
    { from: [50.11, 8.68], to: [1.35, 103.81], color: [0.78, 0.35, 0.15] },
    { from: [51.50, -0.12], to: [50.11, 8.68], color: [0.18, 0.49, 0.32] },
    { from: [-23.55, -46.63], to: [37.77, -122.41], color: [0.78, 0.35, 0.15] },
    { from: [35.67, 139.65], to: [1.35, 103.81], color: [0.18, 0.49, 0.32] }
  ], []);

  const focusOnNode = useCallback((peer: PeerNode) => {
    setActiveNode(peer);
    if (onSelectPeer) {
      onSelectPeer(peer);
    }
    const targetPhi = ((peer.lng + 180) * Math.PI) / 180;
    const targetTheta = (peer.lat * Math.PI) / 180;
    phiRef.current = targetPhi;
    thetaRef.current = Math.max(-0.8, Math.min(0.8, targetTheta * 0.5));
  }, [onSelectPeer]);

  useEffect(() => {
    let width = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    let globe: any = null;
    let animationFrameId: number;

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 2, 2),
        width: (width || 400) * 2,
        height: (width || 400) * 2,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 18000,
        mapBrightness: 5.5,
        baseColor: [0.91, 0.88, 0.80], // Warm Rialo Sand base
        markerColor: [0.78, 0.35, 0.15], // Rialo rust-orange accent #C85A27
        glowColor: [0.86, 0.82, 0.72],
        markers,
        arcs,
        arcColor: [0.78, 0.35, 0.15],
        arcWidth: 1.5,
        arcHeight: 0.3
      });

      const animate = () => {
        if (isAutoRotating && !pointerInteracting.current) {
          phiRef.current += 0.004;
        }

        if (globe) {
          globe.update({
            phi: phiRef.current + rRef.current,
            theta: thetaRef.current,
            width: (width || 400) * 2,
            height: (width || 400) * 2,
            markers
          });
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    } catch {
      // Fallback
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener('resize', onResize);
    };
  }, [isAutoRotating, markers, arcs]);

  return (
    <div className="relative w-full overflow-hidden bg-[#E8E2D3] border border-rialo-border flex flex-col items-center justify-center p-4 min-h-[460px] sm:min-h-[520px]">
      {/* Background Cyber Glowing Blur Effect */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-rialo-accent/15 blur-3xl pointer-events-none -top-10 -right-10"></div>
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-status-online/10 blur-3xl pointer-events-none -bottom-10 -left-10"></div>

      {/* Top Overlay Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-rialo-card/95 backdrop-blur-xs border border-rialo-border px-3.5 py-2 pointer-events-auto flex items-center space-x-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-status-online animate-subtle-pulse"></span>
          <span className="font-display text-xs font-bold text-rialo-text uppercase tracking-wider">
            3D Global Telemetry Mesh
          </span>
          <span className="text-[10px] font-mono text-rialo-subtext">
            ({peers.length} Nodes • 5 Live Arcs)
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Auto Rotation Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="bg-rialo-card/95 backdrop-blur-xs border border-rialo-border hover:bg-rialo-surface text-rialo-text px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5 shadow-xs transition-colors"
            title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-status-degraded" /> : <Play className="w-3.5 h-3.5 text-status-online" />}
            <span>{isAutoRotating ? 'Pause Spin' : 'Auto Spin'}</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={() => {
              phiRef.current = 0;
              thetaRef.current = 0.2;
              rRef.current = 0;
            }}
            className="bg-rialo-card/95 backdrop-blur-xs border border-rialo-border hover:bg-rialo-surface text-rialo-text p-2 shadow-xs transition-colors"
            title="Reset globe view angle"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Globe Container */}
      <div
        className="w-full max-w-[420px] sm:max-w-[480px] aspect-square relative z-10 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          isDragging.current = true;
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          isDragging.current = false;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          isDragging.current = false;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            rRef.current = delta * 0.008;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            rRef.current = delta * 0.008;
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-95 transition-opacity duration-500"
          style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
        />
      </div>

      {/* Bottom Overlaid Node Quick Selector Pill & Details */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        {/* Active Node Detail Card */}
        {activeNode && (
          <div className="bg-rialo-card/95 backdrop-blur-xs border border-rialo-border p-3 pointer-events-auto font-mono text-xs max-w-sm w-full shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-rialo-border">
              <div className="flex items-center space-x-1.5 font-bold text-rialo-text truncate">
                <MapPin className="w-3.5 h-3.5 text-rialo-accent shrink-0" />
                <span className="truncate">{activeNode.nodeName}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 shrink-0 ${
                activeNode.status === 'synced' ? 'bg-status-online/15 text-status-online' : 'bg-status-degraded/15 text-status-degraded'
              }`}>
                {activeNode.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-rialo-subtext">
              <div>
                <span className="text-rialo-muted text-[9px] uppercase block">Location</span>
                <span className="font-semibold text-rialo-text truncate block">{activeNode.country}</span>
              </div>
              <div>
                <span className="text-rialo-muted text-[9px] uppercase block">Latency</span>
                <span className="font-semibold text-rialo-text">{activeNode.pingMs} ms</span>
              </div>
              <div>
                <span className="text-rialo-muted text-[9px] uppercase block">Block</span>
                <span className="font-semibold text-rialo-text">#{activeNode.blockHeight.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Node Focus Carousel Selector */}
        <div className="bg-rialo-card/95 backdrop-blur-xs border border-rialo-border p-2 pointer-events-auto flex items-center space-x-1.5 overflow-x-auto max-w-md shadow-lg scrollbar-none">
          <span className="text-[10px] uppercase font-mono text-rialo-muted px-1.5 shrink-0">Focus:</span>
          {peers.slice(0, 5).map((p) => {
            const isSelected = activeNode?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => focusOnNode(p)}
                className={`px-2 py-1 text-[11px] font-mono whitespace-nowrap transition-colors flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-rialo-text text-rialo-bg font-bold shadow-xs'
                    : 'text-rialo-subtext hover:text-rialo-text hover:bg-rialo-surface'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'synced' ? 'bg-status-online' : 'bg-status-degraded'}`}></span>
                <span>{p.country.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
