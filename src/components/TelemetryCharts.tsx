import React from 'react';
import type { CropZone } from '../types';
import { Activity, Droplets, Leaf } from 'lucide-react';

interface TelemetryChartsProps {
  zone: CropZone;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ zone }) => {
  const history = zone.history;
  
  // Custom SVG line chart coordinates generator
  const width = 500;
  const height = 140;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Generate coordinates for Moisture (0 - 100%)
  const generateMoisturePoints = () => {
    return history.map((h, index) => {
      const x = paddingLeft + (index / (history.length - 1)) * chartWidth;
      // y-axis is inverted: 0 is at top, height is at bottom
      const y = paddingTop + chartHeight - (h.moisture / 100) * chartHeight;
      return { x, y, value: h.moisture, date: h.date };
    });
  };

  // Generate coordinates for NDVI (0.0 - 1.0)
  const generateNdviPoints = () => {
    return history.map((h, index) => {
      const x = paddingLeft + (index / (history.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (h.ndvi * chartHeight);
      return { x, y, value: h.ndvi, date: h.date };
    });
  };

  const moisturePoints = generateMoisturePoints();
  const ndviPoints = generateNdviPoints();

  // SVG Line path string
  const linePath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  };

  // SVG Area path string (closes the shape at the bottom axis for gradient fills)
  const areaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const start = `M ${points[0].x} ${paddingTop + chartHeight}`;
    const line = points.reduce((acc, p) => `${acc} L ${p.x} ${p.y}`, start);
    return `${line} L ${points[points.length - 1].x} ${paddingTop + chartHeight} Z`;
  };

  // NPK Ideal reference values vs current values
  const npkData = [
    { label: 'Nitrogen (N)', current: zone.nitrogen, ideal: 120, color: 'bg-emerald-500', barColor: 'fill-emerald-500' },
    { label: 'Phosphorus (P)', current: zone.phosphorus, ideal: 60, color: 'bg-sky-500', barColor: 'fill-sky-500' },
    { label: 'Potassium (K)', current: zone.potassium, ideal: 100, color: 'bg-amber-500', barColor: 'fill-amber-500' },
  ];

  return (
    <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-agri-primary" />
            <span>Telemetry Trends: {zone.name}</span>
          </h2>
          <p className="text-xs text-slate-400">7-day historical crop sensors logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soil Moisture Trend Chart */}
        <div className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              Soil Moisture (%)
            </span>
            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
              Current: {zone.moisture}%
            </span>
          </div>

          <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 25, 50, 75, 100].map((v) => {
                const y = paddingTop + chartHeight - (v / 100) * chartHeight;
                return (
                  <g key={v}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="rgba(71, 85, 105, 0.1)"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-slate-500 font-mono text-[9px]"
                    >
                      {v}%
                    </text>
                  </g>
                );
              })}

              {/* Chart Line and Area */}
              <path d={areaPath(moisturePoints)} fill="url(#moistureGradient)" />
              <path d={linePath(moisturePoints)} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Interactive Point Circles */}
              {moisturePoints.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-slate-950 stroke-sky-400 stroke-2 hover:r-6 cursor-pointer transition-all duration-150"
                  />
                  <text
                    x={p.x}
                    y={paddingTop + chartHeight + 15}
                    textAnchor="middle"
                    className="fill-slate-500 font-mono text-[8px]"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* NDVI Crop Greenness Trend Chart */}
        <div className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Vegetation Index (NDVI)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Current: {zone.ndvi}
            </span>
          </div>

          <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              <defs>
                <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
                const y = paddingTop + chartHeight - (v * chartHeight);
                return (
                  <g key={v}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="rgba(71, 85, 105, 0.1)"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-slate-500 font-mono text-[9px]"
                    >
                      {v.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Chart Line and Area */}
              <path d={areaPath(ndviPoints)} fill="url(#ndviGradient)" />
              <path d={linePath(ndviPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

              {/* Interactive Point Circles */}
              {ndviPoints.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-slate-950 stroke-emerald-400 stroke-2 hover:r-6 cursor-pointer transition-all duration-150"
                  />
                  <text
                    x={p.x}
                    y={paddingTop + chartHeight + 15}
                    textAnchor="middle"
                    className="fill-slate-500 font-mono text-[8px]"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Soil Nutrients N-P-K Indicators */}
      <div className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-5">
        <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-4">Soil N-P-K Mineral Balance (mg/kg)</h3>
        
        <div className="flex flex-col gap-4">
          {npkData.map((item, index) => {
            const percentage = Math.min(Math.round((item.current / item.ideal) * 100), 100);
            return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-full sm:w-1/4">
                  <span className="text-xs font-bold text-slate-300 block">{item.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Ideal Target: {item.ideal}</span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white w-12 text-right">
                    {item.current}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
