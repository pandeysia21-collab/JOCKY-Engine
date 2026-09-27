'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ClassifiedHeader } from '@/components/ClassifiedHeader';
import { StatsOverview } from '@/components/StatsOverview';
import { TelemetryTables } from '@/components/TelemetryTables';
import { 
  ProcessTelemetry, 
  NetworkPortTelemetry, 
  RegistryPersistenceTelemetry, 
  ExtractionEventLog,
  TelemetryBatch 
} from '@/lib/types';
import { Terminal, Shield, Play, ArrowRight, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [processes, setProcesses] = useState<ProcessTelemetry[]>([]);
  const [ports, setPorts] = useState<NetworkPortTelemetry[]>([]);
  const [persistence, setPersistence] = useState<RegistryPersistenceTelemetry[]>([]);
  const [logs, setLogs] = useState<ExtractionEventLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [batchCount, setBatchCount] = useState<number>(0);
  const [latestBatchId, setLatestBatchId] = useState<string>('INITIALIZING...');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [latestPayloadJson, setLatestPayloadJson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flashNewData, setFlashNewData] = useState<boolean>(false);

  // Apply new snapshot into state
  const applySnapshot = useCallback((data: any) => {
    if (!data) return;
    if (data.processes) setProcesses(data.processes);
    if (data.ports) setPorts(data.ports);
    if (data.persistence) setPersistence(data.persistence);
    if (data.logs) setLogs(data.logs);
    if (data.lastUpdated) setLastUpdated(data.lastUpdated);
    if (data.batchCount !== undefined) setBatchCount(data.batchCount);
    if (data.latestBatchId) setLatestBatchId(data.latestBatchId);
    setLatestPayloadJson(data);

    // Visual ping flash
    setFlashNewData(true);
    setTimeout(() => setFlashNewData(false), 800);
  }, []);

  // Fetch initial telemetry via GET
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/telemetry', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          applySnapshot(json.data);
        }
      }
    } catch (e) {
      console.error('[Dashboard] Error fetching telemetry:', e);
    }
  }, [applySnapshot]);

  // Establish SSE connection for zero-refresh real-time push
  useEffect(() => {
    fetchTelemetry();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/telemetry/stream');
      eventSource.onopen = () => {
        setIsStreaming(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          applySnapshot(data);
        } catch (err) {
          // ignore keepalive pings
        }
      };
      eventSource.onerror = () => {
        setIsStreaming(false);
      };
    } catch (e) {
      setIsStreaming(false);
    }

    // Fallback polling interval every 2.5 seconds
    const pollInterval = setInterval(() => {
      fetchTelemetry();
    }, 2500);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
    };
  }, [fetchTelemetry, applySnapshot]);

  // Trigger test burst directly from UI (calls POST /api/telemetry)
  const handleTriggerTestBurst = async () => {
    setIsLoading(true);
    try {
      const randomPid = Math.floor(1000 + Math.random() * 9000);
      const randomPort = Math.floor(1024 + Math.random() * 60000);
      const randomBatch = `JOCKY-UI-0x${Math.floor(0x100000 + Math.random() * 0xEFFFFF).toString(16).toUpperCase()}`;

      const testPayload: TelemetryBatch = {
        batchId: randomBatch,
        engineVersion: '4.9.2-UI-BURST',
        timestamp: new Date().toISOString(),
        hostInfo: {
          hostname: 'SEC-OPS-FORENSIC-01',
          os: 'Windows 11 Pro Enterprise x64 [Build 22631.3880]',
          kernelBase: '0xFFFFF80436A00000',
          integrityLevel: 'SYSTEM',
          activeSession: 'CONSOLE-0',
          sysCallMethod: 'DIRECT_ZW_STUBS',
          driverStatus: 'BURST_CAPTURE'
        },
        statistics: {
          processesAnalyzed: 6,
          openSockets: 6,
          persistenceKeys: 6,
          totalThreats: 5,
          extractionLatencyMs: 980
        },
        telemetry: {
          processes: [
            {
              pid: randomPid,
              ppid: 1024,
              name: "winlogon_worker.exe",
              path: "C:\\Windows\\Temp\\winlogon_worker.exe",
              user: "NT AUTHORITY\\SYSTEM",
              integrity: "SYSTEM",
              threads: 12,
              memoryBase: `0x7FF${Math.floor(100000000 + Math.random() * 900000000).toString(16).toUpperCase()}`,
              memorySize: "32.4 MB",
              status: "SUSPICIOUS_INJECTION",
              anomaly: "Thread APC queued with hijacked RIP pointer to shellcode buffer",
              sha256: "8b7d901f4c2e6b7a1098ef7321e1a4980bc9d1f3b0e14a278912e756c4d0a921",
              threatLevel: "CRITICAL"
            },
            ...processes.slice(1)
          ],
          ports: [
            {
              protocol: "TCP",
              localAddress: "0.0.0.0",
              localPort: randomPort,
              foreignAddress: "45.142.214.88",
              foreignPort: 443,
              state: "ESTABLISHED",
              pid: randomPid,
              processName: "winlogon_worker.exe",
              service: "C2 Exfiltration Beacon / TLS Staged",
              risk: "CRITICAL",
              country: "NL",
              bytesSent: "1,840,112 B",
              bytesRecv: "320,100 B"
            },
            ...ports.slice(1)
          ],
          persistence: [
            {
              hive: "HKLM",
              keyPath: "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\notepad.exe",
              valueName: "MonitorProcess",
              valueType: "REG_SZ",
              data: "C:\\ProgramData\\Diagnostics\\agent.exe",
              classification: "SILENT_PROCESS_EXIT_MONITOR",
              mitreId: "T1546.012",
              severity: "HIGH",
              lastModified: new Date().toISOString()
            },
            ...persistence.slice(1)
          ]
        },
        logEvent: {
          title: `Direct Syscall Forensic Burst Captured [${randomBatch}]`,
          status: "EXTRACTION_SUCCESS",
          details: `Manual forensic extraction triggered. Telemetry ingested into memory cache without page reload.`,
          color: "emerald"
        }
      };

      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
    } catch (e) {
      console.error('[Dashboard] Error sending burst:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative z-10 bg-radial-vignette min-h-screen">
      {/* Visual Flash Banner upon Incoming Packet */}
      {flashNewData && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-emerald-400 glow-emerald-subtle z-50 transition-all duration-300 animate-pulse" />
      )}

      {/* Classified Header */}
      <ClassifiedHeader
        lastUpdated={lastUpdated}
        batchCount={batchCount}
        latestBatchId={latestBatchId}
        isStreaming={isStreaming}
        onTriggerTestBurst={handleTriggerTestBurst}
        isLoading={isLoading}
      />

      {/* Main Forensic Dashboard Body */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col space-y-6">
        
        {/* System Status Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-0">
          <div className="p-3 bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800 rounded-lg shadow-sm dark:shadow-md transition-colors duration-300">
            <div className="text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">Telemetry</div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Online</span>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800 rounded-lg shadow-sm dark:shadow-md transition-colors duration-300">
            <div className="text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">API</div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Connected</span>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800 rounded-lg shadow-sm dark:shadow-md transition-colors duration-300">
            <div className="text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">Extraction Agent</div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">Ready</span>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800 rounded-lg shadow-sm dark:shadow-md transition-colors duration-300">
            <div className="text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">Last Ingestion</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono tracking-wider">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats & Key Performance Indicators */}
        <StatsOverview
          processes={processes}
          ports={ports}
          persistence={persistence}
          batchCount={batchCount}
        />

        {/* Central Telemetry Tables (Processes, Ports, Persistence, Logs, JSON) */}
        <TelemetryTables
          processes={processes}
          ports={ports}
          persistence={persistence}
          logs={logs}
          latestPayloadJson={latestPayloadJson}
        />

        {/* Terminal Quick Execution Guide for Video Demonstration */}
        <div className="bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800 rounded-lg p-4 font-mono text-base text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-md transition-colors duration-300">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center space-x-3 text-zinc-800 dark:text-zinc-200 font-semibold text-lg">
              <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>TERMINAL DEMONSTRATION RUNBOOK // PART B COMMAND LINE AGENT</span>
            </div>
            <span className="text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">MSVC x64 CUI SIMULATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-4 bg-zinc-50 dark:bg-[#080a0f] rounded-md border border-zinc-200 dark:border-slate-800 text-sm space-y-2 transition-colors">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-base">
                <span>Step 1: Execute Python Forensic Extractor</span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-200 bg-white dark:bg-[#0e1118] p-3 rounded-md border border-zinc-200 dark:border-slate-800 select-all font-mono text-base transition-colors">
                python jocky_extractor.py
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Runs with realistic 1-second delays between syscall resolution, unhooking, hive dumps, and sends HTTP POST to <code className="text-emerald-600 dark:text-emerald-400 font-mono">/api/telemetry</code>.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-[#080a0f] rounded-md border border-zinc-200 dark:border-slate-800 text-sm space-y-2 transition-colors">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-base">
                Step 2: Real-Time Dynamic Ingestion
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 font-sans text-base leading-relaxed">
                Observe the central telemetry table above updating <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">dynamically without reloading the page</strong> when the Python script dispatches its forensic payload!
              </p>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 font-mono pt-1">
                Endpoint: <span className="text-zinc-800 dark:text-zinc-200">http://localhost:3000/api/telemetry</span> [POST]
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Classification Bar */}
      <footer className="border-t border-zinc-200 dark:border-slate-800/80 bg-zinc-100 dark:bg-[#07090e] px-4 py-4 text-center text-sm text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase transition-colors duration-300">
        RESTRICTED FORENSIC SYSTEM // JOCKY ENGINE // DO NOT DISTRIBUTE // DISPATCH AUTHORIZED ONLY
      </footer>
    </div>
  );
}
