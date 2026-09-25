# JOCKY ENGINE // Low-Level Cybersecurity Forensic System

High-fidelity tactical UI and terminal mock built for video demonstrations of modern endpoint forensics, direct system calls, user-mode hook evasion, and real-time telemetry streaming.

---

## Architecture Overview

```
                      +-----------------------------------+
                      |      jocky_extractor.py           |
                      |   [Simulated Win64 MSVC Binary]   |
                      |  - Establishing Direct Syscalls   |
                      |  - Bypassing User Mode Hooks      |
                      |  - Extracting Memory Hives        |
                      +-----------------+-----------------+
                                        |
                                        | HTTP POST /api/telemetry
                                        v
+-----------------------------------------------------------------------+
|                 JOCKY Engine Forensic Web Dashboard                   |
|                        (Next.js + Tailwind CSS)                       |
|                                                                       |
|  [ TOP SECRET // CLASSIFIED THEME // ZINC-950 // SLATE-700 BORDERS ]  |
|                                                                       |
|  * Process IDs Table (PIDs, Memory Bases, Integrity, Anomalies)       |
|  * Open Network Ports (Sockets, Foreign C2, Traffic, Protocols)       |
|  * Registry Persistence Keys (Run/RunOnce, IFEO, Winlogon, MITRE)     |
|  * Real-Time Stream (Updates dynamically without page refresh)        |
+-----------------------------------------------------------------------+
```

---

## Demonstration Runbook

### Part A: Start the Classified Web Dashboard
1. Ensure the dashboard is running on port 3000:
   ```powershell
   npm run dev
   # OR for production build:
   npm run start
   ```
2. Open your browser to:
   ```
   http://localhost:3000
   ```
3. The dashboard displays:
   - **Classification Header**: TOP SECRET banner, real-time UTC clock, and live listener beacon.
   - **KPI Overview Cards**: Ingested PIDs, Active Sockets, Persistence Hives, and Kernel Subsystem status.
   - **Central Telemetry Tables**:
     - `Process IDs`: Filterable list of processes with expandable deep inspection panels (VAD permissions, SHA256 hashes, reflection detection).
     - `Open Network Ports`: Socket table with protocols, local/foreign endpoints, and risk classifications.
     - `Registry Persistence`: Run hives, IFEO debugger backdoors, and MITRE ATT&CK mapping.
     - `Terminal Logs`: Live event emission audit log.
     - `Raw JSON Stream`: Live payload viewer.

### Part B: Execute the Python Forensic Extractor
In a separate terminal window, run:
```powershell
python jocky_extractor.py
```

What you will observe:
1. Low-level compiled Windows binary look & feel with ANSI colors and PE headers.
2. 1-second authentic delays between operations:
   - `Establishing Direct Syscalls` (Halo's Gate SSN resolution)
   - `Bypassing User Mode Hooks` (NTDLL text section unhooking)
   - `Token Privilege Escalation` (SYSTEM integrity acquisition)
   - `Extracting Memory Hives` (Raw DMA registry hive traversal)
   - `Enumerating Telemetry` (ActiveProcessLinks and TCP table parsing)
3. HTTP POST transmission to `http://localhost:3000/api/telemetry`.
4. **Dynamic Dashboard Update**: The Next.js dashboard receives the telemetry and updates all tables and counters in real-time **without any page refresh**!

---

## Fast Mode (for quick tests)
To skip the sleep pauses:
```powershell
python jocky_extractor.py --fast
```
