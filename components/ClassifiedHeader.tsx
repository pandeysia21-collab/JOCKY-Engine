'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Radio, Play, Terminal, Activity, CheckCircle2, Loader2 } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  batchCount: number;
  latestBatchId: string;
  isStreaming: boolean;
  onTriggerTestBurst: () => void;
  isLoading: boolean;
}

export function ClassifiedHeader({
  lastUpdated,
  batchCount,
  latestBatchId,
  isStreaming,
  onTriggerTestBurst,
  isLoading,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800/90 bg-[#0b0d13]/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      {/* Top Classified Intelligence Banner Stripe */}
      <div className="bg-[#07080c] border-b border-slate-800/60 px-4 py-1.5 text-xs flex justify-between items-center text-zinc-400">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wider text-emerald-400/90 text-[10px] sm:text-[11px] classified-stamp">
            CLASSIFICATION: TOP SECRET // JOCKY ENGINE // FORENSIC EXTRACTION CORE
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <div className="hidden md:flex items-center space-x-1.5 text-zinc-400">
            <span className="text-zinc-500 text-[10px]">SYSTEM CLOCK:</span>
            <span className="text-emerald-400 font-mono text-[11px]">{currentTime || 'SYNCING...'}</span>
          </div>
          <span className="hidden md:inline text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <span className="text-zinc-500 text-[10px]">ARCH:</span>
            <span className="text-zinc-300 font-mono text-[11px]">WIN64 NATIVE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>PORT 3000 LISTENER</span>
          </div>
        </div>
      </div>

      {/* Main Command Header Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subsystem Specs */}
        <div className="flex items-center space-x-3.5">
          <div className="relative p-2.5 bg-[#090b10] border border-slate-700/80 rounded-lg shadow-inner group">
            <Shield className="w-6 h-6 text-emerald-400 transition-transform duration-200 group-hover:scale-105" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full glow-emerald-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-extrabold tracking-wider text-zinc-100 uppercase font-mono">
                JOCKY <span className="text-emerald-400">ENGINE</span>
              </h1>
              <span className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                v4.9.2-RELEASE
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 font-sans">
              <span>Direct Syscalls Subsystem</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-medium">Bypassing User-Mode Hooks</span>
              <span className="text-slate-600">•</span>
              <span>Memory Hive Parser</span>
            </p>
          </div>
        </div>

        {/* Prominent Live State & Primary Actions */}
        <div className="flex items-center space-x-3 flex-wrap">
          {/* Prominent Stream Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#090b10] border border-slate-700/90 shadow-sm text-xs">
            <span className="relative flex h-2.5 w-2.5">
              {isLoading ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </>
              ) : isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              )}
            </span>
            <span className="text-zinc-400 text-[10px] tracking-wider uppercase font-medium">STATUS:</span>
            <span className={`font-bold font-mono tracking-wide ${isLoading ? 'text-emerald-300 animate-pulse' : isStreaming ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isLoading ? 'PROCESSING INGESTION...' : isStreaming ? 'LIVE INGESTION' : 'POLLING ACTIVE'}
            </span>
          </div>

          {/* Latest Batch Info Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#090b10] border border-slate-700/90 shadow-sm text-xs">
            <span className="text-zinc-400 text-[10px] tracking-wider uppercase font-medium">LATEST BATCH:</span>
            <span className="text-zinc-200 font-mono text-[11px] bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-emerald-300">
              {latestBatchId}
            </span>
          </div>

          {/* Interactive Ingestion Simulation Button */}
          <button
            id="trigger-test-burst-btn"
            onClick={onTriggerTestBurst}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={isLoading ? "Forensic capture sequence in progress" : "Simulate forensic capture"}
            title="Inject simulated low-level forensic burst into local API"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-sm ${
              isLoading
                ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/60 cursor-not-allowed glow-emerald-subtle'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 active:scale-95 glow-emerald-subtle'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            )}
            <span className="tracking-wide">
              {isLoading ? 'CAPTURE IN PROGRESS...' : 'Simulate Capture'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
