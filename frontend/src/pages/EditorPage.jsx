import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import QuantumEditor from '../components/QuantumEditor'
import HistogramChart from '../components/HistogramChart'

const defaultCode = `from qiskit import QuantumCircuit
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
`

export default function EditorPage() {
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState(null)
  const [shots, setShots] = useState(1024)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)

  // Check for code in URL params (from learning page)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const prefillCode = urlParams.get('code')
    if (prefillCode) {
      setCode(decodeURIComponent(prefillCode))
    }
  }, [])

  const runCode = async () => {
    setError('')
    setResult(null)
    setRunning(true)
    try {
      const { data } = await api.post('/quantum/execute', { code, shots })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Execution failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quantum Code Editor</h1>
        <div className="flex space-x-4">
          <Link to="/" className="btn-secondary">Dashboard</Link>
          <Link to="/learn" className="btn-secondary">Learning</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-medium">Code Editor</h2>
          <QuantumEditor code={code} setCode={setCode} />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm">Shots:</label>
              <input
                type="number"
                value={shots}
                onChange={(e) => setShots(parseInt(e.target.value))}
                className="input w-20"
                min="1"
                max="10000"
              />
            </div>
            <button
              onClick={runCode}
              disabled={running}
              className="btn-primary"
            >
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>
          {error && (
            <div className="space-y-3">
              <div className="bg-red-900 border border-red-700 p-3 rounded">
                <p className="text-red-200 font-medium mb-2">❌ Error:</p>
                <p className="text-red-100 text-sm whitespace-pre-wrap">{error}</p>
              </div>
              {error.includes('not found') && (
                <div className="bg-blue-900 border border-blue-700 p-3 rounded">
                  <p className="text-blue-200 font-medium mb-2">💡 Solution:</p>
                  <p className="text-blue-100 text-sm mb-2">Your code must create a quantum circuit named <code className="bg-blue-950 px-1 py-0.5 rounded">qc</code></p>
                  <p className="text-blue-100 text-xs font-mono bg-blue-950 p-2 rounded mt-1">qc = QuantumCircuit(2, 2)</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-medium">Results</h2>
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Output</h3>
                <pre className="bg-slate-950 p-3 rounded text-xs overflow-auto text-green-400">
                  {result.stdout}
                </pre>
              </div>
              {result.counts && (
                <div>
                  <h3 className="font-medium mb-2">Measurement Counts</h3>
                  <HistogramChart data={result.counts} />
                </div>
              )}
              {result.circuit_text && (
                <div>
                  <h3 className="font-medium mb-2">Circuit Diagram</h3>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-auto">
                    {result.circuit_text}
                  </pre>
                </div>
              )}
            </div>
          )}
          {!result && !error && (
            <div className="space-y-4">
              <p className="text-slate-400">Run your code to see results here</p>
              <div className="bg-slate-900 p-4 rounded text-sm">
                <p className="text-cyan-400 font-medium mb-2">💡 Tip:</p>
                <p className="text-slate-300">Your code must create a quantum circuit named <code className="bg-slate-950 px-1 py-0.5 rounded">qc</code> for execution.</p>
                <p className="text-slate-400 text-xs mt-2">Example: <code className="bg-slate-950 px-1 py-0.5 rounded">qc = QuantumCircuit(2, 2)</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}