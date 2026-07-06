import React from 'react';
import { Leaf, LayoutDashboard, Sprout, Activity, Bell, Settings, ShieldCheck } from 'lucide-react';
import type { CropZone } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  zones: CropZone[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, zones }) => {
  const averageHealth = Math.round(
    zones.reduce((acc, zone) => acc + zone.healthScore, 0) / zones.length
  );

  const criticalCount = zones.filter((z) => z.status === 'critical').length;
  const warningCount = zones.filter((z) => z.status === 'warning').length;

  return (
    <aside className="w-full lg:w-64 bg-agri-panel border-r border-agri-border backdrop-blur-md flex flex-col p-6 h-auto lg:h-screen shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-agri-primary/10 rounded-xl text-agri-primary border border-agri-primary/20 animate-glow-green">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-wide text-white flex items-center gap-1.5">
            Farm<span className="text-agri-primary">HUD</span>
          </h1>
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Precision HUD</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 mb-8 border-b border-agri-border lg:border-b-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-agri-primary text-white shadow-lg shadow-agri-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-agri-primary text-white shadow-lg shadow-agri-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Sensor Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('crops')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === 'crops'
              ? 'bg-agri-primary text-white shadow-lg shadow-agri-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Crop Database</span>
        </button>
      </nav>

      {/* Global Diagnostics Summary */}
      <div className="hidden lg:flex flex-col gap-4 mt-auto border-t border-agri-border pt-6">
        <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase">Farm Diagnostics</h3>
        
        {/* Progress Circle Indicator */}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-agri-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Avg Crop Health</span>
            <span className="text-sm font-bold text-agri-primary">{averageHealth}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-agri-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${averageHealth}%` }}
            ></div>
          </div>
        </div>

        {/* Action Bulletins */}
        <div className="flex flex-col gap-2">
          {criticalCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-agri-danger/10 border border-agri-danger/20 text-agri-danger animate-pulse">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">{criticalCount} Critical Zone(s)</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-agri-warning/10 border border-agri-warning/20 text-agri-warning">
              <Bell className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">{warningCount} Warning Zone(s)</span>
            </div>
          )}
          {criticalCount === 0 && warningCount === 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-agri-primary/10 border border-agri-primary/20 text-agri-primary">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">All Systems Optimal</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Settings Toggle (Muted) */}
      <div className="hidden lg:flex items-center justify-between border-t border-agri-border pt-4 mt-4 text-slate-400">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <span className="text-xs font-mono">v4.0.1 (Vite)</span>
        </div>
      </div>
    </aside>
  );
};
