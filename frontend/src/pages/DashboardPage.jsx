import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { tokenStore } from '../utils/token'
import ProjectList from '../components/ProjectList'
import QuantumEditor from '../components/QuantumEditor'
import HistogramChart from '../components/HistogramChart'
import CircuitBuilder from '../components/CircuitBuilder'

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

export default function DashboardPage({ user, setUser }) {
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [code, setCode] = useState(defaultCode)
  const [templates, setTemplates] = useState([])
  const [result, setResult] = useState(null)
  const [shots, setShots] = useState(1024)
  const [aiPrompt, setAiPrompt] = useState('Explain how to build a Bell pair in Qiskit.')
  const [aiResponse, setAiResponse] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiRunning, setAiRunning] = useState(false)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)

  const loadProjects = async () => {
    const { data } = await api.get('/projects')
    setProjects(data)
    if (data.length > 0 && !activeProject) {
      setActiveProject(data[0])
      setCode(data[0].code || defaultCode)
    }
  }

  const loadTemplates = async () => {
    const { data } = await api.get('/quantum/templates')
    setTemplates(data)
  }

  useEffect(() => {
    loadProjects()
    loadTemplates()
  }, [])

  const createProject = async () => {
    const name = prompt('Project name:')
    if (!name) return
    const { data } = await api.post('/projects', { name, description: '', code: defaultCode })
    setProjects((prev) => [data, ...prev])
    setActiveProject(data)
    setCode(data.code)
  }

  const saveProject = async () => {
    if (!activeProject) return
    const { data } = await api.put(`/projects/${activeProject.id}`, {
      name: activeProject.name,
      description: activeProject.description,
      code,
    })
    setActiveProject(data)
    setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)))
  }

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`)
    const filtered = projects.filter((p) => p.id !== id)
    setProjects(filtered)
    if (activeProject?.id === id) {
      setActiveProject(filtered[0] || null)
      setCode(filtered[0]?.code || defaultCode)
    }
  }

  const executeCode = async () => {
    setError('')
    setRunning(true)
    try {
      const { data } = await api.post('/quantum/execute', { code, shots: Number(shots) })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Execution failed')
    } finally {
      setRunning(false)
    }
  }

  const generateAi = async () => {
    setAiError('')
    setAiResponse('')
    setAiRunning(true)
    try {
      const { data } = await api.post('/ai/generate', { prompt: aiPrompt, max_tokens: 256 })
      setAiResponse(data.text)
    } catch (err) {
      setAiError(err.response?.data?.detail || 'AI request failed')
    } finally {
      setAiRunning(false)
    }
  }

  const applyTemplate = (id) => {
    const template = templates.find((t) => t.id === id)
    if (template) setCode(template.code)
  }

  const logout = () => {
    tokenStore.clear()
    setUser(null)
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">QaaS Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome, {user.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/learn" className="btn-secondary">Learning</Link>
          <button className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <aside className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Projects</h2>
            <button className="btn-primary" onClick={createProject}>New</button>
          </div>
          <ProjectList
            projects={projects}
            activeId={activeProject?.id}
            onSelect={(project) => {
              setActiveProject(project)
              setCode(project.code || defaultCode)
            }}
            onDelete={deleteProject}
          />
        </aside>

        <main className="lg:col-span-9 space-y-4">
          <CircuitBuilder onApply={setCode} />
          <div className="card space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <select className="input max-w-xs" onChange={(e) => applyTemplate(e.target.value)} defaultValue="">
                <option value="" disabled>Load template</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input className="input w-28" type="number" value={shots} min={1} max={8192} onChange={(e) => setShots(e.target.value)} />
              <button className="btn-secondary" onClick={saveProject}>Save</button>
              <button className="btn-primary" onClick={executeCode} disabled={running}>{running ? 'Running...' : 'Run'}</button>
            </div>
            <QuantumEditor code={code} setCode={setCode} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="card">
              <h3 className="font-medium mb-2">Histogram</h3>
              <HistogramChart counts={result?.counts} />
            </section>
            <section className="card space-y-3">
              <h3 className="font-medium">Execution Output</h3>
              {error && <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>}
              <pre className="bg-slate-950 p-3 rounded text-xs overflow-auto max-h-56">{JSON.stringify(result, null, 2)}</pre>
              {result?.circuit_text && (
                <pre className="bg-slate-950 p-3 rounded text-xs overflow-auto max-h-56">{result.circuit_text}</pre>
              )}
            </section>
          </div>

          <section className="card space-y-3">
            <h3 className="font-medium">AI Assistant</h3>
            <textarea
              className="input w-full min-h-[120px] resize-none"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask the AI to generate or explain a Qiskit circuit."
            />
            {aiError && <p className="text-red-400 text-sm whitespace-pre-wrap">{aiError}</p>}
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={generateAi} disabled={aiRunning}>
                {aiRunning ? 'Thinking...' : 'Ask AI'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setAiPrompt('Explain how to build a Bell pair in Qiskit.')}
              >
                Example
              </button>
            </div>
            {aiResponse && (
              <pre className="bg-slate-950 p-3 rounded text-xs overflow-auto max-h-80 whitespace-pre-wrap">{aiResponse}</pre>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
