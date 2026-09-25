import { TelemetryBatch, ProcessTelemetry, NetworkPortTelemetry, RegistryPersistenceTelemetry, ExtractionEventLog } from './types';

// Global memory store for Next.js development server
declare global {
  // eslint-disable-next-line no-var
  var __JOCKY_TELEMETRY_STORE__: {
    lastUpdated: string;
    batchCount: number;
    latestBatchId: string;
    processes: ProcessTelemetry[];
    ports: NetworkPortTelemetry[];
    persistence: RegistryPersistenceTelemetry[];
    logs: ExtractionEventLog[];
    listeners: Set<(data: any) => void>;
  } | undefined;
}

const initialProcesses: ProcessTelemetry[] = [
  {
    pid: 8412,
    ppid: 1024,
    name: "svchost.exe",
    path: "C:\\Windows\\System32\\svchost.exe",
    user: "NT AUTHORITY\\SYSTEM",
    integrity: "SYSTEM",
    threads: 34,
    memoryBase: "0x7FF64A100000",
    memorySize: "48.2 MB",
    status: "SUSPICIOUS_INJECTION",
    anomaly: "Reflective DLL injected into unbacked VAD allocation (RWX)",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    threatLevel: "CRITICAL"
  },
  {
    pid: 4920,
    ppid: 8412,
    name: "conhost.exe",
    path: "C:\\Windows\\System32\\conhost.exe",
    user: "NT AUTHORITY\\SYSTEM",
    integrity: "SYSTEM",
    threads: 4,
    memoryBase: "0x7FF7B12C0000",
    memorySize: "8.4 MB",
    status: "NORMAL",
    anomaly: "Standard console host allocation",
    sha256: "8f4e2c65a1098ef7321e1a4980bc9d1f3b0e14a278912e756c4d0a92147f89ab",
    threatLevel: "CLEAN"
  },
  {
    pid: 11304,
    ppid: 3440,
    name: "powershell.exe",
    path: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    user: "CORP\\Administrator",
    integrity: "HIGH",
    threads: 18,
    memoryBase: "0x7FF628B00000",
    memorySize: "112.6 MB",
    status: "SUSPICIOUS_EXECUTION",
    anomaly: "EncodedCommand detected with base64 download cradle (-w hidden -nop)",
    sha256: "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
    threatLevel: "HIGH"
  },
  {
    pid: 6128,
    ppid: 780,
    name: "spoolsv.exe",
    path: "C:\\Windows\\System32\\spoolsv.exe",
    user: "NT AUTHORITY\\SYSTEM",
    integrity: "SYSTEM",
    threads: 22,
    memoryBase: "0x7FF619A00000",
    memorySize: "14.1 MB",
    status: "NORMAL",
    anomaly: "Print Spooler service baseline nominal",
    sha256: "5c92da90a14e9f3b259d3a778e1208fb347c6a99214810eeaf1288c934b12aa3",
    threatLevel: "CLEAN"
  },
  {
    pid: 14088,
    ppid: 11304,
    name: "rundll32.exe",
    path: "C:\\Windows\\SysWOW64\\rundll32.exe",
    user: "CORP\\Administrator",
    integrity: "MEDIUM",
    threads: 8,
    memoryBase: "0x7FF780000000",
    memorySize: "22.5 MB",
    status: "PERSISTENCE_SPAWN",
    anomaly: "Spawned from AppData\\Local\\Temp with ordinal export #1 callback",
    sha256: "a4d3f2824b21919864ea56f217823ab159267104b2a8d323719bbcd201198654",
    threatLevel: "CRITICAL"
  },
  {
    pid: 2044,
    ppid: 688,
    name: "lsass.exe",
    path: "C:\\Windows\\System32\\lsass.exe",
    user: "NT AUTHORITY\\SYSTEM",
    integrity: "PROTECTED_LIGHT",
    threads: 62,
    memoryBase: "0x7FF6D4000000",
    memorySize: "86.0 MB",
    status: "TARGET_MONITORED",
    anomaly: "Process handle requested with PROCESS_VM_READ from PID 8412 (MiniDump hook)",
    sha256: "12984ea0bc1f3089ef48b6289d01247ab1e523cd8201a4e102f92837bc449190",
    threatLevel: "HIGH"
  }
];

const initialPorts: NetworkPortTelemetry[] = [
  {
    protocol: "TCP",
    localAddress: "0.0.0.0",
    localPort: 4444,
    foreignAddress: "194.26.29.112",
    foreignPort: 53530,
    state: "ESTABLISHED",
    pid: 8412,
    processName: "svchost.exe",
    service: "CobaltStrike Beacon / Meterpreter Listener",
    risk: "CRITICAL",
    country: "RO",
    bytesSent: "2,419,008 B",
    bytesRecv: "512,400 B"
  },
  {
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 9050,
    foreignAddress: "0.0.0.0",
    foreignPort: 0,
    state: "LISTENING",
    pid: 14088,
    processName: "rundll32.exe",
    service: "SOCKS5 Proxy / TOR Hidden Gateway",
    risk: "HIGH",
    country: "LOOPBACK",
    bytesSent: "0 B",
    bytesRecv: "0 B"
  },
  {
    protocol: "TCP",
    localAddress: "192.168.1.45",
    localPort: 445,
    foreignAddress: "192.168.1.100",
    foreignPort: 49812,
    state: "ESTABLISHED",
    pid: 4,
    processName: "System",
    service: "SMBv2 Named Pipes / Lateral Movement",
    risk: "MEDIUM",
    country: "LAN",
    bytesSent: "48,190 B",
    bytesRecv: "104,220 B"
  },
  {
    protocol: "TCP",
    localAddress: "0.0.0.0",
    localPort: 3389,
    foreignAddress: "0.0.0.0",
    foreignPort: 0,
    state: "LISTENING",
    pid: 1184,
    processName: "TermService",
    service: "MS-RDP Remote Desktop Protocol",
    risk: "LOW",
    country: "LOCAL",
    bytesSent: "0 B",
    bytesRecv: "0 B"
  },
  {
    protocol: "UDP",
    localAddress: "0.0.0.0",
    localPort: 53,
    foreignAddress: "8.8.8.8",
    foreignPort: 53,
    state: "ACTIVE",
    pid: 11304,
    processName: "powershell.exe",
    service: "DNS Tunneling / TXT Record Exfiltration",
    risk: "HIGH",
    country: "US",
    bytesSent: "692,100 B",
    bytesRecv: "1,440,290 B"
  },
  {
    protocol: "TCP",
    localAddress: "0.0.0.0",
    localPort: 3000,
    foreignAddress: "127.0.0.1",
    foreignPort: 51234,
    state: "LISTENING",
    pid: 23356,
    processName: "jocky_engine_node",
    service: "JOCKY C2 Forensic Telemetry Ingestion API",
    risk: "VERIFIED_SECURE",
    country: "LOCALHOST",
    bytesSent: "12,980 B",
    bytesRecv: "89,120 B"
  }
];

const initialPersistence: RegistryPersistenceTelemetry[] = [
  {
    hive: "HKLM",
    keyPath: "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    valueName: "WindowsSecurityTelemetryHost",
    valueType: "REG_SZ",
    data: "C:\\ProgramData\\WindowsDiagnostics\\telemetry_agent.exe --silent --kernel-hook",
    classification: "MALICIOUS_PERSISTENCE",
    mitreId: "T1547.001",
    severity: "CRITICAL",
    lastModified: "2026-09-25 15:42:10 UTC"
  },
  {
    hive: "HKCU",
    keyPath: "Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
    valueName: "DriverUpdaterStaging",
    valueType: "REG_EXPAND_SZ",
    data: "%APPDATA%\\Local\\Temp\\update_stage.bat",
    classification: "SUSPICIOUS_PAYLOAD",
    mitreId: "T1547.001",
    severity: "HIGH",
    lastModified: "2026-09-25 16:01:44 UTC"
  },
  {
    hive: "HKLM",
    keyPath: "SYSTEM\\CurrentControlSet\\Services\\JockyFilterDriver",
    valueName: "ImagePath",
    valueType: "REG_EXPAND_SZ",
    data: "\\??\\C:\\Windows\\System32\\drivers\\jocky_filt.sys",
    classification: "KERNEL_DRIVER_FILTER",
    mitreId: "T1543.003",
    severity: "ELEVATED",
    lastModified: "2026-09-25 14:12:00 UTC"
  },
  {
    hive: "HKLM",
    keyPath: "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\sethc.exe",
    valueName: "Debugger",
    valueType: "REG_SZ",
    data: "C:\\Windows\\System32\\cmd.exe",
    classification: "STICKY_KEYS_BACKDOOR",
    mitreId: "T1546.008",
    severity: "CRITICAL",
    lastModified: "2026-09-25 15:19:33 UTC"
  },
  {
    hive: "HKLM",
    keyPath: "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon",
    valueName: "Userinit",
    valueType: "REG_SZ",
    data: "C:\\Windows\\System32\\userinit.exe,C:\\Windows\\System32\\rundll32.exe mssec.dll,Init",
    classification: "WINLOGON_HIJACK",
    mitreId: "T1547.004",
    severity: "CRITICAL",
    lastModified: "2026-09-25 15:22:15 UTC"
  },
  {
    hive: "HKCU",
    keyPath: "Environment",
    valueName: "COR_PROFILER",
    valueType: "REG_SZ",
    data: "{32E2F4DA-1B54-460E-88D6-74B53643B5BC}",
    classification: "CLR_PROFILER_INJECTION",
    mitreId: "T1574.012",
    severity: "HIGH",
    lastModified: "2026-09-25 15:58:02 UTC"
  }
];

const initialLogs: ExtractionEventLog[] = [
  {
    id: "LOG-INIT-001",
    timestamp: new Date().toISOString(),
    title: "JOCKY Engine Kernel Telemetry Ingestion Daemon Initialized",
    status: "STANDBY_ACTIVE",
    details: "Listening on HTTP POST /api/telemetry for low-level forensic extractions.",
    color: "emerald"
  },
  {
    id: "LOG-INIT-002",
    timestamp: new Date().toISOString(),
    title: "Kernel Syscall Direct Stub Interceptor Armed",
    status: "ONLINE",
    details: "Halos Gate SSN cache verified. Ring-3 user mode hooks bypassed.",
    color: "cyan"
  }
];

if (!global.__JOCKY_TELEMETRY_STORE__) {
  global.__JOCKY_TELEMETRY_STORE__ = {
    lastUpdated: new Date().toISOString(),
    batchCount: 1,
    latestBatchId: "JOCKY-INIT-BASELINE",
    processes: initialProcesses,
    ports: initialPorts,
    persistence: initialPersistence,
    logs: initialLogs,
    listeners: new Set()
  };
}

export const telemetryStore = global.__JOCKY_TELEMETRY_STORE__;

export function addTelemetryBatch(batch: TelemetryBatch) {
  telemetryStore.lastUpdated = batch.timestamp || new Date().toISOString();
  telemetryStore.batchCount += 1;
  telemetryStore.latestBatchId = batch.batchId;

  if (batch.telemetry) {
    if (batch.telemetry.processes && batch.telemetry.processes.length > 0) {
      telemetryStore.processes = batch.telemetry.processes;
    }
    if (batch.telemetry.ports && batch.telemetry.ports.length > 0) {
      telemetryStore.ports = batch.telemetry.ports;
    }
    if (batch.telemetry.persistence && batch.telemetry.persistence.length > 0) {
      telemetryStore.persistence = batch.telemetry.persistence;
    }
  }

  const logEvent: ExtractionEventLog = {
    id: `EVT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: batch.logEvent?.title || `Batch Ingested [${batch.batchId}]`,
    status: batch.logEvent?.status || "INGESTED_OK",
    details: batch.logEvent?.details || `Received payload from ${batch.hostInfo?.hostname || 'Remote Host'}`,
    color: (batch.logEvent?.color as any) || "emerald",
    batchId: batch.batchId
  };

  telemetryStore.logs.unshift(logEvent);
  if (telemetryStore.logs.length > 50) {
    telemetryStore.logs = telemetryStore.logs.slice(0, 50);
  }

  // Notify listeners (SSE streams)
  const currentSnapshot = getTelemetrySnapshot();
  telemetryStore.listeners.forEach((listener) => {
    try {
      listener(currentSnapshot);
    } catch (e) {
      // Listener disconnected
    }
  });

  return currentSnapshot;
}

export function getTelemetrySnapshot() {
  return {
    lastUpdated: telemetryStore.lastUpdated,
    batchCount: telemetryStore.batchCount,
    latestBatchId: telemetryStore.latestBatchId,
    processes: telemetryStore.processes,
    ports: telemetryStore.ports,
    persistence: telemetryStore.persistence,
    logs: telemetryStore.logs,
  };
}

export function subscribeTelemetry(listener: (data: any) => void) {
  telemetryStore.listeners.add(listener);
  return () => {
    telemetryStore.listeners.delete(listener);
  };
}
