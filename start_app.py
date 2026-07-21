"""Kill stale processes and start Flask on port 5050 cleanly."""

import subprocess
import sys
import os

# Kill any existing python processes that might hold old bytecode
if sys.platform == "win32":
    try:
        subprocess.run(["taskkill", "/F", "/IM", "python.exe"],
                       capture_output=True, text=True)
    except FileNotFoundError:
        pass  # python.exe not found via PATH; skip

# Clear __pycache__ dirs
for root, dirs, files in os.walk("."):
    for d in dirs:
        if d == "__pycache__":
            path = os.path.join(root, d)
            for f in os.listdir(path):
                os.remove(os.path.join(path, f))
            os.rmdir(path)

print("Starting Flask on http://127.0.0.1:5050")
os.environ["FLASK_APP"] = "app.py"
os.environ["FLASK_ENV"] = "development"
os.environ["FLASK_DEBUG"] = "0"  # disable reloader to avoid fork issues
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
app = create_app()
app.run(host="127.0.0.1", port=5050, debug=False, use_reloader=False)

