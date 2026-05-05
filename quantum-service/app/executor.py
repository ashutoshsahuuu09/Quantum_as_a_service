import json
import subprocess
import sys
import tempfile
import os
from textwrap import dedent


def _runner_script(user_code: str, shots: int) -> str:
    return dedent(f"""
import io
import json
import contextlib
import traceback

from qiskit_aer import AerSimulator

user_globals = {{}}
user_locals = {{}}
captured = io.StringIO()

try:
    with contextlib.redirect_stdout(captured):
        exec({user_code!r}, user_globals, user_locals)

    qc = user_locals.get("qc") or user_globals.get("qc")

    result_payload = {{
        "counts": None,
        "circuit_text": None,
        "stdout": captured.getvalue()
    }}

    if qc is None:
        raise NameError(
            "Quantum circuit not found. Your code must create a variable named 'qc' "
            "with a QuantumCircuit object. Example: qc = QuantumCircuit(2, 2)"
        )

    # Try to get circuit text, fallback to basic info if it fails
    try:
        circuit_str = str(qc.draw(output="text"))
        # Test encoding
        circuit_str.encode('utf-8')
        result_payload["circuit_text"] = circuit_str
    except Exception:
        # Fallback: create a simple text summary
        result_payload["circuit_text"] = f"Quantum Circuit: {{qc.num_qubits}} qubits, {{len(qc.data)}} instructions"

    backend = AerSimulator()
    job = backend.run(qc, shots={shots})
    result = job.result()

    result_payload["counts"] = result.get_counts()

    # Ensure stdout is properly encoded
    stdout_content = captured.getvalue()
    try:
        stdout_content.encode('utf-8')
        result_payload["stdout"] = stdout_content
    except UnicodeEncodeError:
        # Fallback: replace problematic characters
        result_payload["stdout"] = stdout_content.encode('utf-8', errors='replace').decode('utf-8')

    print(json.dumps(result_payload, ensure_ascii=False))

except Exception:
    error_output = captured.getvalue()
    try:
        error_output.encode('utf-8')
    except UnicodeEncodeError:
        error_output = error_output.encode('utf-8', errors='replace').decode('utf-8')
    
    print(json.dumps({{
        "error": traceback.format_exc(),
        "stdout": error_output
    }}, ensure_ascii=False))
""")


def execute_user_code(code: str, shots: int = 1024) -> dict:
    """
    Executes user-provided Qiskit code safely in a subprocess.
    Expects a quantum circuit variable named `qc`.
    """

    script = _runner_script(code, shots)

    tmp_path = None

    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding='utf-8') as tmp:
            tmp.write(script)
            tmp_path = tmp.name

        # Set environment for UTF-8 encoding
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        env['PYTHONUTF8'] = '1'

        # Run subprocess with UTF-8 encoding
        completed = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=env,
            timeout=10
        )

        output = completed.stdout.strip()

        if not output:
            raise ValueError(
                completed.stderr.strip() or "No output returned from execution."
            )

        # Parse last JSON line safely
        try:
            data = json.loads(output.splitlines()[-1])
        except Exception:
            raise ValueError(f"Invalid JSON output:\n{output}")

        # Handle runtime error inside runner
        if isinstance(data, dict) and "error" in data:
            raise ValueError(data["error"])

        return data

    except subprocess.TimeoutExpired:
        raise ValueError("Execution timed out (limit: 10 seconds).")

    finally:
        # Always cleanup temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)