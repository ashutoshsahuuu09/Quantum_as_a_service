# Fine-tune Data for Ollama

Place your custom training examples here in JSONL format.

## Format

Each line must be a valid JSON object with:

- `prompt`: the input or instruction
- `completion`: the desired model output

Example:

```json
{"prompt":"Generate a Qiskit circuit that creates a Bell pair.","completion":"from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\nprint(qc)"}
```

## Fine-tuning command

```powershell
ollama fine-tune llama3 --dataset ./fine-tune-data/example_data.jsonl --name qaas-llama3
```
