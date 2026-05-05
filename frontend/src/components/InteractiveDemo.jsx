import { useState } from 'react'
import api from '../services/api'
import QuantumEditor from './QuantumEditor'

export default function InteractiveDemo({ type = 'qubit-sim', onClose }) {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [guidance, setGuidance] = useState('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const demos = {
    'qubit-sim': {
      title: 'Create Your First Quantum Circuit',
      description: 'Build a quantum circuit step by step with AI guidance',
      steps: [
        {
          title: 'Step 1: Import Qiskit',
          instruction: 'Import the QuantumCircuit class from qiskit',
          hint: 'Use: from qiskit import QuantumCircuit',
          validate: (code) => code.includes('from qiskit import QuantumCircuit'),
          expectedCode: 'from qiskit import QuantumCircuit',
          starter: ''
        },
        {
          title: 'Step 2: Create a Quantum Circuit',
          instruction: 'Create a quantum circuit with 1 qubit and 1 classical bit',
          hint: 'Create a variable named qc with QuantumCircuit(1, 1)',
          validate: (code) => code.includes('qc = QuantumCircuit(1, 1)'),
          expectedCode: 'qc = QuantumCircuit(1, 1)',
          starter: 'from qiskit import QuantumCircuit\n'
        },
        {
          title: 'Step 3: Apply Hadamard Gate',
          instruction: 'Apply a Hadamard gate to create superposition',
          hint: 'Use qc.h(0) to apply Hadamard to qubit 0',
          validate: (code) => code.includes('qc.h(0)'),
          expectedCode: 'qc.h(0)',
          starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1, 1)\n'
        },
        {
          title: 'Step 4: Measure the Qubit',
          instruction: 'Add a measurement to extract classical result',
          hint: 'Use qc.measure(0, 0) to measure qubit 0 to classical bit 0',
          validate: (code) => code.includes('qc.measure(0, 0)'),
          expectedCode: 'qc.measure(0, 0)',
          starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)\n'
        }
      ]
    },
    'bell-test': {
      title: 'Create an Entangled Bell State',
      description: 'Build a Bell state circuit with AI guidance',
      steps: [
        {
          title: 'Step 1: Create Circuit',
          instruction: 'Create a quantum circuit with 2 qubits and 2 classical bits',
          hint: 'Create qc = QuantumCircuit(2, 2)',
          validate: (code) => code.includes('qc = QuantumCircuit(2, 2)'),
          expectedCode: 'qc = QuantumCircuit(2, 2)',
          starter: 'from qiskit import QuantumCircuit\n'
        },
        {
          title: 'Step 2: Hadamard on First Qubit',
          instruction: 'Apply Hadamard gate to first qubit',
          hint: 'Use qc.h(0)',
          validate: (code) => code.includes('qc.h(0)'),
          expectedCode: 'qc.h(0)',
          starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\n'
        },
        {
          title: 'Step 3: Create Entanglement',
          instruction: 'Apply CNOT gate with qubit 0 as control and qubit 1 as target',
          hint: 'Use qc.cx(0, 1) for controlled-X gate',
          validate: (code) => code.includes('qc.cx(0, 1)'),
          expectedCode: 'qc.cx(0, 1)',
          starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\n'
        },
        {
          title: 'Step 4: Measure Both Qubits',
          instruction: 'Measure both qubits to classical bits',
          hint: 'Use qc.measure([0, 1], [0, 1])',
          validate: (code) => code.includes('qc.measure([0, 1], [0, 1])'),
          expectedCode: 'qc.measure([0, 1], [0, 1])',
          starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\n'
        }
      ]
    }
  }

  const currentDemo = demos[type] || demos['qubit-sim']
  const currentStep = currentDemo.steps[step]
  const isLastStep = step === currentDemo.steps.length - 1

  const checkStep = async () => {
    setLoading(true)
    setGuidance('')

    if (!currentStep.validate(code)) {
      // Get AI guidance
      try {
        const { data } = await api.post('/ai/generate', {
          prompt: `The user is learning quantum computing. They are on: "${currentStep.instruction}"\n\nTheir code:\n${code}\n\nExpected code to include: ${currentStep.expectedCode}\n\nProvide a short, encouraging hint (1-2 sentences) to help them complete this step. Be specific about what's missing.`,
          max_tokens: 100
        })
        setGuidance(data.text)
      } catch (err) {
        setGuidance(`Hint: ${currentStep.hint}`)
      }
    } else {
      // Move to next step
      if (isLastStep) {
        setCompleted(true)
        setGuidance('🎉 Congratulations! You completed the demo!')
      } else {
        setStep(step + 1)
        setCode(currentDemo.steps[step + 1].starter)
        setGuidance('✅ Great! Move to the next step.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">{currentDemo.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{currentDemo.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">{currentStep.title}</h3>
              <span className="text-sm text-slate-400">
                Step {step + 1} of {currentDemo.steps.length}
              </span>
            </div>
            <p className="text-slate-300 mb-4">{currentStep.instruction}</p>
            <div className="w-full bg-slate-950 rounded overflow-hidden">
              <QuantumEditor code={code} setCode={setCode} />
            </div>
          </div>

          {guidance && (
            <div className={`p-3 rounded text-sm ${
              guidance.includes('❌') 
                ? 'bg-red-900 text-red-100 border border-red-700'
                : guidance.includes('✅')
                  ? 'bg-green-900 text-green-100 border border-green-700'
                  : 'bg-blue-900 text-blue-100 border border-blue-700'
            }`}>
              {guidance}
            </div>
          )}

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => {
                  setStep(step - 1)
                  setCode(currentDemo.steps[step - 1].starter)
                  setGuidance('')
                }}
                className="btn-secondary"
              >
                ← Back
              </button>
            )}
            <button
              onClick={checkStep}
              disabled={loading || completed}
              className="btn-primary flex-1"
            >
              {loading ? 'Checking...' : completed ? '✅ Completed!' : 'Check Step'}
            </button>
          </div>

          <div className="flex gap-1">
            {currentDemo.steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < step
                    ? 'bg-green-500'
                    : i === step
                      ? 'bg-cyan-500'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
