import ast

ALLOWED_IMPORTS = {
    "qiskit",
    "qiskit_aer",
    "math",
    "numpy",
}

DISALLOWED_CALL_NAMES = {
    "eval",
    "exec",
    "compile",
    "open",
    "__import__",
    "input",
}

DISALLOWED_ATTR = {
    "system",
    "popen",
    "remove",
    "unlink",
    "rmdir",
}


def validate_code(code: str) -> None:
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            modules = []
            if isinstance(node, ast.Import):
                modules = [name.name.split(".")[0] for name in node.names]
            else:
                modules = [(node.module or "").split(".")[0]]
            for mod in modules:
                if mod and mod not in ALLOWED_IMPORTS:
                    raise ValueError(f"Import '{mod}' is not allowed")

        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in DISALLOWED_CALL_NAMES:
                raise ValueError(f"Call to '{node.func.id}' is not allowed")
            if isinstance(node.func, ast.Attribute) and node.func.attr in DISALLOWED_ATTR:
                raise ValueError(f"Attribute '{node.func.attr}' is not allowed")
