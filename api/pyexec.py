from http.server import BaseHTTPRequestHandler
import json
import os
import subprocess
import tempfile
import time

MAX_CODE = 100_000
MAX_STDIN = 10_000
MAX_PAYLOAD = MAX_CODE + MAX_STDIN + 4_096
MAX_OUTPUT = 50_000
RUN_TIMEOUT_S = 5


class handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _respond(self, status, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        self._respond(405, {"error": "Use POST"})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0:
            self._respond(400, {"error": "Request body required"})
            return
        if length > MAX_PAYLOAD:
            self._respond(413, {"error": "Payload too large"})
            return

        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            self._respond(400, {"error": "Invalid JSON"})
            return

        code = data.get("code")
        stdin = data.get("stdin", "")
        if not isinstance(code, str) or not code or len(code) > MAX_CODE:
            self._respond(400, {"error": "code is required (max 100KB)"})
            return
        if not isinstance(stdin, str) or len(stdin) > MAX_STDIN:
            self._respond(400, {"error": "stdin too large (max 10KB)"})
            return

        with tempfile.TemporaryDirectory() as workdir:
            path = os.path.join(workdir, "main.py")
            with open(path, "w", encoding="utf-8") as f:
                f.write(code)
            started = time.time()
            try:
                proc = subprocess.run(
                    ["python3", path],
                    input=stdin.encode("utf-8"),
                    capture_output=True,
                    timeout=RUN_TIMEOUT_S,
                    cwd=workdir,
                )
                stdout = proc.stdout.decode("utf-8", errors="replace")
                stderr = proc.stderr.decode("utf-8", errors="replace")
                exit_code = proc.returncode
            except subprocess.TimeoutExpired:
                stdout = ""
                stderr = "Time Limit Exceeded"
                exit_code = 124
            except OSError as exc:
                stdout = ""
                stderr = f"Python runtime error: {exc}"
                exit_code = 1
            elapsed_ms = int((time.time() - started) * 1000)

        self._respond(
            200,
            {
                "stdout": stdout[:MAX_OUTPUT],
                "stderr": stderr[:MAX_OUTPUT],
                "exitCode": exit_code,
                "time": elapsed_ms,
                "memory": 0,
            },
        )
