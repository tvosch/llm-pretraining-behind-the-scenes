#!/usr/bin/env bash
# Serve the site locally. Usage: ./serve.sh [port]
PORT="${1:-8722}"
cd "$(dirname "$0")"
echo "→ http://localhost:${PORT}/"
exec python3 -m http.server "${PORT}" --bind 127.0.0.1
