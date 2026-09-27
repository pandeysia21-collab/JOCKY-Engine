'use client';

import React, { useState } from 'react';
import { 
  ProcessTelemetry, 
  NetworkPortTelemetry, 
  RegistryPersistenceTelemetry, 
  ExtractionEventLog 
} from '@/lib/types';
import { 
  Search, 
  Cpu, 
  Network, 
  Database, 
  FileTerminal, 
  Code, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check,
  Shield
} from 'lucide-react';

interface TelemetryTablesProps {
  processes: ProcessTelemetry[];
  ports: NetworkPortTelemetry[];
  persistence: RegistryPersistenceTelemetry[];
  logs: ExtractionEventLog[];
  latestPayloadJson?: any;
}

const ModeBadge = ({ mode = "SIMULATED" }: { mode?: string }) => {
  if (mode === "REAL") {
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600/40">REAL</span>;
  }
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-slate-600">SIMULATED</span>;
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const normalized = severity.toUpperCase();
  if (normalized === 'CRITICAL') return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-600/50 dark:glow-rose-badge"><AlertTriangle className="w-3 h-3"/> CRITICAL</span>;
  if (normalized === 'HIGH') return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600/50"><AlertTriangle className="w-3 h-3"/> HIGH</span>;
  if (normalized === 'MEDIUM') return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600/50">MEDIUM</span>;
  if (normalized === 'LOW') return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600/50">LOW</span>;
  
  return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600/40 dark:glow-emerald-badge"><CheckCircle2 className="w-3 h-3"/> {normalized === 'CLEAN' || normalized === 'VERIFIED_SECURE' || normalized === 'NORMAL' ? 'NORMAL' : normalized}</span>;
};

export function TelemetryTables({
  processes,
  ports,
  persistence,
  logs,
  latestPayloadJson
}: TelemetryTablesProps) {
  const [activeTab, setActiveTab] = useState<'processes' | 'ports' | 'persistence' | 'logs' | 'json'>('processes');
  const [searchQuery, setSearchQuery] = useState('');
  const [threatFilter, setThreatFilter] = useState<'ALL' | 'THREATS_ONLY'>('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pid.toString().includes(searchQuery) ||
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.anomaly.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (threatFilter === 'THREATS_ONLY') {
      return matchesSearch && (p.threatLevel === 'CRITICAL' || p.threatLevel === 'HIGH');
    }
    return matchesSearch;
  });

  const filteredPorts = ports.filter(port => {
    const matchesSearch = 
      port.localPort.toString().includes(searchQuery) ||
      port.foreignAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (threatFilter === 'THREATS_ONLY') {
      return matchesSearch && (port.risk === 'CRITICAL' || port.risk === 'HIGH');
    }
    return matchesSearch;
  });

  const filteredPersistence = persistence.filter(k => {
    const matchesSearch = 
      k.keyPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.valueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.classification.toLowerCase().includes(searchQuery.toLowerCase());

    if (threatFilter === 'THREATS_ONLY') {
      return matchesSearch && (k.severity === 'CRITICAL' || k.severity === 'HIGH');
    }
    return matchesSearch;
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(latestPayloadJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const hasTelemetry = processes.length > 0 || ports.length > 0 || persistence.length > 0;

  return (
    <div className="bg-white dark:bg-[#0b0e14]/90 border border-zinc-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-300">
      <div className="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-[#07090e] px-4 py-3 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('processes')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'processes'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 dark:glow-emerald-subtle'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Cpu className={`w-3.5 h-3.5 ${activeTab === 'processes' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Process IDs</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] border ${activeTab === 'processes' ? 'bg-emerald-100 dark:bg-slate-900 border-emerald-300 dark:border-slate-800' : 'bg-zinc-200 dark:bg-slate-900 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-slate-800'}`}>
              {processes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ports')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'ports'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 dark:glow-emerald-subtle'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Network className={`w-3.5 h-3.5 ${activeTab === 'ports' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Open Network Ports</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] border ${activeTab === 'ports' ? 'bg-emerald-100 dark:bg-slate-900 border-emerald-300 dark:border-slate-800' : 'bg-zinc-200 dark:bg-slate-900 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-slate-800'}`}>
              {ports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('persistence')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'persistence'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 dark:glow-emerald-subtle'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Database className={`w-3.5 h-3.5 ${activeTab === 'persistence' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Registry Persistence</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] border ${activeTab === 'persistence' ? 'bg-emerald-100 dark:bg-slate-900 border-emerald-300 dark:border-slate-800' : 'bg-zinc-200 dark:bg-slate-900 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-slate-800'}`}>
              {persistence.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 dark:glow-emerald-subtle'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <FileTerminal className={`w-3.5 h-3.5 ${activeTab === 'logs' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Terminal Logs</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] border ${activeTab === 'logs' ? 'bg-emerald-100 dark:bg-slate-900 border-emerald-300 dark:border-slate-800' : 'bg-zinc-200 dark:bg-slate-900 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-slate-800'}`}>
              {logs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 dark:glow-emerald-subtle'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Code className={`w-3.5 h-3.5 ${activeTab === 'json' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Raw JSON Stream</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold mr-2">
            {hasTelemetry ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 uppercase">Live Telemetry</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                <span className="text-zinc-500 dark:text-zinc-400 uppercase">Waiting for Telemetry</span>
              </>
            )}
          </div>
          
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#090b10] border border-zinc-200 dark:border-slate-800 rounded-md text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
            />
          </div>

          <button
            onClick={() => setThreatFilter(f => f === 'ALL' ? 'THREATS_ONLY' : 'ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              threatFilter === 'THREATS_ONLY'
                ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-600/60 shadow-sm'
                : 'bg-white dark:bg-[#090b10] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-slate-800 hover:bg-zinc-50 dark:hover:border-slate-700 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className={`w-3 h-3 ${threatFilter === 'THREATS_ONLY' ? 'text-rose-600 dark:text-rose-400' : ''}`} />
            <span>{threatFilter === 'THREATS_ONLY' ? 'Threats Only' : 'All Severities'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[440px]">
        {activeTab === 'processes' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-[#090b10] text-zinc-600 dark:text-zinc-400 font-semibold tracking-wider uppercase text-[11px] transition-colors">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Process Name</th>
                <th className="py-3 px-4">Integrity Level</th>
                <th className="py-3 px-4">Memory Address</th>
                <th className="py-3 px-4">Extraction Status</th>
                <th className="py-3 px-4">Threat Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/60 font-mono transition-colors">
              {filteredProcesses.map((proc) => {
                const isExpanded = expandedRow === `proc-${proc.pid}`;

                return (
                  <React.Fragment key={proc.pid}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : `proc-${proc.pid}`)}
                      className={`hover:bg-zinc-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors duration-150 ${
                        isExpanded ? 'bg-zinc-100 dark:bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-500">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-[#080a0f] px-2.5 py-1 rounded border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
                            {proc.pid}
                          </span>
                          <ModeBadge />
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate" title={proc.name}>{proc.name}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate font-mono" title={proc.path}>{proc.path}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          proc.integrity === 'SYSTEM'
                            ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800/40'
                            : proc.integrity === 'HIGH'
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/40'
                            : proc.integrity === 'PROTECTED_LIGHT'
                            ? 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800/40'
                            : 'bg-zinc-200 dark:bg-slate-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-slate-700/60'
                        }`}>
                          {proc.integrity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">{proc.memoryBase}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] ml-2 font-sans">({proc.memorySize})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            proc.status === 'NORMAL' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-rose-500 dark:bg-rose-400 animate-pulse'
                          }`} />
                          <span className={`text-[11px] font-sans ${
                            proc.status === 'NORMAL' ? 'text-zinc-600 dark:text-zinc-300' : 'text-rose-600 dark:text-rose-400 font-semibold'
                          }`}>
                            {proc.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <SeverityBadge severity={proc.threatLevel} />
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-zinc-50/50 dark:bg-[#090b11] border-b border-zinc-200 dark:border-slate-800 transition-colors">
                        <td colSpan={7} className="p-4 pl-12 text-zinc-700 dark:text-zinc-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-200 dark:border-slate-800/80 rounded-lg bg-white dark:bg-[#0e1118]/70 p-4 shadow-sm dark:shadow-inner transition-colors">
                            <div>
                              <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                                <span>Anomaly Signature & Forensic Detection</span>
                              </div>
                              <p className="text-xs text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-md border border-rose-200 dark:border-rose-900/40 font-mono leading-relaxed transition-colors">
                                {proc.anomaly}
                              </p>
                              <div className="mt-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-wrap gap-x-4 gap-y-1 font-sans">
                                <span><strong className="text-zinc-800 dark:text-zinc-300">Parent PID:</strong> {proc.ppid}</span>
                                <span><strong className="text-zinc-800 dark:text-zinc-300">Threads:</strong> {proc.threads}</span>
                                <span><strong className="text-zinc-800 dark:text-zinc-300">Security Context:</strong> {proc.user}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Memory & Hash Verification</span>
                              </div>
                              <div className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-[#07090e] p-2.5 rounded-md border border-zinc-200 dark:border-slate-800/80 break-all leading-relaxed transition-colors">
                                <span className="text-zinc-500 block text-[10px] mb-1 font-sans">SHA256 CHECKSUM:</span>
                                <span className="text-emerald-700 dark:text-emerald-400">{proc.sha256}</span>
                              </div>
                              <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
                                <span>VAD Protection: <span className="text-zinc-800 dark:text-zinc-200 font-mono">PAGE_EXECUTE_READWRITE</span></span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  Direct Syscall Unhooked
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === 'ports' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-[#090b10] text-zinc-600 dark:text-zinc-400 font-semibold tracking-wider uppercase text-[11px] transition-colors">
                <th className="py-3 px-4">Proto</th>
                <th className="py-3 px-4">Local Address:Port</th>
                <th className="py-3 px-4">Foreign Target</th>
                <th className="py-3 px-4">Associated PID</th>
                <th className="py-3 px-4">Socket State</th>
                <th className="py-3 px-4">Service & Payload Analysis</th>
                <th className="py-3 px-4">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/60 font-mono transition-colors">
              {filteredPorts.map((port, idx) => {
                const isSuspicious = port.risk === 'CRITICAL' || port.risk === 'HIGH';
                return (
                  <tr key={`${port.localPort}-${idx}`} className={`hover:bg-zinc-50 dark:hover:bg-slate-800/30 transition-colors duration-150 ${isSuspicious ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''}`}>
                    <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="bg-zinc-100 dark:bg-[#080a0f] px-2 py-0.5 rounded border border-zinc-200 dark:border-slate-800 transition-colors">
                        {port.protocol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">{port.localAddress}:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{port.localPort}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-zinc-800 dark:text-zinc-200 font-medium">{port.foreignAddress}:{port.foreignPort}</div>
                      <span className="text-[10px] text-zinc-500 font-sans">Loc: {port.country}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-sans">{port.processName}</div>
                      <div className="text-[10px] text-zinc-500 flex items-center gap-2">PID: {port.pid} <ModeBadge /></div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        port.state === 'ESTABLISHED'
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/40'
                          : port.state === 'LISTENING'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/40'
                          : 'bg-zinc-200 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-slate-700'
                      }`}>
                        {port.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="text-zinc-800 dark:text-zinc-200 font-semibold">{port.service}</div>
                      <div className="text-[10px] text-zinc-500">TX: {port.bytesSent} | RX: {port.bytesRecv}</div>
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={port.risk} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === 'persistence' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-[#090b10] text-zinc-600 dark:text-zinc-400 font-semibold tracking-wider uppercase text-[11px] transition-colors">
                <th className="py-3 px-4">Hive</th>
                <th className="py-3 px-4">Registry Path</th>
                <th className="py-3 px-4">Value Name</th>
                <th className="py-3 px-4">Injected Payload / Data</th>
                <th className="py-3 px-4">MITRE Technique</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/60 font-mono transition-colors">
              {filteredPersistence.map((item, idx) => (
                <tr key={`${item.keyPath}-${idx}`} className="hover:bg-zinc-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="bg-zinc-100 dark:bg-[#080a0f] px-2 py-0.5 rounded border border-zinc-200 dark:border-slate-800 transition-colors">
                      {item.hive}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate" title={item.keyPath}>{item.keyPath}</div>
                    <div className="text-[10px] text-zinc-500 font-sans">{item.classification}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]" title={item.valueName}>
                    {item.valueName}
                    <div className="text-[10px] font-normal text-zinc-500 font-sans">{item.valueType}</div>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-[#080a0f] p-1.5 rounded border border-zinc-200 dark:border-slate-800/80 truncate font-mono text-[11px] transition-colors" title={item.data}>
                      {item.data}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-slate-800 font-mono text-[11px] transition-colors">
                      {item.mitreId}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <SeverityBadge severity={item.severity} />
                    <ModeBadge />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'logs' && (
          <div className="p-4 bg-zinc-50 dark:bg-[#080a0f] font-mono text-xs space-y-2 transition-colors duration-300 h-full min-h-[440px]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-slate-800 text-[11px] text-zinc-500 dark:text-zinc-400 transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">TERMINAL AUDIT BUFFER [DIRECT SYSCALL EMISSION]</span>
              </span>
              <span>{logs.length} EVENTS RECORDED</span>
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-md bg-white dark:bg-[#0e1118]/80 border border-zinc-200 dark:border-slate-800/80 flex items-start gap-3 hover:border-zinc-300 dark:hover:border-slate-700/80 transition-colors shadow-sm dark:shadow-none"
                >
                  <span className="text-zinc-500 text-[10px] whitespace-nowrap mt-0.5 font-sans">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    log.color === 'emerald'
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/40'
                      : log.color === 'cyan'
                      ? 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-600/40'
                      : log.color === 'rose'
                      ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-600/40'
                      : 'bg-zinc-200 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-slate-700'
                  }`}>
                    {log.status}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">{log.title}</div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5 font-sans">{log.details}</div>
                  </div>
                  {log.batchId && (
                    <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 dark:bg-[#080a0f] px-2 py-0.5 rounded border border-zinc-200 dark:border-slate-800 transition-colors">
                      {log.batchId}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="p-4 bg-zinc-50 dark:bg-[#080a0f] font-mono text-xs transition-colors duration-300 h-full min-h-[440px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-slate-800 transition-colors">
              <span className="text-zinc-500 dark:text-zinc-400 text-xs font-sans">
                Active Telemetry Payload (Dispatched by Python Extractor via HTTP POST /api/telemetry)
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-slate-700 text-xs transition-colors shadow-sm dark:shadow-none"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-sans font-semibold">{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute top-2 right-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest">LIVE STREAM</span>
              </div>
              
              <pre className="p-4 rounded-md bg-white dark:bg-[#0a0d14] border border-zinc-200 dark:border-slate-800 text-zinc-800 dark:text-emerald-400/90 overflow-x-auto text-[11px] leading-relaxed max-h-[400px] shadow-sm dark:shadow-none transition-colors">
                {JSON.stringify(latestPayloadJson || { notice: "Waiting for telemetry batch..." }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-slate-800 bg-zinc-100 dark:bg-[#07090e] px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2 transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>DIRECT KERNEL EXTRACTION ENGINE</span>
          </span>
          <span className="text-zinc-300 dark:text-slate-700">•</span>
          <span className="font-sans">API ENDPOINT: <span className="text-zinc-700 dark:text-zinc-300 font-mono bg-white dark:bg-transparent px-1.5 py-0.5 rounded border border-zinc-200 dark:border-transparent">POST /api/telemetry</span></span>
        </div>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm font-sans">
          Showing <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base font-mono">{
            activeTab === 'processes' ? filteredProcesses.length :
            activeTab === 'ports' ? filteredPorts.length :
            activeTab === 'persistence' ? filteredPersistence.length : logs.length
          }</span> forensic records
        </div>
      </div>
    </div>
  );
}
