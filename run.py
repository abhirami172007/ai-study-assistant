# -*- coding: utf-8 -*-
"""
AI Study Assistant - Universal Single-File Runner
Runs cross-platform on Windows/Mac/Linux with automatic dependency resolution
and self-healing port conflict resolution.
"""
import sys
import os
import time
import socket
import subprocess
import webbrowser
import threading

def free_stale_port(port=8000):
    """Automatically frees any orphaned process holding the port."""
    try:
        my_pid = os.getpid()
        if os.name == "nt":
            cmd = f'netstat -ano | findstr :{port}'
            proc = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            for line in proc.stdout.strip().splitlines():
                parts = line.split()
                if len(parts) >= 5 and "LISTENING" in parts[3]:
                    pid = int(parts[4])
                    if pid != my_pid and pid > 0:
                        print(f"[Cleanup] Terminating previous background instance (PID {pid}) on port {port}...")
                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                        time.sleep(1)
    except Exception:
        pass

def get_available_port(start_port=8000):
    """Finds first available port starting from start_port."""
    for p in range(start_port, start_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", p))
                return p
            except OSError:
                continue
    return start_port

def main():
    print("=" * 65)
    print("        AI STUDY ASSISTANT (AGENTIC AI PLATFORM)        ")
    print("=================================================================")
    print()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)
    sys.path.insert(0, base_dir)

    # 1. Check dependencies
    required_packages = ["fastapi", "uvicorn", "pydantic"]
    needs_install = False
    for pkg in required_packages:
        try:
            __import__(pkg)
        except ImportError:
            needs_install = True
            break

    if needs_install:
        print("[1/3] First-time setup: Installing required libraries...")
        req_file = os.path.join(base_dir, "requirements.txt")
        try:
            if os.path.exists(req_file):
                subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", req_file])
            else:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn", "pydantic"])
            print("[OK] Libraries installed successfully!\n")
        except Exception as e:
            print(f"\n[ERROR] Failed to install libraries: {e}")
            input("\nPress Enter to exit...")
            return

    # 2. Free stale port or find next available port
    print("[2/3] Checking network port availability...")
    free_stale_port(8000)
    target_port = get_available_port(8000)
    print(f"[OK] Port {target_port} is ready!")

    # 3. Launch browser using multiple methods
    def launch_browser():
        time.sleep(2)
        url = f"http://localhost:{target_port}"
        print(f"\nOpening {url} in your web browser...")
        if os.name == "nt":
            try:
                os.system(f"start {url}")
                return
            except Exception:
                pass
        try:
            webbrowser.open(url)
        except Exception:
            pass

    threading.Thread(target=launch_browser, daemon=True).start()

    # 4. Start Uvicorn directly
    print("[3/3] Starting AI Study Assistant engine...")
    print("\n" + "=" * 65)
    print(f" SUCCESS: SERVER IS LIVE ON PORT {target_port}!")
    print(f" URL: http://localhost:{target_port}")
    print(" Keep this window open while using the application.")
    print(" Press Ctrl+C to stop the server.")
    print("=" * 65 + "\n")

    try:
        import uvicorn
        from backend.main import app
        uvicorn.run(app, host="0.0.0.0", port=target_port, log_level="info")
    except Exception as ex:
        print(f"\n[SERVER ERROR] {ex}")
        input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()
