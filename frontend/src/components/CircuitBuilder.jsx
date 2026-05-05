import { useState } from 'react'

const gates = ['h(0)', 'x(0)', 'cx(0,1)', 'z(1)']

export default function CircuitBuilder({ onApply }) {
  const [steps, setSteps] = useState([])

  const allowDrop = (e) => e.preventDefault()

  const dropGate = (e) => {
    e.preventDefault()
    const gate = e.dataTransfer.getData('text/gate')
    if (gate) setSteps((prev) => [...prev, gate])
  }

  const apply = () => {
    const gateLines = steps.map((g) => `qc.${g}`).join('\n')
    onApply(`from qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\n${gateLines}\nqc.measure([0, 1], [0, 1])\n\nbackend = AerSimulator()\njob = backend.run(qc, shots=1024)\nresult = job.result()\ncounts = result.get_counts()\nprint(counts)\n`)
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-medium">Basic Drag-and-Drop Circuit Builder</h3>
      <div className="flex flex-wrap gap-2">
        {gates.map((gate) => (
          <div
            key={gate}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/gate', gate)}
            className="px-2 py-1 rounded bg-slate-800 border border-slate-700 cursor-grab"
          >
            {gate}
          </div>
        ))}
      </div>
      <div onDragOver={allowDrop} onDrop={dropGate} className="min-h-20 p-3 rounded border border-dashed border-slate-600 text-sm">
        Drop gates here: {steps.join(' -> ') || 'empty'}
      </div>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => setSteps([])}>Clear</button>
        <button className="btn-primary" onClick={apply} disabled={steps.length === 0}>Apply to Editor</button>
      </div>
    </div>
  )
}
