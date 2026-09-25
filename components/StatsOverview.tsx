import React from 'react';
import { Cpu, Network, Database, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ProcessTelemetry, NetworkPortTelemetry, RegistryPersistenceTelemetry } from '@/lib/types';

interface StatsProps {
  processes: ProcessTelemetry[];
  ports: NetworkPortTelemetry[];
  persistence: RegistryPersistenceTelemetry[];
  batchCount: number;
}

export function StatsOverview({ processes, ports, persistence, batchCount }: StatsProps) {
  const suspiciousProcesses = processes.filter(p => p.threatLevel === 'CRITICAL' || p.threatLevel === 'HIGH').length;
  const criticalPorts = ports.filter(p => p.risk === 'CRITICAL' || p.risk === 'HIGH').length;
  const criticalPersistence = persistence.filter(k => k.severity === 'CRITICAL' || k.severity === 'HIGH').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Process Telemetry */}
      <div className="bg-[#0e1118]/85 border border-slate-800/90 hover:border-slate-700/90 rounded-lg p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden group shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Process Telemetry</span>
            <div className="p-2 rounded-md bg-[#090b10] border border-slate-800 text-emerald-400 group-hover:border-slate-700 transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-zinc-100 font-mono tracking-tight">
              {processes.length} <span className="text-xs font-normal text-zinc-400 tracking-normal">PIDs MAPPED</span>
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 font-mono tracking-wide">
              {suspiciousProcesses} SUSPICIOUS
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Syscall: <span className="text-emerald-400 font-semibold">NtQuerySystemInfo</span></span>
          <span className="text-zinc-500">VAD Traversal OK</span>
        </div>

        {/* Subtle Accent Bottom Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent" />
      </div>

      {/* Metric 2: Open Network Ports */}
      <div className="bg-[#0e1118]/85 border border-slate-800/90 hover:border-slate-700/90 rounded-lg p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden group shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Network Sockets</span>
            <div className="p-2 rounded-md bg-[#090b10] border border-slate-800 text-emerald-400 group-hover:border-slate-700 transition-colors">
              <Network className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-zinc-100 font-mono tracking-tight">
              {ports.length} <span className="text-xs font-normal text-zinc-400 tracking-normal">PORTS / LISTS</span>
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 font-mono tracking-wide">
              {criticalPorts} C2 / REVERSE
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Protocol: <span className="text-zinc-300">TCP/UDP Table</span></span>
          <span className="text-emerald-400 font-semibold">DeviceIoControl</span>
        </div>

        {/* Subtle Accent Bottom Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent" />
      </div>

      {/* Metric 3: Registry Persistence Keys */}
      <div className="bg-[#0e1118]/85 border border-slate-800/90 hover:border-slate-700/90 rounded-lg p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden group shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Persistence Hives</span>
            <div className="p-2 rounded-md bg-[#090b10] border border-slate-800 text-emerald-400 group-hover:border-slate-700 transition-colors">
              <Database className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-zinc-100 font-mono tracking-tight">
              {persistence.length} <span className="text-xs font-normal text-zinc-400 tracking-normal">RUN HIVES</span>
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-mono tracking-wide">
              {criticalPersistence} HIJACKS
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Scanner: <span className="text-emerald-400 font-semibold">_CMHIVE Raw DMA</span></span>
          <span className="text-zinc-500">HKLM/HKCU</span>
        </div>

        {/* Subtle Accent Bottom Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent" />
      </div>

      {/* Metric 4: Extraction Core & Telemetry Link */}
      <div className="bg-[#0e1118]/85 border border-slate-800/90 hover:border-slate-700/90 rounded-lg p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden group shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Forensic Subsystem</span>
            <div className="p-2 rounded-md bg-[#090b10] border border-slate-800 text-emerald-400 group-hover:border-slate-700 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              EXTRACTION OK
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-700/40 font-mono tracking-wide">
              BATCH #{batchCount}
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Hooks: <span className="text-emerald-400 font-semibold">BYPASS ACTIVE</span></span>
          <span className="text-emerald-400 font-semibold">SSN: 0x0026</span>
        </div>

        {/* Subtle Accent Bottom Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent" />
      </div>
    </div>
  );
}
