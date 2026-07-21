"""Check what's actually being served on port 5000."""

import urllib.request
import sys

try:
    f = urllib.request.urlopen('http://127.0.0.1:5000', timeout=3)
    body = f.read().decode('utf-8')
    print(f"Status: {f.status}")
    print(f"Length: {len(body)} chars")
    print(f"First 200 chars: {body[:200]!r}")
    print(f"Has DOCTYPE: {'<!DOCTYPE html>' in body}")
    print(f"Has hero-name: {'hero-name' in body}")
    print(f"Has navbar-logo: {'navbar-logo' in body}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

