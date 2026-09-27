'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Radio, Play, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  latestBatchId: string;
  isStreaming: boolean;
  onTriggerTestBurst: () => void;
  isLoading: boolean;
}

export function ClassifiedHeader({
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
    <header className="border-b border-zinc-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#0b0d13]/95 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="bg-zinc-100 dark:bg-[#07080c] border-b border-zinc-200 dark:border-slate-800/60 px-4 py-1.5 text-xs flex justify-between items-center text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wider text-emerald-700 dark:text-emerald-400/90 text-sm classified-stamp">
            CLASSIFICATION: TOP SECRET // JOCKY ENGINE // FORENSIC EXTRACTION CORE
          </span>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <div className="hidden md:flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400">
            <span className="text-zinc-500 dark:text-zinc-500 text-xs">SYSTEM CLOCK:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{currentTime || 'SYNCING...'}</span>
          </div>
          <span className="hidden md:inline text-zinc-300 dark:text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400">
            <span className="text-zinc-500 dark:text-zinc-500 text-xs">ARCH:</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">WIN64 NATIVE</span>
          </div>
          <span className="text-zinc-300 dark:text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-sm">
            <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>PORT 3000 LISTENER</span>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative p-2.5 bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-700/80 rounded-lg shadow-sm dark:shadow-inner group transition-colors duration-300">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-105" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-[0_0_8px_-1px_rgba(16,185,129,0.5)] dark:glow-emerald-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-extrabold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase font-mono">
                JOCKY <span className="text-emerald-600 dark:text-emerald-400">ENGINE</span>
              </h1>
              <span className="text-xs tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                v4.9.2-RELEASE
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-0.5 font-sans">
              <span>Forensic Analysis Platform</span>
              <span className="text-zinc-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400/90 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                SYSTEM ONLINE
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-wrap">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-700/90 shadow-sm text-sm transition-colors duration-300">
            <span className="relative flex h-2.5 w-2.5">
              {isLoading ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-emerald-400"></span>
                </>
              ) : isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-emerald-400"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 dark:bg-amber-400"></span>
              )}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase font-medium">STATUS:</span>
            <span className={`font-bold font-mono tracking-wide ${isLoading ? 'text-emerald-600 dark:text-emerald-300 animate-pulse' : isStreaming ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {isLoading ? 'PROCESSING INGESTION...' : isStreaming ? 'LIVE INGESTION' : 'POLLING ACTIVE'}
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-[#090b10] border border-zinc-200 dark:border-slate-700/90 shadow-sm text-sm transition-colors duration-300">
            <span className="text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase font-medium">LATEST BATCH:</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-mono text-sm bg-zinc-100 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-zinc-300 dark:border-slate-800 text-emerald-700 dark:text-emerald-300">
              {latestBatchId}
            </span>
          </div>

          <button
            id="trigger-test-burst-btn"
            onClick={onTriggerTestBurst}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={isLoading ? "Forensic capture sequence in progress" : "Simulate forensic capture"}
            title="Inject simulated low-level forensic burst into local API"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 shadow-sm ${
              isLoading
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/60 cursor-not-allowed'
                : 'bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 active:scale-95'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="tracking-wide">
              {isLoading ? 'CAPTURE IN PROGRESS...' : 'Simulate Capture'}
            </span>
          </button>

          <div className="h-8 w-px bg-zinc-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
