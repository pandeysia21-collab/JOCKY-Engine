import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JOCKY ENGINE // Ring-0 Forensic Telemetry & Syscall Interceptor',
  description: 'High-fidelity tactical cybersecurity forensic dashboard displaying live Process IDs, Network Sockets, and Registry Persistence Keys.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#08090d] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-black">
      <body className="min-h-screen bg-[#08090d] bg-tactical-grid flex flex-col font-mono relative">
        {children}
      </body>
    </html>
  );
}
