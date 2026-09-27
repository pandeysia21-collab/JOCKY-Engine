import React from 'react';
import { Cpu, Network, Database, ShieldAlert } from 'lucide-react';
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
  
  const totalArtifacts = suspiciousProcesses + criticalPorts + criticalPersistence;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800/90 hover:border-zinc-300 dark:hover:border-slate-700/90 rounded-lg p-4 transition-all duration-300 shadow-sm dark:shadow-md relative overflow-hidden group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">Processes</span>
            <div className="p-2 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
              {processes.length}
            </div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 font-mono tracking-wide transition-colors duration-300">
              {suspiciousProcesses} SUSPICIOUS
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800/70 text-xs text-zinc-500 dark:text-zinc-400 font-sans transition-colors duration-300">
          Memory VAD regions successfully mapped
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent opacity-50 dark:opacity-100" />
      </div>

      <div className="bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800/90 hover:border-zinc-300 dark:hover:border-slate-700/90 rounded-lg p-4 transition-all duration-300 shadow-sm dark:shadow-md relative overflow-hidden group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">Network Connections</span>
            <div className="p-2 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
              <Network className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
              {ports.length}
            </div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/40 font-mono tracking-wide transition-colors duration-300">
              {criticalPorts} C2 / REVERSE
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800/70 text-xs text-zinc-500 dark:text-zinc-400 font-sans transition-colors duration-300">
          TCP/UDP extended tables actively polled
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent opacity-50 dark:opacity-100" />
      </div>

      <div className="bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800/90 hover:border-zinc-300 dark:hover:border-slate-700/90 rounded-lg p-4 transition-all duration-300 shadow-sm dark:shadow-md relative overflow-hidden group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">Persistence Entries</span>
            <div className="p-2 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
              {persistence.length}
            </div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 font-mono tracking-wide transition-colors duration-300">
              {criticalPersistence} HIJACKS
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800/70 text-xs text-zinc-500 dark:text-zinc-400 font-sans transition-colors duration-300">
          HKLM & HKCU raw hive dumps parsed
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent opacity-50 dark:opacity-100" />
      </div>

      <div className="bg-white dark:bg-[#0e1118]/85 border border-zinc-200 dark:border-slate-800/90 hover:border-zinc-300 dark:hover:border-slate-700/90 rounded-lg p-4 transition-all duration-300 shadow-sm dark:shadow-md relative overflow-hidden group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">Security Artifacts</span>
            <div className="p-2 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {totalArtifacts}
            </div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/40 font-mono tracking-wide transition-colors duration-300">
              BATCH #{batchCount}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800/70 text-xs text-zinc-500 dark:text-zinc-400 font-sans transition-colors duration-300">
          Total malicious identifiers detected
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/80 via-emerald-500/20 to-transparent opacity-50 dark:opacity-100" />
      </div>
    </div>
  );
}
