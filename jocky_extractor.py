#!/usr/bin/env python3

import sys
import os
import time
import json
import random
import argparse
from datetime import datetime, timezone

if sys.platform == "win32":
    os.system("")
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

try:
    import requests
except ImportError:
    print("[!] Error: 'requests' module not found. Run: pip install requests")
    sys.exit(1)

GREEN = "\033[38;2;16;185;129m"
BRIGHT_GREEN = "\033[38;2;52;211;153m"
EMERALD = "\033[38;2;5;150;105m"
DARK_GRAY = "\033[38;2;100;116;139m"
GRAY = "\033[38;2;148;163;184m"
WHITE = "\033[38;2;241;245;249m"
CYAN = "\033[38;2;6;182;212m"
YELLOW = "\033[38;2;245;158;11m"
RED = "\033[38;2;239;68;68m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

def print_banner():
    banner = f"""
{DARK_GRAY}+===============================================================================+{RESET}
{DARK_GRAY}|{RESET}  {BOLD}{WHITE}JOCKY ENGINE{RESET} {BRIGHT_GREEN}[KERNEL FORENSIC EXTRACTION AGENT v4.9.2-RELEASE]{RESET}               {DARK_GRAY}|{RESET}
{DARK_GRAY}|{RESET}  {DIM}CLASSIFICATION:{RESET} {GREEN}TOP SECRET // NOFORN // ORCON // FORENSICS ONLY{RESET}                  {DARK_GRAY}|{RESET}
{DARK_GRAY}|{RESET}  {DIM}BINARY:{RESET} {WHITE}jocky_kext64.exe{RESET}    {DIM}COMPILER:{RESET} {GRAY}MSVC 19.38.32919 / Clang-CL 18.1{RESET}            {DARK_GRAY}|{RESET}
{DARK_GRAY}|{RESET}  {DIM}ARCH:{RESET} {WHITE}x86_64-pc-windows-msvc{RESET} {DIM}SUBSYSTEM:{RESET} {GRAY}WINDOWS_CUI (Native 0x0001){RESET}                {DARK_GRAY}|{RESET}
{DARK_GRAY}+===============================================================================+{RESET}
"""
    print(banner)

def log_info(step, msg, ssn=None, addr=None):
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    addr_str = f" {DARK_GRAY}[{addr}]{RESET}" if addr else ""
    ssn_str = f" {CYAN}(SSN: {ssn}){RESET}" if ssn else ""
    print(f"{DARK_GRAY}[{timestamp}]{RESET} {BRIGHT_GREEN}[*]{RESET} {BOLD}{WHITE}{step}{RESET}{ssn_str}{addr_str} -> {GRAY}{msg}{RESET}")

def log_success(step, msg, details=""):
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    det_str = f" {DARK_GRAY}[{details}]{RESET}" if details else ""
    print(f"{DARK_GRAY}[{timestamp}]{RESET} {GREEN}[+]{RESET} {BOLD}{GREEN}{step}{RESET}{det_str} :: {WHITE}{msg}{RESET}")

def log_warn(step, msg):
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    print(f"{DARK_GRAY}[{timestamp}]{RESET} {YELLOW}[!]{RESET} {BOLD}{YELLOW}{step}{RESET} :: {WHITE}{msg}{RESET}")

def run_extraction_sequence():
    print(f"{DARK_GRAY}[>] Initializing Ring-3 -> Direct NT Syscall translation table...{RESET}")
    time.sleep(1.0)

    log_info("Establishing Direct Syscalls", "Resolving Halo's Gate Zw/Nt system service numbers", ssn="0x0026", addr="0x7FFE0300")
    time.sleep(1.0)
    log_success("Syscall Stubs Loaded", "148 direct stub vectors mapped into RX memory region", details="PAGE_EXECUTE_READ")
    time.sleep(1.0)

    log_info("Bypassing User Mode Hooks", "Scanning ntdll.dll .text section for 0xE9 inline detour jumps", addr="0x7FFF6EA10000")
    time.sleep(1.0)
    log_warn("AV/EDR Hooks Detected", "Identified 4 inline trampolines on NtReadVirtualMemory & NtOpenProcess")
    time.sleep(1.0)
    log_success("Bypassing User Mode Hooks", "Restored clean NTDLL syscall prologue bytes from KnownDlls cache", details="UNHOOK_VERIFIED")
    time.sleep(1.0)

    log_info("Token Privilege Escalation", "Acquiring SeDebugPrivilege, SeSecurityPrivilege, SeBackupPrivilege", ssn="0x0041")
    time.sleep(1.0)
    log_success("Security Token Acquired", "Integrity Level: SYSTEM (SID: S-1-5-18)", details="EPROCESS_ACTIVE")
    time.sleep(1.0)

    log_info("Extracting Memory Hives", "Walking _CMHIVE pool allocations & Raw Registry Transaction Logs", addr="0xFFFFC000021A4B00")
    time.sleep(1.0)
    log_info("Extracting Memory Hives", "Parsing HKLM\\SYSTEM, HKLM\\SAM, and NTUSER.DAT hives via unbuffered DMA reads")
    time.sleep(1.0)
    log_success("Extracting Memory Hives", "Deserialized 3,412 registry keys, 8 persistence vectors cataloged", details="HIVE_DUMP_OK")
    time.sleep(1.0)

    log_info("Enumerating Telemetry", "Traversing ActiveProcessLinks circular list and TCP_LISTENER tables", addr="0xFFFFD801E0942080")
    time.sleep(1.0)
    log_success("Telemetry Serialized", "Generated forensic snapshot with 18 high-fidelity security artifacts")
    time.sleep(1.0)

def generate_mock_telemetry():
    now_iso = datetime.now(timezone.utc).isoformat()
    
    processes = [
        {
            "pid": 8412,
            "ppid": 1024,
            "name": "svchost.exe",
            "path": "C:\\Windows\\System32\\svchost.exe",
            "user": "NT AUTHORITY\\SYSTEM",
            "integrity": "SYSTEM",
            "threads": 34,
            "memoryBase": "0x7FF64A100000",
            "memorySize": "48.2 MB",
            "status": "SUSPICIOUS_INJECTION",
            "anomaly": "Reflective DLL injected into unbacked VAD allocation (RWX)",
            "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "threatLevel": "CRITICAL"
        },
        {
            "pid": 4920,
            "ppid": 8412,
            "name": "conhost.exe",
            "path": "C:\\Windows\\System32\\conhost.exe",
            "user": "NT AUTHORITY\\SYSTEM",
            "integrity": "SYSTEM",
            "threads": 4,
            "memoryBase": "0x7FF7B12C0000",
            "memorySize": "8.4 MB",
            "status": "NORMAL",
            "anomaly": "Standard console host allocation",
            "sha256": "8f4e2c65a1098ef7321e1a4980bc9d1f3b0e14a278912e756c4d0a92147f89ab",
            "threatLevel": "CLEAN"
        },
        {
            "pid": 11304,
            "ppid": 3440,
            "name": "powershell.exe",
            "path": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
            "user": "CORP\\Administrator",
            "integrity": "HIGH",
            "threads": 18,
            "memoryBase": "0x7FF628B00000",
            "memorySize": "112.6 MB",
            "status": "SUSPICIOUS_EXECUTION",
            "anomaly": "EncodedCommand detected with base64 download cradle (-w hidden -nop)",
            "sha256": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
            "threatLevel": "HIGH"
        },
        {
            "pid": 6128,
            "ppid": 780,
            "name": "spoolsv.exe",
            "path": "C:\\Windows\\System32\\spoolsv.exe",
            "user": "NT AUTHORITY\\SYSTEM",
            "integrity": "SYSTEM",
            "threads": 22,
            "memoryBase": "0x7FF619A00000",
            "memorySize": "14.1 MB",
            "status": "NORMAL",
            "anomaly": "Print Spooler service baseline nominal",
            "sha256": "5c92da90a14e9f3b259d3a778e1208fb347c6a99214810eeaf1288c934b12aa3",
            "threatLevel": "CLEAN"
        },
        {
            "pid": 14088,
            "ppid": 11304,
            "name": "rundll32.exe",
            "path": "C:\\Windows\\SysWOW64\\rundll32.exe",
            "user": "CORP\\Administrator",
            "integrity": "MEDIUM",
            "threads": 8,
            "memoryBase": "0x7FF780000000",
            "memorySize": "22.5 MB",
            "status": "PERSISTENCE_SPAWN",
            "anomaly": "Spawned from AppData\\Local\\Temp with ordinal export #1 callback",
            "sha256": "a4d3f2824b21919864ea56f217823ab159267104b2a8d323719bbcd201198654",
            "threatLevel": "CRITICAL"
        },
        {
            "pid": 2044,
            "ppid": 688,
            "name": "lsass.exe",
            "path": "C:\\Windows\\System32\\lsass.exe",
            "user": "NT AUTHORITY\\SYSTEM",
            "integrity": "PROTECTED_LIGHT",
            "threads": 62,
            "memoryBase": "0x7FF6D4000000",
            "memorySize": "86.0 MB",
            "status": "TARGET_MONITORED",
            "anomaly": "Process handle requested with PROCESS_VM_READ from PID 8412 (MiniDump hook)",
            "sha256": "12984ea0bc1f3089ef48b6289d01247ab1e523cd8201a4e102f92837bc449190",
            "threatLevel": "HIGH"
        }
    ]

    ports = [
        {
            "protocol": "TCP",
            "localAddress": "0.0.0.0",
            "localPort": 4444,
            "foreignAddress": "194.26.29.112",
            "foreignPort": 53530,
            "state": "ESTABLISHED",
            "pid": 8412,
            "processName": "svchost.exe",
            "service": "CobaltStrike Beacon / Meterpreter Listener",
            "risk": "CRITICAL",
            "country": "RO",
            "bytesSent": "2,419,008 B",
            "bytesRecv": "512,400 B"
        },
        {
            "protocol": "TCP",
            "localAddress": "127.0.0.1",
            "localPort": 9050,
            "foreignAddress": "0.0.0.0",
            "foreignPort": 0,
            "state": "LISTENING",
            "pid": 14088,
            "processName": "rundll32.exe",
            "service": "SOCKS5 Proxy / TOR Hidden Gateway",
            "risk": "HIGH",
            "country": "LOOPBACK",
            "bytesSent": "0 B",
            "bytesRecv": "0 B"
        },
        {
            "protocol": "TCP",
            "localAddress": "192.168.1.45",
            "localPort": 445,
            "foreignAddress": "192.168.1.100",
            "foreignPort": 49812,
            "state": "ESTABLISHED",
            "pid": 4,
            "processName": "System",
            "service": "SMBv2 Named Pipes / Lateral Movement",
            "risk": "MEDIUM",
            "country": "LAN",
            "bytesSent": "48,190 B",
            "bytesRecv": "104,220 B"
        },
        {
            "protocol": "TCP",
            "localAddress": "0.0.0.0",
            "localPort": 3389,
            "foreignAddress": "0.0.0.0",
            "foreignPort": 0,
            "state": "LISTENING",
            "pid": 1184,
            "processName": "TermService",
            "service": "MS-RDP Remote Desktop Protocol",
            "risk": "LOW",
            "country": "LOCAL",
            "bytesSent": "0 B",
            "bytesRecv": "0 B"
        },
        {
            "protocol": "UDP",
            "localAddress": "0.0.0.0",
            "localPort": 53,
            "foreignAddress": "8.8.8.8",
            "foreignPort": 53,
            "state": "ACTIVE",
            "pid": 11304,
            "processName": "powershell.exe",
            "service": "DNS Tunneling / TXT Record Exfiltration",
            "risk": "HIGH",
            "country": "US",
            "bytesSent": "692,100 B",
            "bytesRecv": "1,440,290 B"
        },
        {
            "protocol": "TCP",
            "localAddress": "0.0.0.0",
            "localPort": 3000,
            "foreignAddress": "127.0.0.1",
            "foreignPort": 51234,
            "state": "LISTENING",
            "pid": 23356,
            "processName": "jocky_engine_node",
            "service": "JOCKY C2 Forensic Telemetry Ingestion API",
            "risk": "VERIFIED_SECURE",
            "country": "LOCALHOST",
            "bytesSent": "12,980 B",
            "bytesRecv": "89,120 B"
        }
    ]

    persistence = [
        {
            "hive": "HKLM",
            "keyPath": "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
            "valueName": "WindowsSecurityTelemetryHost",
            "valueType": "REG_SZ",
            "data": "C:\\ProgramData\\WindowsDiagnostics\\telemetry_agent.exe --silent --kernel-hook",
            "classification": "MALICIOUS_PERSISTENCE",
            "mitreId": "T1547.001",
            "severity": "CRITICAL",
            "lastModified": "2026-09-25 15:42:10 UTC"
        },
        {
            "hive": "HKCU",
            "keyPath": "Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
            "valueName": "DriverUpdaterStaging",
            "valueType": "REG_EXPAND_SZ",
            "data": "%APPDATA%\\Local\\Temp\\update_stage.bat",
            "classification": "SUSPICIOUS_PAYLOAD",
            "mitreId": "T1547.001",
            "severity": "HIGH",
            "lastModified": "2026-09-25 16:01:44 UTC"
        },
        {
            "hive": "HKLM",
            "keyPath": "SYSTEM\\CurrentControlSet\\Services\\JockyFilterDriver",
            "valueName": "ImagePath",
            "valueType": "REG_EXPAND_SZ",
            "data": "\\??\\C:\\Windows\\System32\\drivers\\jocky_filt.sys",
            "classification": "KERNEL_DRIVER_FILTER",
            "mitreId": "T1543.003",
            "severity": "ELEVATED",
            "lastModified": "2026-09-25 14:12:00 UTC"
        },
        {
            "hive": "HKLM",
            "keyPath": "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\sethc.exe",
            "valueName": "Debugger",
            "valueType": "REG_SZ",
            "data": "C:\\Windows\\System32\\cmd.exe",
            "classification": "STICKY_KEYS_BACKDOOR",
            "mitreId": "T1546.008",
            "severity": "CRITICAL",
            "lastModified": "2026-09-25 15:19:33 UTC"
        },
        {
            "hive": "HKLM",
            "keyPath": "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon",
            "valueName": "Userinit",
            "valueType": "REG_SZ",
            "data": "C:\\Windows\\System32\\userinit.exe,C:\\Windows\\System32\\rundll32.exe mssec.dll,Init",
            "classification": "WINLOGON_HIJACK",
            "mitreId": "T1547.004",
            "severity": "CRITICAL",
            "lastModified": "2026-09-25 15:22:15 UTC"
        },
        {
            "hive": "HKCU",
            "keyPath": "Environment",
            "valueName": "COR_PROFILER",
            "valueType": "REG_SZ",
            "data": "{32E2F4DA-1B54-460E-88D6-74B53643B5BC}",
            "classification": "CLR_PROFILER_INJECTION",
            "mitreId": "T1574.012",
            "severity": "HIGH",
            "lastModified": "2026-09-25 15:58:02 UTC"
        }
    ]

    extraction_batch_id = f"JOCKY-EXT-0x{random.randint(0x100000, 0xFFFFFF):06X}"

    payload = {
        "batchId": extraction_batch_id,
        "engineVersion": "4.9.2-x64-RELEASE",
        "timestamp": now_iso,
        "hostInfo": {
            "hostname": "SEC-OPS-FORENSIC-01",
            "os": "Windows 11 Pro Enterprise x64 [Build 22631.3880]",
            "kernelBase": "0xFFFFF80436A00000",
            "integrityLevel": "SYSTEM",
            "activeSession": "CONSOLE-0",
            "sysCallMethod": "DIRECT_ZW_STUBS",
            "driverStatus": "VERIFIED_ACTIVE"
        },
        "statistics": {
            "processesAnalyzed": len(processes),
            "openSockets": len(ports),
            "persistenceKeys": len(persistence),
            "totalThreats": 7,
            "extractionLatencyMs": 1420
        },
        "telemetry": {
            "processes": processes,
            "ports": ports,
            "persistence": persistence
        },
        "logEvent": {
            "title": "Forensic Extraction Completed Successfully",
            "status": "EXTRACTION_SUCCESS",
            "details": f"Direct syscall extraction ingested {len(processes)} processes, {len(ports)} socket handles, and {len(persistence)} persistence hives.",
            "color": "emerald"
        }
    }
    return payload

def main():
    parser = argparse.ArgumentParser(description="JOCKY Engine Low-Level Forensic Extraction Script")
    parser.add_argument("--url", default="http://localhost:3000/api/telemetry", help="Next.js Dashboard API Route URL")
    parser.add_argument("--fast", action="store_true", help="Skip sleep delays for debugging")
    args = parser.parse_args()

    print_banner()

    if not args.fast:
        run_extraction_sequence()
    else:
        print(f"{DARK_GRAY}[*]{RESET} Fast mode enabled: skipping extraction sleep pauses.")

    print(f"\n{DARK_GRAY}--------------------------------------------------------------------------------{RESET}")
    print(f"{DARK_GRAY}[*]{RESET} {BOLD}{WHITE}Packaging forensic telemetry payload...{RESET}")
    payload = generate_mock_telemetry()
    print(f"{DARK_GRAY}[*]{RESET} Batch ID: {BRIGHT_GREEN}{payload['batchId']}{RESET}")
    print(f"{DARK_GRAY}[*]{RESET} Timestamp: {GRAY}{payload['timestamp']}{RESET}")
    print(f"{DARK_GRAY}[*]{RESET} Target C2 Endpoint: {CYAN}{args.url}{RESET}")
    print(f"{DARK_GRAY}--------------------------------------------------------------------------------{RESET}\n")

    print(f"{DARK_GRAY}[>] Dispatching encrypted JSON telemetry stream to Next.js API...{RESET}")
    
    try:
        response = requests.post(
            args.url,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "JOCKY-ForensicEngine/4.9.2 (Windows NT 10.0; Win64; x64)",
                "X-Forensic-Source": "RING0_DIRECT_SYSCALL_MOCK"
            },
            timeout=8
        )
        
        if response.status_code in (200, 201):
            log_success("C2 INGESTION VERIFIED", f"HTTP {response.status_code} OK - Telemetry successfully received!", details="DASHBOARD_SYNC_COMPLETE")
            resp_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
            print(f"\n{BRIGHT_GREEN}+===============================================================================+{RESET}")
            print(f"{BRIGHT_GREEN}|{RESET}  {BOLD}{WHITE}JOCKY ENGINE :: EXTRACTION CYCLE COMPLETED SUCCESSFULLY{RESET}                    {BRIGHT_GREEN}|{RESET}")
            print(f"{BRIGHT_GREEN}|{RESET}  {GREEN}Status:{RESET} {WHITE}200 INGESTED{RESET}    {GREEN}Server Msg:{RESET} {GRAY}{resp_data.get('message', 'Payload Processed')}{RESET}")
            print(f"{BRIGHT_GREEN}|{RESET}  {GREEN}Dashboard URL:{RESET} {CYAN}http://localhost:3000{RESET}                                    {BRIGHT_GREEN}|{RESET}")
            print(f"{BRIGHT_GREEN}|{RESET}  {GREEN}Synced Artifacts:{RESET} {WHITE}{payload['statistics']['processesAnalyzed']} Processes, {payload['statistics']['openSockets']} Ports, {payload['statistics']['persistenceKeys']} Registry Hives{RESET}")
            print(f"{BRIGHT_GREEN}+===============================================================================+{RESET}\n")
        else:
            log_warn(f"HTTP {response.status_code}", f"Server returned response: {response.text}")
    except requests.exceptions.ConnectionError:
        print(f"\n{RED}[-] CONNECTION REFUSED to {args.url}{RESET}")
        print(f"{YELLOW}[!] Ensure the Next.js web dashboard is running on port 3000!{RESET}")
        print(f"{DARK_GRAY}[!] Start Next.js with: npm run dev or npm run start{RESET}")
        print(f"{DARK_GRAY}[!] The mock telemetry payload was successfully generated and is ready for transmission.{RESET}\n")
    except Exception as e:
        print(f"\n{RED}[!] Transmission error: {str(e)}{RESET}\n")

if __name__ == "__main__":
    main()
