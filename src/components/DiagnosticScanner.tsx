import React, { useState } from 'react';
import type { DiagnosticSample } from '../types';
import { Scan, RefreshCw, CheckCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface DiagnosticScannerProps {
  samples: DiagnosticSample[];
  onAddRemediationTasks: (diseaseName: string, recommendations: string[]) => void;
}

export const DiagnosticScanner: React.FC<DiagnosticScannerProps> = ({
  samples,
  onAddRemediationTasks,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanResult, setScanResult] = useState<DiagnosticSample | null>(null);
  const [hasAddedTasks, setHasAddedTasks] = useState<boolean>(false);

  const selectedSample = samples.find((s) => s.id === selectedSampleId);

  const handleStartScan = () => {
    if (!selectedSampleId) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    setHasAddedTasks(false);

    // Simulate scanning progress bar
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanResult(selectedSample || null);
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleApplyTasks = () => {
    if (scanResult) {
      onAddRemediationTasks(scanResult.diseaseName, scanResult.recommendations);
      setHasAddedTasks(true);
    }
  };

  return (
    <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Scan className="w-5 h-5 text-agri-primary" />
          <span>AI Crop Disease Diagnostics</span>
        </h2>
        <p className="text-xs text-slate-400">Simulate Leaf analysis using computer vision models</p>
      </div>

      {/* Select Leaf Sample Panel */}
      {!isScanning && !scanResult && (
        <div className="flex flex-col gap-4">
          <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">Select Crop Sample to Analyze</label>
          <div className="grid grid-cols-3 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => setSelectedSampleId(sample.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-200 ${
                  selectedSampleId === sample.id
                    ? 'bg-slate-900 border-agri-primary shadow-lg shadow-agri-primary/5'
                    : 'bg-slate-950/25 border-agri-border hover:bg-slate-900/30'
                }`}
              >
                {/* Simulated Leaf SVG Graphic */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-800 ${sample.visualPattern}`}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-transparent stroke-white/80" strokeWidth="1.5">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10s10-4.5 10-10C22 6.5 17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                    <path d="M12 6c-3.3 0-6 2.7-6 6 0 2 1 3.8 2.6 4.9C9.7 18 10.8 18 12 18s2.3 0 3.4-1.1c1.6-1.1 2.6-2.9 2.6-4.9 0-3.3-2.7-6-6-6z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-white truncate max-w-full">{sample.name}</div>
                  <div className="text-[8px] text-slate-500 font-mono mt-0.5">{sample.cropType}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleStartScan}
            disabled={!selectedSampleId}
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              selectedSampleId
                ? 'bg-agri-primary text-white cursor-pointer hover:bg-agri-secondary hover:shadow-lg hover:shadow-agri-primary/25'
                : 'bg-slate-900 text-slate-600 border border-slate-800/50 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Initiate Health Scan</span>
          </button>
        </div>
      )}

      {/* Scanning Simulator Screen */}
      {isScanning && (
        <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex flex-col items-center justify-center p-6">
          {/* Laser Scanner Line overlay */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-agri-primary to-transparent animate-scan shadow-[0_0_10px_#10b981]"></div>
          
          <div className="flex flex-col items-center gap-4 z-10 text-center">
            {/* Pulsing Leaf Logo */}
            <div className={`w-16 h-16 rounded-full border border-agri-primary/30 flex items-center justify-center ${selectedSample?.visualPattern} animate-pulse-glow-green`}>
              <Scan className="w-8 h-8 text-white/80 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">Analyzing Leaf Tissue</span>
              <span className="text-lg font-bold text-white font-mono">{scanProgress}%</span>
            </div>

            {/* Scanning details stream ticker */}
            <div className="w-48 bg-slate-900 border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-400">
              <div className="animate-pulse">RUNNING MODEL: ResNet-101</div>
              <div className="text-agri-primary mt-0.5">COMPARING PATHOGEN SIGS...</div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Scan Results Display */}
      {scanResult && (
        <div className="flex flex-col gap-5 border border-slate-900 bg-slate-950/20 rounded-2xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Diagnostic Analysis Result</span>
              <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                {scanResult.isHealthy ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
                <span>{scanResult.diseaseName}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">AI Match Confidence</span>
              <span className={`text-xs font-mono font-bold ${scanResult.isHealthy ? 'text-emerald-400' : 'text-agri-primary'}`}>
                {scanResult.confidence}%
              </span>
            </div>
          </div>

          {/* Symptoms List */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Observed Symptoms</span>
            <ul className="flex flex-wrap gap-1.5">
              {scanResult.symptoms.map((symptom, idx) => (
                <li key={idx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-md">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Recommendations */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Recommended Treatments</span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {scanResult.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-agri-primary mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-slate-900 pt-4">
            <button
              onClick={() => {
                setScanResult(null);
                setSelectedSampleId('');
              }}
              className="flex-1 py-2 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Again</span>
            </button>
            
            {!scanResult.isHealthy && (
              <button
                onClick={handleApplyTasks}
                disabled={hasAddedTasks}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  hasAddedTasks
                    ? 'bg-slate-900 border border-slate-800 text-emerald-400 cursor-not-allowed'
                    : 'bg-agri-primary text-white hover:bg-agri-secondary hover:shadow-lg hover:shadow-agri-primary/20 cursor-pointer'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hasAddedTasks ? 'Tasks Synced' : 'Sync to Planner'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
