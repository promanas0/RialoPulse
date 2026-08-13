import React, { useState } from 'react';
import type { PeerNode } from '../types';
import { Globe, Server, Activity, ShieldCheck, MapPin, Search, PlusCircle, X } from 'lucide-react';

interface PeerVisualizerProps {
  peers: PeerNode[];
  onAddPeer?: (peer: PeerNode) => void;
  currentBlockHeight: number;
}

export const PeerVisualizer: React.FC<PeerVisualizerProps> = ({
  peers,
  onAddPeer,
  currentBlockHeight
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'synced' | 'syncing'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredPeer, setHoveredPeer] = useState<PeerNode | null>(null);

  // Add peer modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newRegion, setNewRegion] = useState('North America');
  const [newCountry, setNewCountry] = useState('United States');
  const [newLat, setNewLat] = useState('37.77');
  const [newLng, setNewLng] = useState('-122.41');

  const regions = ['All', 'North America', 'Europe', 'Asia Pacific', 'South America'];

  // Calculate dynamic sync status & peer filtering
  const processedPeers = peers.map(p => {
    const isSynced = Math.abs(currentBlockHeight - p.blockHeight) <= 2;
    return {
      ...p,
      status: (isSynced ? 'synced' : 'syncing') as 'synced' | 'syncing'
    };
  });

  const filteredPeers = processedPeers.filter(p => {
    const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
    const matchesStatus = selectedStatusFilter === 'All' || p.status === selectedStatusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      p.nodeName.toLowerCase().includes(query) ||
      p.country.toLowerCase().includes(query) ||
      p.region.toLowerCase().includes(query) ||
      p.version.toLowerCase().includes(query);

    return matchesRegion && matchesStatus && matchesSearch;
  });

  const syncedCount = processedPeers.filter(p => p.status === 'synced').length;
  const syncingCount = processedPeers.filter(p => p.status === 'syncing').length;
  const avgPing = processedPeers.length > 0 
    ? Math.round(processedPeers.reduce((acc, p) => acc + p.pingMs, 0) / processedPeers.length) 
    : 0;

  // Simple coordinate projection for world map representation
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const handleAddPeerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const latNum = parseFloat(newLat) || 0;
    const lngNum = parseFloat(newLng) || 0;

    const createdPeer: PeerNode = {
      id: `custom-node-${Date.now()}`,
      nodeName: newNodeName.trim(),
      version: 'v0.9.4-rex-parallel',
      region: newRegion,
      country: newCountry.trim() || 'Global',
      lat: latNum,
      lng: lngNum,
      status: 'synced',
      uptimePct: 99.99,
      pingMs: Math.floor(Math.random() * 20) + 12,
      blockHeight: currentBlockHeight
    };

    if (onAddPeer) {
      onAddPeer(createdPeer);
    }

    setNewNodeName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Peer Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-rialo-card border border-rialo-border p-5">
          <div className="flex items-center justify-between text-rialo-subtext">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Connected Peers</span>
            <Globe className="w-4 h-4 text-rialo-accent" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-rialo-text">{processedPeers.length}</span>
            <div className="text-xs text-rialo-subtext mt-1 font-mono">148 Validator Network Nodes</div>
          </div>
        </div>

        <div className="bg-rialo-card border border-rialo-border p-5">
          <div className="flex items-center justify-between text-rialo-subtext">
            <span className="text-xs uppercase tracking-wider font-semibold">Sync Status</span>
            <ShieldCheck className="w-4 h-4 text-status-online" />
          </div>
          <div className="mt-3 flex items-baseline space-x-4">
            <div>
              <span className="text-2xl font-bold font-mono text-status-online">{syncedCount}</span>
              <span className="text-xs text-rialo-muted ml-1">Synced</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-status-degraded">{syncingCount}</span>
              <span className="text-xs text-rialo-muted ml-1">Syncing</span>
            </div>
          </div>
        </div>

        <div className="bg-rialo-card border border-rialo-border p-5">
          <div className="flex items-center justify-between text-rialo-subtext">
            <span className="text-xs uppercase tracking-wider font-semibold">Avg Network Ping</span>
            <Activity className="w-4 h-4 text-rialo-muted" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-rialo-text">{avgPing} ms</span>
            <div className="text-xs text-rialo-subtext mt-1 font-mono">Measured Latency Matrix</div>
          </div>
        </div>

        <div className="bg-rialo-card border border-rialo-border p-5">
          <div className="flex items-center justify-between text-rialo-subtext">
            <span className="text-xs uppercase tracking-wider font-semibold">Runtime Version</span>
            <Server className="w-4 h-4 text-rialo-muted" />
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold font-mono text-rialo-text">v0.9.4-rex</span>
            <div className="text-xs text-rialo-subtext mt-1 font-mono">REX Parallel Engine</div>
          </div>
        </div>
      </div>

      {/* Interactive Global Map Visualizer */}
      <div className="bg-rialo-card border border-rialo-border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-rialo-border gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-rialo-text">Geographic Peer Distribution</h3>
            <p className="text-xs text-rialo-subtext mt-0.5">Live geolocation telemetry of active Rialo validator nodes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Region Filters */}
            <div className="flex flex-wrap gap-1 bg-rialo-surface p-1 border border-rialo-border text-xs">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 font-medium transition-colors ${
                    selectedRegion === reg
                      ? 'bg-rialo-card text-rialo-text border border-rialo-border shadow-sm'
                      : 'text-rialo-subtext hover:text-rialo-text'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Add Node Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 bg-rialo-text text-rialo-bg hover:bg-rialo-dark px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors border border-rialo-text"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Monitor Custom Node</span>
            </button>
          </div>
        </div>

        {/* Map Container Canvas */}
        <div className="relative w-full h-80 sm:h-96 mt-6 bg-[#E3DCCB] border border-rialo-border overflow-hidden p-4">
          {/* Subtle World Map Grid Lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#C9C0AA_1px,transparent_1px),linear-gradient(to_bottom,#C9C0AA_1px,transparent_1px)] bg-[size:4%_8%]"></div>

          {/* Peer Node Points on Map */}
          {filteredPeers.map((peer) => {
            const { x, y } = projectCoords(peer.lat, peer.lng);
            const isHovered = hoveredPeer?.id === peer.id;

            return (
              <div
                key={peer.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setHoveredPeer(peer)}
                onMouseLeave={() => setHoveredPeer(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                {/* Ping Pulse Rings */}
                <span className={`absolute inline-flex h-6 w-6 -left-2 -top-2 rounded-full opacity-40 animate-ping ${
                  peer.status === 'synced' ? 'bg-status-online' : 'bg-status-degraded'
                }`}></span>
                
                {/* Node Marker Dot */}
                <span className={`relative inline-block w-3 h-3 rounded-full border-2 border-rialo-card transition-transform ${
                  peer.status === 'synced' ? 'bg-status-online' : 'bg-status-degraded'
                } ${isHovered ? 'scale-150' : 'group-hover:scale-125'}`}></span>

                {/* Hover Tooltip Popup */}
                {isHovered && (
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-56 bg-rialo-text text-rialo-bg p-3 shadow-xl z-30 font-mono text-xs pointer-events-none">
                    <div className="font-bold flex items-center justify-between border-b border-rialo-subtext/40 pb-1 mb-1.5">
                      <span>{peer.nodeName}</span>
                      <span className={`text-[10px] uppercase ${peer.status === 'synced' ? 'text-status-online' : 'text-status-degraded'}`}>
                        {peer.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-rialo-sand">
                      <div>Location: {peer.country}</div>
                      <div>Latency: {peer.pingMs} ms</div>
                      <div>Uptime: {peer.uptimePct}%</div>
                      <div>Version: {peer.version}</div>
                      <div>Block: #{peer.blockHeight.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-rialo-card/90 border border-rialo-border px-3 py-2 text-xs font-mono flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-online"></span>
              <span className="text-rialo-text">Synced Node</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-degraded"></span>
              <span className="text-rialo-text">Syncing Node</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Telemetry Table with Search & Filter */}
      <div className="bg-rialo-card border border-rialo-border p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rialo-border gap-4 mb-4">
          <h3 className="font-display text-lg font-bold text-rialo-text">Validator & Sequencer Telemetry Matrix</h3>

          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-rialo-muted" />
              <input
                type="text"
                placeholder="Search node, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-rialo-surface border border-rialo-border pl-8 pr-3 py-1.5 text-rialo-text focus:outline-none focus:border-rialo-text w-48 sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-rialo-surface border border-rialo-border px-2 py-1.5 text-rialo-text focus:outline-none focus:border-rialo-text"
            >
              <option value="All">All Sync Status</option>
              <option value="synced">Synced Only</option>
              <option value="syncing">Syncing Only</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-rialo-border text-rialo-subtext uppercase tracking-wider text-[11px]">
              <th className="pb-3 font-semibold">Node ID / Name</th>
              <th className="pb-3 font-semibold">Region & Country</th>
              <th className="pb-3 font-semibold">Ping Latency</th>
              <th className="pb-3 font-semibold">Sync Status</th>
              <th className="pb-3 font-semibold">Uptime</th>
              <th className="pb-3 font-semibold text-right">Block Height</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rialo-border">
            {filteredPeers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-rialo-muted font-sans">
                  No validator nodes found matching query criteria.
                </td>
              </tr>
            ) : (
              filteredPeers.map((peer) => (
                <tr key={peer.id} className="hover:bg-rialo-surface/50 transition-colors">
                  <td className="py-3 font-medium text-rialo-text flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-rialo-muted" />
                    <span>{peer.nodeName}</span>
                  </td>
                  <td className="py-3 text-rialo-subtext">
                    {peer.country} ({peer.region})
                  </td>
                  <td className="py-3 font-semibold text-rialo-text">
                    {peer.pingMs} ms
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center space-x-1.5 ${
                      peer.status === 'synced' ? 'text-status-online' : 'text-status-degraded'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        peer.status === 'synced' ? 'bg-status-online' : 'bg-status-degraded'
                      }`}></span>
                      <span className="uppercase text-[11px] font-semibold">{peer.status}</span>
                    </span>
                  </td>
                  <td className="py-3 text-rialo-subtext">
                    {peer.uptimePct}%
                  </td>
                  <td className="py-3 text-right text-rialo-text font-bold">
                    #{peer.blockHeight.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Custom Peer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-rialo-card border border-rialo-border p-6 max-w-md w-full font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-rialo-border">
              <h3 className="font-display text-lg font-bold text-rialo-text">Monitor Custom Validator Node</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-rialo-muted hover:text-rialo-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPeerSubmit} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-rialo-muted uppercase tracking-wider text-[11px] mb-1">Node Identifier / Name</label>
                <input
                  type="text"
                  required
                  placeholder="Validator-Tokyo-09"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 focus:outline-none focus:border-rialo-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rialo-muted uppercase tracking-wider text-[11px] mb-1">Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 focus:outline-none focus:border-rialo-text"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="South America">South America</option>
                  </select>
                </div>

                <div>
                  <label className="block text-rialo-muted uppercase tracking-wider text-[11px] mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="Japan"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 focus:outline-none focus:border-rialo-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rialo-muted uppercase tracking-wider text-[11px] mb-1">Latitude</label>
                  <input
                    type="text"
                    placeholder="35.67"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 focus:outline-none focus:border-rialo-text"
                  />
                </div>

                <div>
                  <label className="block text-rialo-muted uppercase tracking-wider text-[11px] mb-1">Longitude</label>
                  <input
                    type="text"
                    placeholder="139.65"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full bg-rialo-surface border border-rialo-border text-rialo-text p-2 focus:outline-none focus:border-rialo-text"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-rialo-border text-rialo-subtext hover:text-rialo-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rialo-text text-rialo-bg font-bold uppercase tracking-wider hover:bg-rialo-dark"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
