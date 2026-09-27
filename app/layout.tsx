import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning className="antialiased selection:bg-emerald-500 selection:text-white dark:selection:text-black">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 bg-tactical-grid flex flex-col font-mono relative transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
