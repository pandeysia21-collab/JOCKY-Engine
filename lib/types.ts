export interface ProcessTelemetry {
  pid: number;
  ppid: number;
  name: string;
  path: string;
  user: string;
  integrity: 'SYSTEM' | 'HIGH' | 'MEDIUM' | 'LOW' | 'PROTECTED_LIGHT';
  threads: number;
  memoryBase: string;
  memorySize: string;
  status: 'NORMAL' | 'SUSPICIOUS_INJECTION' | 'SUSPICIOUS_EXECUTION' | 'PERSISTENCE_SPAWN' | 'TARGET_MONITORED';
  anomaly: string;
  sha256: string;
  threatLevel: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface NetworkPortTelemetry {
  protocol: 'TCP' | 'UDP';
  localAddress: string;
  localPort: number;
  foreignAddress: string;
  foreignPort: number;
  state: 'LISTENING' | 'ESTABLISHED' | 'ACTIVE' | 'TIME_WAIT' | 'CLOSE_WAIT';
  pid: number;
  processName: string;
  service: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERIFIED_SECURE';
  country: string;
  bytesSent: string;
  bytesRecv: string;
}

export interface RegistryPersistenceTelemetry {
  hive: 'HKLM' | 'HKCU' | 'HKCR';
  keyPath: string;
  valueName: string;
  valueType: string;
  data: string;
  classification: string;
  mitreId: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MEDIUM' | 'LOW';
  lastModified: string;
}

export interface ExtractionEventLog {
  id: string;
  timestamp: string;
  title: string;
  status: string;
  details: string;
  color: 'emerald' | 'amber' | 'rose' | 'cyan' | 'zinc';
  batchId?: string;
}

export interface HostInfo {
  hostname: string;
  os: string;
  kernelBase: string;
  integrityLevel: string;
  activeSession: string;
  sysCallMethod: string;
  driverStatus: string;
}

export interface TelemetryBatch {
  batchId: string;
  engineVersion: string;
  timestamp: string;
  hostInfo: HostInfo;
  statistics: {
    processesAnalyzed: number;
    openSockets: number;
    persistenceKeys: number;
    totalThreats: number;
    extractionLatencyMs: number;
  };
  telemetry: {
    processes: ProcessTelemetry[];
    ports: NetworkPortTelemetry[];
    persistence: RegistryPersistenceTelemetry[];
  };
  logEvent?: {
    title: string;
    status: string;
    details: string;
    color: 'emerald' | 'amber' | 'rose' | 'cyan' | 'zinc';
  };
}
