"""The bridge. Serves the newest trace on localhost so the course site can read it.

Nothing is uploaded. The site fetches http://localhost:<port>/trace directly from the
reader's own browser, and the data never leaves the machine. CORS is pinned to the course
origins (plus any origin you pass with --origin) rather than '*', so a random page you
happen to have open cannot read your traces.
"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DEFAULT_ORIGINS = [
    "https://themodelandtheloop.com",
    "https://www.themodelandtheloop.com",
    "http://localhost:3077",
    "http://localhost:3000",
]
# The site tries these in order, so a busy port is not a dead end.
PORTS = [4747, 4748, 4749, 4750]


def make_handler(root: Path, origins: list[str]):
    class Handler(BaseHTTPRequestHandler):
        def _send(self, code: int, payload: dict):
            body = json.dumps(payload).encode()
            origin = self.headers.get("Origin", "")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            if origin in origins:
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Vary", "Origin")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_OPTIONS(self):
            origin = self.headers.get("Origin", "")
            self.send_response(204)
            if origin in origins:
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Content-Type")
                self.send_header("Vary", "Origin")
            self.end_headers()

        def do_GET(self):
            path = self.path.split("?")[0].rstrip("/") or "/"
            if path == "/":
                return self._send(200, {"ok": True, "service": "model-and-loop", "endpoints":
                                        ["/trace", "/traces", "/progress"]})
            if path == "/trace":
                f = root / "traces" / "latest.json"
                if not f.exists():
                    return self._send(404, {"error": "no trace yet", "hint": "run your agent once"})
                return self._send(200, json.loads(f.read_text()))
            if path == "/traces":
                d = root / "traces"
                files = sorted(p.name for p in d.glob("*.json") if p.name != "latest.json") if d.exists() else []
                return self._send(200, {"traces": files})
            if path == "/progress":
                f = root / ".course" / "progress.json"
                return self._send(200, json.loads(f.read_text()) if f.exists() else {"modules": {}})
            return self._send(404, {"error": "not found"})

        def log_message(self, *a):
            pass  # the terminal belongs to the learner, not to this server

    return Handler


def serve(root: Path, origins: list[str], ports=PORTS):
    """Bind the first free port. Returns (httpd, port)."""
    last = None
    for port in ports:
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", port), make_handler(root, origins))
            return httpd, port
        except OSError as exc:
            last = exc
    raise SystemExit(f"Could not bind any of {ports}: {last}")
