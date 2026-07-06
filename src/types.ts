export interface TelemetryHistory {
  date: string;
  moisture: number;
  ndvi: number;
}

export interface CropZone {
  id: string;
  name: string;
  cropType: string;
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  ndvi: number;
  moisture: number;
  temperature: number;
  nitrogen: number;      // mg/kg
  phosphorus: number;    // mg/kg
  potassium: number;     // mg/kg
  history: TelemetryHistory[];
}

export interface RemediationTask {
  id: string;
  zoneId: string;
  title: string;
  description: string;
  type: 'watering' | 'fertilizer' | 'treatment';
  status: 'pending' | 'completed';
}

export interface DiagnosticSample {
  id: string;
  name: string;
  cropType: string;
  diseaseName: string;
  confidence: number;
  symptoms: string[];
  recommendations: string[];
  isHealthy: boolean;
  visualPattern: string; // Tailwind gradient class or pattern description
}
