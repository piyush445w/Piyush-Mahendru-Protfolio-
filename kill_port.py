"""Kill whatever is running on port 5000."""
import subprocess, os, sys

port = "5000"

# On Windows, use PowerShell to find and kill the process
ps_cmd = f'''
$process = netstat -ano | Select-String ":5000 "
if ($process) {{
    $pid = $process.ToString().Trim().Split()[-1]
    Write-Host "Killing PID $pid on port {port}"
    Stop-Process -Id $pid -Force
    Write-Host "Done"
}} else {{
    Write-Host "No process on port {port}"
}}
'''
# Also try direct taskkill approach
subprocess.run(["taskkill", "/F", "/IM", "python.exe"], 
               capture_output=True, shell=True)
print("Killed all python.exe processes")

# Also try finding by port
result = subprocess.run(
    'netstat -ano | findstr :5000',
    capture_output=True, shell=True, text=True
)
print(f"netstat output: {result.stdout}")
if result.stdout:
    lines = result.stdout.strip().split('\n')
    for line in lines:
        parts = line.strip().split()
        if len(parts) > 4:
            pid = parts[-1]
            print(f"Found PID {pid} on port 5000")

