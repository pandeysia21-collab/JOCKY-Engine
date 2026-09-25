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
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface TelemetryTablesProps {
  processes: ProcessTelemetry[];
  ports: NetworkPortTelemetry[];
  persistence: RegistryPersistenceTelemetry[];
  logs: ExtractionEventLog[];
  latestPayloadJson?: any;
}

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

  // Filter processes
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

  // Filter ports
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

  // Filter persistence
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

  return (
    <div className="bg-[#0b0e14]/90 border border-slate-800 rounded-lg overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Central Navigation & Filters Header */}
      <div className="border-b border-slate-800 bg-[#07090e] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Tab Selection */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-processes"
            onClick={() => setActiveTab('processes')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'processes'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 glow-emerald-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Process IDs</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-zinc-300 border border-slate-800">
              {processes.length}
            </span>
          </button>

          <button
            id="tab-ports"
            onClick={() => setActiveTab('ports')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'ports'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 glow-emerald-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Network Ports</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-zinc-300 border border-slate-800">
              {ports.length}
            </span>
          </button>

          <button
            id="tab-persistence"
            onClick={() => setActiveTab('persistence')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'persistence'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 glow-emerald-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Registry Persistence</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-zinc-300 border border-slate-800">
              {persistence.length}
            </span>
          </button>

          <button
            id="tab-logs"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 glow-emerald-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <FileTerminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal Logs</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-zinc-300 border border-slate-800">
              {logs.length}
            </span>
          </button>

          <button
            id="tab-json"
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 glow-emerald-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Raw JSON Stream</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter telemetry artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#090b10] border border-slate-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
            />
          </div>

          <button
            onClick={() => setThreatFilter(f => f === 'ALL' ? 'THREATS_ONLY' : 'ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              threatFilter === 'THREATS_ONLY'
                ? 'bg-rose-950/40 text-rose-300 border-rose-600/60 shadow-sm'
                : 'bg-[#090b10] text-zinc-400 border-slate-800 hover:border-slate-700 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>{threatFilter === 'THREATS_ONLY' ? 'Threats Only' : 'All Severities'}</span>
          </button>
        </div>
      </div>

      {/* Main Table Content Areas */}
      <div className="overflow-x-auto min-h-[440px]">
        {/* TAB 1: PROCESS IDS TABLE */}
        {activeTab === 'processes' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090b10] text-zinc-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Process Name</th>
                <th className="py-3 px-4">Integrity Level</th>
                <th className="py-3 px-4">Memory Address</th>
                <th className="py-3 px-4">Extraction Status</th>
                <th className="py-3 px-4">Threat Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredProcesses.map((proc) => {
                const isExpanded = expandedRow === `proc-${proc.pid}`;
                const isCritical = proc.threatLevel === 'CRITICAL';
                const isHigh = proc.threatLevel === 'HIGH';
                const isClean = proc.threatLevel === 'CLEAN';

                return (
                  <React.Fragment key={proc.pid}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : `proc-${proc.pid}`)}
                      className={`hover:bg-slate-800/30 cursor-pointer transition-colors duration-150 ${
                        isExpanded ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-zinc-500">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-100 bg-[#080a0f] px-2.5 py-1 rounded border border-slate-800 shadow-sm">
                          {proc.pid}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-100">{proc.name}</div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-xs">{proc.path}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          proc.integrity === 'SYSTEM'
                            ? 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                            : proc.integrity === 'HIGH'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                            : proc.integrity === 'PROTECTED_LIGHT'
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40'
                            : 'bg-slate-800/60 text-zinc-300 border-slate-700/60'
                        }`}>
                          {proc.integrity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-mono text-[11px] font-medium">{proc.memoryBase}</span>
                        <span className="text-zinc-500 text-[10px] ml-2">({proc.memorySize})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            proc.status === 'NORMAL' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                          }`} />
                          <span className={`text-[11px] ${
                            proc.status === 'NORMAL' ? 'text-zinc-300' : 'text-rose-400 font-semibold'
                          }`}>
                            {proc.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5 ${
                          isCritical
                            ? 'bg-rose-950/40 text-rose-300 border-rose-600/50 glow-rose-badge'
                            : isHigh
                            ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 glow-amber-badge'
                            : 'bg-emerald-950/40 text-emerald-400 border-emerald-600/40 glow-emerald-badge'
                        }`}>
                          {isCritical && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                          {isClean && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {proc.threatLevel}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Deep Inspection Panel */}
                    {isExpanded && (
                      <tr className="bg-[#090b11] border-b border-slate-800">
                        <td colSpan={7} className="p-4 pl-12 text-zinc-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-800/80 rounded-lg bg-[#0e1118]/70 p-4 shadow-inner">
                            <div>
                              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Anomaly Signature & Forensic Detection</span>
                              </div>
                              <p className="text-xs text-rose-200 bg-rose-950/30 p-2.5 rounded-md border border-rose-900/40 font-mono leading-relaxed">
                                {proc.anomaly}
                              </p>
                              <div className="mt-2.5 text-[11px] text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                                <span><strong className="text-zinc-300">Parent PID:</strong> {proc.ppid}</span>
                                <span><strong className="text-zinc-300">Threads:</strong> {proc.threads}</span>
                                <span><strong className="text-zinc-300">Security Context:</strong> {proc.user}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Memory & Hash Verification</span>
                              </div>
                              <div className="text-[11px] font-mono text-zinc-300 bg-[#07090e] p-2.5 rounded-md border border-slate-800/80 break-all leading-relaxed">
                                <span className="text-zinc-500 block text-[10px]">SHA256 CHECKSUM:</span>
                                <span className="text-emerald-400">{proc.sha256}</span>
                              </div>
                              <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                                <span>VAD Protection: <span className="text-zinc-200">PAGE_EXECUTE_READWRITE</span></span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
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

        {/* TAB 2: OPEN NETWORK PORTS TABLE */}
        {activeTab === 'ports' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090b10] text-zinc-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4">Proto</th>
                <th className="py-3 px-4">Local Address:Port</th>
                <th className="py-3 px-4">Foreign Target</th>
                <th className="py-3 px-4">Associated PID</th>
                <th className="py-3 px-4">Socket State</th>
                <th className="py-3 px-4">Service & Payload Analysis</th>
                <th className="py-3 px-4">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPorts.map((port, idx) => (
                <tr key={`${port.localPort}-${idx}`} className="hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    <span className="bg-[#080a0f] px-2 py-0.5 rounded border border-slate-800">
                      {port.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-zinc-300 font-medium">{port.localAddress}:</span>
                    <span className="text-emerald-400 font-bold">{port.localPort}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-200 font-medium">{port.foreignAddress}:{port.foreignPort}</div>
                    <span className="text-[10px] text-zinc-500 font-sans">Loc: {port.country}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-100">{port.processName}</div>
                    <div className="text-[10px] text-zinc-400">PID: {port.pid}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      port.state === 'ESTABLISHED'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                        : port.state === 'LISTENING'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        : 'bg-slate-800 text-zinc-300 border-slate-700'
                    }`}>
                      {port.state}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-200">{port.service}</div>
                    <div className="text-[10px] text-zinc-500">TX: {port.bytesSent} | RX: {port.bytesRecv}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      port.risk === 'CRITICAL'
                        ? 'bg-rose-950/40 text-rose-300 border-rose-600/50 glow-rose-badge'
                        : port.risk === 'HIGH'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 glow-amber-badge'
                        : port.risk === 'VERIFIED_SECURE'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/40 glow-emerald-badge'
                        : 'bg-slate-800 text-zinc-300 border-slate-700'
                    }`}>
                      {port.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 3: REGISTRY PERSISTENCE KEYS TABLE */}
        {activeTab === 'persistence' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090b10] text-zinc-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4">Hive</th>
                <th className="py-3 px-4">Registry Path</th>
                <th className="py-3 px-4">Value Name</th>
                <th className="py-3 px-4">Injected Payload / Data</th>
                <th className="py-3 px-4">MITRE Technique</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPersistence.map((item, idx) => (
                <tr key={`${item.keyPath}-${idx}`} className="hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    <span className="bg-[#080a0f] px-2 py-0.5 rounded border border-slate-800">
                      {item.hive}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-200">{item.keyPath}</div>
                    <div className="text-[10px] text-zinc-500">{item.classification}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-100">
                    {item.valueName}
                    <div className="text-[10px] font-normal text-zinc-500">{item.valueType}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-zinc-300 bg-[#080a0f] p-1.5 rounded border border-slate-800/80 truncate font-mono text-[11px]">
                      {item.data}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-zinc-300 border border-slate-800 font-mono text-[11px]">
                      {item.mitreId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-950/40 text-rose-300 border-rose-600/50 glow-rose-badge'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 glow-amber-badge'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-600/40 glow-emerald-badge'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: LIVE TERMINAL LOG STREAM */}
        {activeTab === 'logs' && (
          <div className="p-4 bg-[#080a0f] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-zinc-300">TERMINAL AUDIT BUFFER [DIRECT SYSCALL EMISSION]</span>
              </span>
              <span>{logs.length} EVENTS RECORDED</span>
            </div>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-md bg-[#0e1118]/80 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700/80 transition-colors"
                >
                  <span className="text-zinc-500 text-[10px] whitespace-nowrap mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    log.color === 'emerald'
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                      : log.color === 'cyan'
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-600/40'
                      : log.color === 'rose'
                      ? 'bg-rose-950/40 text-rose-400 border border-rose-600/40'
                      : 'bg-slate-800 text-zinc-300 border border-slate-700'
                  }`}>
                    {log.status}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-zinc-200">{log.title}</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">{log.details}</div>
                  </div>
                  {log.batchId && (
                    <span className="text-[10px] text-zinc-500 font-mono bg-[#080a0f] px-2 py-0.5 rounded border border-slate-800">
                      {log.batchId}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RAW JSON INSPECTOR */}
        {activeTab === 'json' && (
          <div className="p-4 bg-[#080a0f] font-mono text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-zinc-400 text-xs">
                Active Telemetry Payload (Dispatched by Python Extractor via HTTP POST /api/telemetry)
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-zinc-200 border border-slate-700 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-md bg-[#0a0d14] border border-slate-800 text-emerald-400/90 overflow-x-auto text-[11px] leading-relaxed max-h-[500px]">
              {JSON.stringify(latestPayloadJson || { notice: "Waiting for telemetry batch..." }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="border-t border-slate-800 bg-[#07090e] px-4 py-2.5 text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>DIRECT KERNEL EXTRACTION ENGINE</span>
          </span>
          <span className="text-slate-700">•</span>
          <span>API ENDPOINT: <span className="text-zinc-300 font-mono">POST /api/telemetry</span></span>
        </div>
        <div className="text-zinc-400">
          Showing <span className="text-emerald-400 font-bold">{
            activeTab === 'processes' ? filteredProcesses.length :
            activeTab === 'ports' ? filteredPorts.length :
            activeTab === 'persistence' ? filteredPersistence.length : logs.length
          }</span> forensic records
        </div>
      </div>
    </div>
  );
}
