import React from 'react';
import type { CropZone } from '../types';
import { Grid, Eye, Thermometer, Droplets } from 'lucide-react';

interface FieldHeatmapProps {
  zones: CropZone[];
  selectedZoneId: string;
  onSelectZone: (zone: CropZone) => void;
}

export const FieldHeatmap: React.FC<FieldHeatmapProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  // Map statuses to tailwind classes
  const getStatusColor = (status: CropZone['status'], isSelected: boolean) => {
    switch (status) {
      case 'healthy':
        return isSelected
          ? 'fill-emerald-500/35 stroke-emerald-400 stroke-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
          : 'fill-emerald-950/20 stroke-emerald-500/50 hover:fill-emerald-500/20 hover:stroke-emerald-400';
      case 'warning':
        return isSelected
          ? 'fill-amber-500/35 stroke-amber-400 stroke-2 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
          : 'fill-amber-950/20 stroke-amber-500/50 hover:fill-amber-500/20 hover:stroke-amber-400';
      case 'critical':
        return isSelected
          ? 'fill-rose-500/35 stroke-rose-400 stroke-2 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse'
          : 'fill-rose-950/20 stroke-rose-500/50 hover:fill-rose-500/20 hover:stroke-rose-400';
    }
  };

  const getBadgeColor = (status: CropZone['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-agri-primary" />
            <span>Interactive Field Map</span>
          </h2>
          <p className="text-xs text-slate-400">Select a zone below to analyze telemetry streams</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Eye className="w-4 h-4 text-agri-accent" />
          <span>Live NDVI Satellite Map</span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative aspect-[5/3] w-full bg-slate-950/40 rounded-2xl border border-agri-border overflow-hidden p-2">
        <svg viewBox="0 0 500 300" className="w-full h-full select-none">
          {/* Defs for gradients & patterns */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Grid lines (Simulated Agricultural Grid) */}
          {/* Sector 1 (Top Left) */}
          <polygon
            points="10,10 240,10 240,140 10,140"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[0].status, selectedZoneId === zones[0].id)}`}
            onClick={() => onSelectZone(zones[0])}
          />
          {/* Sector 2 (Top Right) */}
          <polygon
            points="260,10 490,10 490,140 260,140"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[1].status, selectedZoneId === zones[1].id)}`}
            onClick={() => onSelectZone(zones[1])}
          />
          {/* Sector 3 (Mid Left) */}
          <polygon
            points="10,160 150,160 150,290 10,290"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[2].status, selectedZoneId === zones[2].id)}`}
            onClick={() => onSelectZone(zones[2])}
          />
          {/* Sector 4 (Mid Center) */}
          <polygon
            points="170,160 320,160 320,290 170,290"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[3].status, selectedZoneId === zones[3].id)}`}
            onClick={() => onSelectZone(zones[3])}
          />
          {/* Sector 5 & 6 (Split Bottom Right) */}
          <polygon
            points="340,160 490,160 490,220 340,220"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[4].status, selectedZoneId === zones[4].id)}`}
            onClick={() => onSelectZone(zones[4])}
          />
          <polygon
            points="340,230 490,230 490,290 340,290"
            className={`cursor-pointer transition-all duration-300 ${getStatusColor(zones[5].status, selectedZoneId === zones[5].id)}`}
            onClick={() => onSelectZone(zones[5])}
          />

          {/* SVG Labels */}
          <text x="25" y="35" className="fill-white text-[11px] font-bold font-mono pointer-events-none">A - Corn</text>
          <text x="25" y="55" className="fill-slate-400 text-[9px] font-mono pointer-events-none">NDVI: {zones[0].ndvi}</text>

          <text x="275" y="35" className="fill-white text-[11px] font-bold font-mono pointer-events-none">B - Wheat</text>
          <text x="275" y="55" className="fill-slate-400 text-[9px] font-mono pointer-events-none">NDVI: {zones[1].ndvi}</text>

          <text x="25" y="185" className="fill-white text-[11px] font-bold font-mono pointer-events-none">C - Tomato</text>
          <text x="25" y="205" className="fill-slate-400 text-[9px] font-mono pointer-events-none">NDVI: {zones[2].ndvi}</text>

          <text x="185" y="185" className="fill-white text-[11px] font-bold font-mono pointer-events-none">D - Potato</text>
          <text x="185" y="205" className="fill-slate-400 text-[9px] font-mono pointer-events-none">NDVI: {zones[3].ndvi}</text>

          <text x="355" y="185" className="fill-white text-[9px] font-bold font-mono pointer-events-none">E - Soybean</text>
          <text x="355" y="255" className="fill-white text-[9px] font-bold font-mono pointer-events-none">F - Barley</text>
        </svg>

        {/* Floating Legends */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500"></span>
            <span className="text-slate-300">Healthy</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500"></span>
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-500 animate-pulse"></span>
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      {/* Grid of details summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone)}
            className={`text-left p-3 rounded-xl border transition-all duration-200 ${
              selectedZoneId === zone.id
                ? 'bg-slate-900/80 border-agri-primary/60 shadow-lg shadow-agri-primary/5'
                : 'bg-slate-950/20 border-agri-border hover:bg-slate-900/40'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono font-bold text-white">{zone.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${getBadgeColor(zone.status)}`}>
                {zone.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate mb-2">{zone.cropType}</div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-900 pt-1.5">
              <span className="flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-sky-400" />
                {zone.moisture}%
              </span>
              <span className="flex items-center gap-0.5">
                <Thermometer className="w-3 h-3 text-orange-400" />
                {zone.temperature}°C
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
