TEMPLATES = [
    {
        "id": "bell",
        "name": "Bell State",
        "code": """from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

backend = AerSimulator()
job = backend.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()
print(counts)
""",
    },
    {
        "id": "hadamard",
        "name": "Hadamard Superposition",
        "code": """from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

backend = AerSimulator()
job = backend.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()
print(counts)
""",
    },
    {
        "id": "grover",
        "name": "Grover (2-qubit toy)",
        "code": """from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h([0, 1])
qc.cz(0, 1)    # Oracle marking |11>
qc.h([0, 1])   # Diffusion (simplified)
qc.z([0, 1])
qc.h([0, 1])
qc.measure([0, 1], [0, 1])

backend = AerSimulator()
job = backend.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()
print(counts)
""",
    },
]
