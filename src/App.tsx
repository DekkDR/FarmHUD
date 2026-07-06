import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FieldHeatmap } from './components/FieldHeatmap';
import { TelemetryCharts } from './components/TelemetryCharts';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { RemediationPlanner } from './components/RemediationPlanner';
import type { CropZone, RemediationTask, DiagnosticSample } from './types';
import { Sun, CloudRain } from 'lucide-react';

const initialZones: CropZone[] = [
  {
    id: 'zone-a',
    name: 'Sector Alpha',
    cropType: 'Corn',
    healthScore: 92,
    status: 'healthy',
    ndvi: 0.85,
    moisture: 68,
    temperature: 26,
    nitrogen: 125,
    phosphorus: 58,
    potassium: 102,
    history: [
      { date: 'Mon', moisture: 62, ndvi: 0.80 },
      { date: 'Tue', moisture: 65, ndvi: 0.81 },
      { date: 'Wed', moisture: 63, ndvi: 0.82 },
      { date: 'Thu', moisture: 68, ndvi: 0.83 },
      { date: 'Fri', moisture: 66, ndvi: 0.84 },
      { date: 'Sat', moisture: 69, ndvi: 0.84 },
      { date: 'Sun', moisture: 68, ndvi: 0.85 },
    ],
  },
  {
    id: 'zone-b',
    name: 'Sector Beta',
    cropType: 'Wheat',
    healthScore: 68,
    status: 'warning',
    ndvi: 0.62,
    moisture: 32, // Low
    temperature: 29,
    nitrogen: 110,
    phosphorus: 55,
    potassium: 95,
    history: [
      { date: 'Mon', moisture: 48, ndvi: 0.71 },
      { date: 'Tue', moisture: 44, ndvi: 0.69 },
      { date: 'Wed', moisture: 40, ndvi: 0.67 },
      { date: 'Thu', moisture: 38, ndvi: 0.65 },
      { date: 'Fri', moisture: 35, ndvi: 0.64 },
      { date: 'Sat', moisture: 33, ndvi: 0.63 },
      { date: 'Sun', moisture: 32, ndvi: 0.62 },
    ],
  },
  {
    id: 'zone-c',
    name: 'Sector Gamma',
    cropType: 'Tomato',
    healthScore: 42, // Critical
    status: 'critical',
    ndvi: 0.45,
    moisture: 52,
    temperature: 24,
    nitrogen: 118,
    phosphorus: 38, // Low phosphorus
    potassium: 98,
    history: [
      { date: 'Mon', moisture: 55, ndvi: 0.58 },
      { date: 'Tue', moisture: 54, ndvi: 0.55 },
      { date: 'Wed', moisture: 52, ndvi: 0.52 },
      { date: 'Thu', moisture: 50, ndvi: 0.50 },
      { date: 'Fri', moisture: 51, ndvi: 0.48 },
      { date: 'Sat', moisture: 53, ndvi: 0.46 },
      { date: 'Sun', moisture: 52, ndvi: 0.45 },
    ],
  },
  {
    id: 'zone-d',
    name: 'Sector Delta',
    cropType: 'Potato',
    healthScore: 89,
    status: 'healthy',
    ndvi: 0.81,
    moisture: 71,
    temperature: 22,
    nitrogen: 122,
    phosphorus: 61,
    potassium: 104,
    history: [
      { date: 'Mon', moisture: 68, ndvi: 0.77 },
      { date: 'Tue', moisture: 70, ndvi: 0.78 },
      { date: 'Wed', moisture: 72, ndvi: 0.79 },
      { date: 'Thu', moisture: 69, ndvi: 0.80 },
      { date: 'Fri', moisture: 71, ndvi: 0.81 },
      { date: 'Sat', moisture: 73, ndvi: 0.81 },
      { date: 'Sun', moisture: 71, ndvi: 0.81 },
    ],
  },
  {
    id: 'zone-e',
    name: 'Sector Epsilon',
    cropType: 'Soybean',
    healthScore: 94,
    status: 'healthy',
    ndvi: 0.88,
    moisture: 74,
    temperature: 25,
    nitrogen: 130,
    phosphorus: 62,
    potassium: 108,
    history: [
      { date: 'Mon', moisture: 70, ndvi: 0.85 },
      { date: 'Tue', moisture: 72, ndvi: 0.86 },
      { date: 'Wed', moisture: 73, ndvi: 0.87 },
      { date: 'Thu', moisture: 75, ndvi: 0.87 },
      { date: 'Fri', moisture: 74, ndvi: 0.88 },
      { date: 'Sat', moisture: 76, ndvi: 0.88 },
      { date: 'Sun', moisture: 74, ndvi: 0.88 },
    ],
  },
  {
    id: 'zone-f',
    name: 'Sector Zeta',
    cropType: 'Barley',
    healthScore: 74,
    status: 'warning',
    ndvi: 0.68,
    moisture: 45,
    temperature: 23,
    nitrogen: 88, // Low nitrogen
    phosphorus: 59,
    potassium: 90,
    history: [
      { date: 'Mon', moisture: 52, ndvi: 0.72 },
      { date: 'Tue', moisture: 50, ndvi: 0.71 },
      { date: 'Wed', moisture: 48, ndvi: 0.70 },
      { date: 'Thu', moisture: 47, ndvi: 0.69 },
      { date: 'Fri', moisture: 46, ndvi: 0.69 },
      { date: 'Sat', moisture: 45, ndvi: 0.68 },
      { date: 'Sun', moisture: 45, ndvi: 0.68 },
    ],
  },
];

const initialTasks: RemediationTask[] = [
  {
    id: 'task-1',
    zoneId: 'zone-b',
    title: 'Increase irrigation volume',
    description: 'Target: dry upper topsoil layer',
    type: 'watering',
    status: 'pending',
  },
  {
    id: 'task-2',
    zoneId: 'zone-c',
    title: 'Apply copper-based spray',
    description: 'Suppress potential fungal leaf spots',
    type: 'treatment',
    status: 'pending',
  },
  {
    id: 'task-3',
    zoneId: 'zone-f',
    title: 'Supplement nitrogen feed',
    description: 'Add rapid release liquid nitrogen',
    type: 'fertilizer',
    status: 'pending',
  },
];

const diagnosticSamples: DiagnosticSample[] = [
  {
    id: 'sample-wheat',
    name: 'Wheat Foliage',
    cropType: 'Wheat',
    diseaseName: 'Leaf Rust (Puccinia recondita)',
    confidence: 96.4,
    symptoms: ['Orange-brown powdery pustules', 'Yellow chlorotic halos on leaves', 'Premature leaf drop'],
    recommendations: [
      'Apply triazole fungicide immediately',
      'Reduce dense foliage crop density',
      'Optimize localized drip irrigation parameters',
    ],
    isHealthy: false,
    visualPattern: 'bg-gradient-to-br from-amber-800 to-yellow-950',
  },
  {
    id: 'sample-tomato',
    name: 'Tomato Leaf',
    cropType: 'Tomato',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    confidence: 94.2,
    symptoms: ['Dark brown water-soaked lesions', 'White fuzzy mold on underside', 'Stem blackening'],
    recommendations: [
      'Apply copper-based organic fungicides',
      'Remove and burn infected leaves',
      'Avoid overhead leaf-wetting irrigation',
    ],
    isHealthy: false,
    visualPattern: 'bg-gradient-to-br from-rose-950 to-red-900',
  },
  {
    id: 'sample-corn',
    name: 'Corn Sprout',
    cropType: 'Corn',
    diseaseName: 'Healthy Corn Foliage',
    confidence: 99.1,
    symptoms: ['Uniform dark-green color', 'Sturdy leaf vein architecture', 'Zero lesions detected'],
    recommendations: [
      'Maintain current N-P-K fertilizer cycle',
      'Continue baseline watering scheduled programs',
    ],
    isHealthy: true,
    visualPattern: 'bg-gradient-to-br from-emerald-900 to-green-950',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [zones, setZones] = useState<CropZone[]>(initialZones);
  const [selectedZone, setSelectedZone] = useState<CropZone>(initialZones[0]);
  const [tasks, setTasks] = useState<RemediationTask[]>(initialTasks);
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'rainy'>('sunny');

  // Trigger simulated rain event to adjust soil moisture live!
  const triggerRainEvent = () => {
    setWeatherCondition('rainy');
    const updatedZones = zones.map((z) => {
      const newMoisture = Math.min(z.moisture + 15, 100);
      const newHealth = Math.min(z.healthScore + 3, 100);
      let newStatus = z.status;
      if (newMoisture > 40 && z.status === 'warning' && z.id === 'zone-b') {
        newStatus = 'healthy';
      }
      return {
        ...z,
        moisture: newMoisture,
        healthScore: newHealth,
        status: newStatus,
        history: [...z.history.slice(1), { date: 'Now', moisture: newMoisture, ndvi: z.ndvi }],
      };
    });
    setZones(updatedZones);
    const updatedSelected = updatedZones.find((z) => z.id === selectedZone.id);
    if (updatedSelected) {
      setSelectedZone(updatedSelected);
    }

    // Set timeout to return weather back to normal
    setTimeout(() => {
      setWeatherCondition('sunny');
    }, 6000);
  };

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
    );
  };

  const handleAddTask = (zoneId: string, title: string, type: RemediationTask['type']) => {
    const newTask: RemediationTask = {
      id: `task-${Date.now()}`,
      zoneId,
      title,
      description: 'Manually logged treatment directive',
      type,
      status: 'pending',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Connect Diagnostic results back to Tasks
  const handleAddRemediationTasks = (diseaseName: string, recommendations: string[]) => {
    const newTasks = recommendations.map((rec, idx) => ({
      id: `task-scan-${Date.now()}-${idx}`,
      zoneId: selectedZone.id,
      title: rec,
      description: `Synced diagnostic rule for: ${diseaseName}`,
      type: (idx === 1 ? 'fertilizer' : idx === 2 ? 'watering' : 'treatment') as RemediationTask['type'],
      status: 'pending' as const,
    }));
    setTasks((prev) => [...newTasks, ...prev]);
    
    // Dynamically adjust selected zone health index downward if disease detected
    if (selectedZone.status !== 'critical') {
      const updatedZones = zones.map((z) => {
        if (z.id === selectedZone.id) {
          const newHealth = Math.max(z.healthScore - 15, 20);
          return {
            ...z,
            healthScore: newHealth,
            status: newHealth < 50 ? 'critical' : 'warning' as any,
          };
        }
        return z;
      });
      setZones(updatedZones);
      const updatedSelected = updatedZones.find((z) => z.id === selectedZone.id);
      if (updatedSelected) {
        setSelectedZone(updatedSelected);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} zones={zones} />

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Dashboard Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Agricultural Hub Overview</span>
            <h2 className="text-2xl font-bold text-white mt-1">Global Dashboard</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Live Weather Console Widget */}
            <div className="flex items-center gap-4 bg-slate-950/40 border border-slate-900 px-4 py-2.5 rounded-2xl">
              <div className="flex items-center gap-2">
                {weatherCondition === 'sunny' ? (
                  <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
                ) : (
                  <CloudRain className="w-5 h-5 text-sky-400 animate-bounce" />
                )}
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">WEATHER CONSOLE</span>
                  <span className="text-xs font-semibold text-white">
                    {weatherCondition === 'sunny' ? 'Sunny • 28°C' : 'Rain System • 21°C'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={triggerRainEvent}
                disabled={weatherCondition === 'rainy'}
                className={`py-1 px-3 text-[10px] font-semibold font-mono rounded-lg transition-all duration-150 ${
                  weatherCondition === 'rainy'
                    ? 'bg-slate-900 border border-slate-800 text-sky-400 cursor-not-allowed'
                    : 'bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white cursor-pointer'
                }`}
              >
                {weatherCondition === 'rainy' ? 'RAINING...' : 'SIMULATE RAIN'}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Selector rendering */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            
            {/* Left Primary Columns: Map & Charts */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              <FieldHeatmap
                zones={zones}
                selectedZoneId={selectedZone.id}
                onSelectZone={(zone) => setSelectedZone(zone)}
              />
              <TelemetryCharts zone={selectedZone} />
            </div>

            {/* Right Side Control Columns: Scanner & Remediation Planner */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <DiagnosticScanner
                samples={diagnosticSamples}
                onAddRemediationTasks={handleAddRemediationTasks}
              />
              <RemediationPlanner
                tasks={tasks}
                selectedZone={selectedZone}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Advanced Sensors Analytics</h2>
              <p className="text-xs text-slate-400">Detailed crop health parameter indexes across all farm sectors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <div key={zone.id} className="bg-slate-950/20 border border-slate-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{zone.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      zone.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      zone.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {zone.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-900 pt-3">
                    <div className="bg-slate-900/50 rounded-xl p-2.5">
                      <span className="text-[10px] text-slate-500 font-mono block">NDVI GREENNESS</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{zone.ndvi}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2.5">
                      <span className="text-[10px] text-slate-500 font-mono block">SOIL MOISTURE</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{zone.moisture}%</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2.5">
                      <span className="text-[10px] text-slate-500 font-mono block">SOIL TEMP</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{zone.temperature}°C</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2.5">
                      <span className="text-[10px] text-slate-500 font-mono block">HEALTH INDEX</span>
                      <span className="text-sm font-bold text-agri-primary font-mono mt-0.5 block">{zone.healthScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Agronomic Crop Database</h2>
              <p className="text-xs text-slate-400">Baseline thresholds and environmental references</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Crop Name</th>
                    <th className="py-3 px-4">Ideal Moisture</th>
                    <th className="py-3 px-4">Ideal Temp Range</th>
                    <th className="py-3 px-4">Target NDVI</th>
                    <th className="py-3 px-4">Harvest Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-bold text-white">Corn (Zea mays)</td>
                    <td className="py-3.5 px-4">60% – 75%</td>
                    <td className="py-3.5 px-4">22°C – 30°C</td>
                    <td className="py-3.5 px-4">0.75 – 0.88</td>
                    <td className="py-3.5 px-4">120 – 140 Days</td>
                  </tr>
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-bold text-white">Wheat (Triticum aestivum)</td>
                    <td className="py-3.5 px-4">40% – 60%</td>
                    <td className="py-3.5 px-4">15°C – 25°C</td>
                    <td className="py-3.5 px-4">0.65 – 0.80</td>
                    <td className="py-3.5 px-4">110 – 130 Days</td>
                  </tr>
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-bold text-white">Tomato (Solanum lycopersicum)</td>
                    <td className="py-3.5 px-4">50% – 70%</td>
                    <td className="py-3.5 px-4">20°C – 28°C</td>
                    <td className="py-3.5 px-4">0.50 – 0.75</td>
                    <td className="py-3.5 px-4">70 – 85 Days</td>
                  </tr>
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-bold text-white">Potato (Solanum tuberosum)</td>
                    <td className="py-3.5 px-4">65% – 80%</td>
                    <td className="py-3.5 px-4">15°C – 22°C</td>
                    <td className="py-3.5 px-4">0.70 – 0.85</td>
                    <td className="py-3.5 px-4">90 – 120 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
