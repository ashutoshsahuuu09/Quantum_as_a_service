import { useState } from 'react'
import { Link } from 'react-router-dom'
import InteractiveDemo from '../components/InteractiveDemo'

export default function LearningPage() {
  const [level, setLevel] = useState('basic')
  const [completedLevels, setCompletedLevels] = useState(new Set())
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoType, setDemoType] = useState('qubit-sim')

  const markCompleted = (lvl) => {
    setCompletedLevels(prev => new Set([...prev, lvl]))
  }

  const levels = {
    basic: {
      title: 'Basic Level',
      description: 'Introduction to quantum computing fundamentals',
      prerequisites: [],
      content: [
        {
          title: 'What is Quantum Computing?',
          text: 'Quantum computing uses quantum mechanics principles to perform computations. Unlike classical computers that use bits (0 or 1), quantum computers use qubits that can be in superposition - both 0 and 1 at the same time.',
          code: `# A classical bit can be 0 or 1
bit = 0  # or 1

# A qubit can be both 0 and 1 simultaneously
# This is represented mathematically as:
# |ψ⟩ = α|0⟩ + β|1⟩
# where α and β are complex amplitudes`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `# Basic qubit concept
print("A qubit can be in superposition!")` },
            { label: 'Watch Video', action: 'video', url: 'https://www.youtube.com/results?search_query=what+is+quantum+computing' }
          ]
        },
        {
          title: 'Qubits vs Classical Bits',
          text: 'Classical bits are deterministic - they are either 0 or 1. Qubits are probabilistic and can exist in multiple states until measured. When measured, a qubit collapses to either 0 or 1 with certain probabilities.',
          code: `# Classical bit: definite state
classical_bit = 0

# Qubit: superposition state (conceptually)
# In Qiskit, we create qubits in circuits
from qiskit import QuantumCircuit
qc = QuantumCircuit(1)  # 1 qubit
# Initially |0⟩, but we can put it in superposition`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(1)
print("Qubit created in |0⟩ state")` },
            { label: 'Interactive Demo', action: 'demo', type: 'qubit-sim' }
          ]
        },
        {
          title: 'Measurement',
          text: 'Measurement is how we extract classical information from quantum states. When you measure a qubit, it collapses from superposition to a definite 0 or 1. The probability of each outcome depends on the amplitudes.',
          code: `# Measuring a qubit in superposition
from qiskit import QuantumCircuit
qc = QuantumCircuit(1, 1)  # 1 qubit, 1 classical bit
qc.h(0)  # Hadamard gate creates superposition
qc.measure(0, 0)  # Measure qubit 0 to classical bit 0
# 50% chance of 0, 50% chance of 1`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)
print("Circuit with measurement created")` },
            { label: 'Run Simulation', action: 'simulate' }
          ]
        }
      ],
      quiz: [
        {
          question: 'What is the main difference between a classical bit and a qubit?',
          options: ['Bits are faster', 'Qubits can be in superposition', 'Bits use electricity', 'Qubits are smaller'],
          answer: 1
        },
        {
          question: 'What happens when you measure a qubit?',
          options: ['It stays in superposition', 'It collapses to 0 or 1', 'It becomes a bit', 'It disappears'],
          answer: 1
        }
      ]
    },
    standard: {
      title: 'Standard Level',
      description: 'Quantum gates, circuits, and entanglement',
      prerequisites: ['basic'],
      content: [
        {
          title: 'Quantum Gates',
          text: 'Quantum gates are operations that manipulate qubits. They are represented as unitary matrices. Common gates include Pauli gates (X, Y, Z), Hadamard (H), and controlled gates.',
          code: `# Basic quantum gates
from qiskit import QuantumCircuit
qc = QuantumCircuit(1)

# X gate (NOT gate) - flips |0⟩ to |1⟩ and vice versa
qc.x(0)

# H gate (Hadamard) - creates superposition
qc.h(0)

# Z gate - phase flip
qc.z(0)`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(1)
qc.x(0)
qc.h(0)
qc.z(0)
print("Applied X, H, Z gates")` },
            { label: 'Gate Reference', action: 'reference', topic: 'gates' }
          ]
        },
        {
          title: 'Quantum Circuits',
          text: 'A quantum circuit is a sequence of quantum gates applied to qubits. Circuits are read left to right, with time flowing from left to right. Measurements at the end extract classical results.',
          code: `# Simple quantum circuit
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)  # 2 qubits, 2 classical bits

# Apply Hadamard to first qubit
qc.h(0)

# Apply CNOT (controlled-X) gate
qc.cx(0, 1)  # control qubit 0, target qubit 1

# Measure both qubits
qc.measure([0, 1], [0, 1])`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])
print("Bell state circuit created")` },
            { label: 'Visualize Circuit', action: 'visualize' }
          ]
        },
        {
          title: 'Entanglement',
          text: 'Entanglement is a quantum phenomenon where qubits become correlated. Measuring one qubit instantly determines the state of the other, regardless of distance. This is the basis for quantum teleportation and quantum communication.',
          code: `# Creating entangled qubits (Bell state)
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)

# Put first qubit in superposition
qc.h(0)

# Entangle qubits with CNOT
qc.cx(0, 1)

# Measure - outcomes will be correlated
qc.measure([0, 1], [0, 1])
# Possible outcomes: 00 or 11 (never 01 or 10)`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])
print("Entangled Bell state created")` },
            { label: 'Experiment', action: 'experiment', type: 'bell-test' }
          ]
        }
      ],
      quiz: [
        {
          question: 'Which gate creates superposition?',
          options: ['X gate', 'Z gate', 'Hadamard gate', 'CNOT gate'],
          answer: 2
        },
        {
          question: 'What does entanglement allow?',
          options: ['Faster calculations', 'Correlated measurements', 'Infinite storage', 'Time travel'],
          answer: 1
        }
      ]
    },
    advanced: {
      title: 'Advanced Level',
      description: 'Quantum algorithms and complex concepts',
      prerequisites: ['standard'],
      content: [
        {
          title: 'Quantum Algorithms',
          text: 'Quantum algorithms exploit quantum properties to solve problems faster than classical computers. Grover\'s algorithm searches unsorted databases quadratically faster. Shor\'s algorithm can factor large numbers exponentially faster.',
          code: `# Grover's algorithm concept (simplified)
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator
from qiskit.primitives import Sampler

# For demonstration - searching for |11⟩
oracle = QuantumCircuit(2)
oracle.cz(0, 1)  # Marks |11⟩

grover_op = GroverOperator(oracle)
qc = QuantumCircuit(2, 2)
qc.h([0, 1])  # Initial superposition
qc.compose(grover_op, inplace=True)
qc.measure_all()`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `# Simplified Grover search
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h([0, 1])
# Oracle and diffusion would go here
qc.measure_all()
print("Grover algorithm structure")` },
            { label: 'Learn More', action: 'learn', topic: 'grover' }
          ]
        },
        {
          title: 'Quantum Fourier Transform',
          text: 'QFT is a quantum version of the discrete Fourier transform. It\'s a key component in many quantum algorithms, including Shor\'s factoring algorithm and quantum phase estimation.',
          code: `# Quantum Fourier Transform
from qiskit import QuantumCircuit
from qiskit.circuit.library import QFT

qc = QuantumCircuit(3)
# Apply QFT to 3 qubits
qft = QFT(3)
qc.compose(qft, inplace=True)

# QFT transforms |x⟩ to superposition of |y⟩
# where y represents frequencies`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `from qiskit.circuit.library import QFT
qc = QuantumCircuit(3)
qft = QFT(3)
qc.compose(qft, inplace=True)
print("QFT circuit created")` },
            { label: 'Mathematical Background', action: 'math', topic: 'qft' }
          ]
        },
        {
          title: 'Error Correction Basics',
          text: 'Quantum computers are susceptible to noise and decoherence. Quantum error correction uses redundancy to protect quantum information. The simplest example is the 3-qubit bit-flip code.',
          code: `# Basic error correction concept
from qiskit import QuantumCircuit

# 3-qubit bit-flip code
qc = QuantumCircuit(3, 3)

# Encode logical |0⟩ as |000⟩
# (In practice, more complex encoding)

# Syndrome measurement would detect errors
# Correction would fix them

# This is a simplified illustration`,
          options: [
            { label: 'Try in Editor', action: 'editor', code: `# Error correction concept
from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
# Encoding and syndrome measurement
print("Error correction circuit structure")` },
            { label: 'Research Papers', action: 'research', topic: 'qec' }
          ]
        }
      ],
      quiz: [
        {
          question: 'What is Grover\'s algorithm used for?',
          options: ['Factoring numbers', 'Searching databases', 'Sorting data', 'Encryption'],
          answer: 1
        },
        {
          question: 'What does QFT stand for?',
          options: ['Quantum Fast Transform', 'Quantum Fourier Transform', 'Quick Function Test', 'Quantum Field Theory'],
          answer: 1
        }
      ]
    }
  }

  const handleOption = (option, code) => {
    if (option.action === 'editor') {
      // Open editor with pre-filled code
      const encodedCode = encodeURIComponent(code)
      window.open(`/editor?code=${encodedCode}`, '_blank')
    } else if (option.action === 'video') {
      window.open(option.url, '_blank')
    } else if (option.action === 'demo') {
      // Open interactive demo
      setDemoType(option.type || 'qubit-sim')
      setDemoOpen(true)
    } else {
      alert(`${option.label} feature coming soon!`)
    }
  }

  const takeQuiz = (quiz) => {
    let score = 0
    let completed = true
    
    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i]
      const answer = prompt(
        `Question ${i + 1}/${quiz.length}:\n\n${q.question}\n\n${q.options.map((opt, j) => `${j + 1}. ${opt}`).join('\n')}\n\nEnter your answer (1-${q.options.length}):`,
        ''
      )
      
      // If user cancels, stop the quiz
      if (answer === null) {
        alert('Quiz cancelled.')
        completed = false
        break
      }
      
      // Check if answer is correct
      if (parseInt(answer) - 1 === q.answer) {
        score++
      }
    }
    
    if (!completed) return
    
    const percentage = Math.round((score / quiz.length) * 100)
    const passed = score >= Math.ceil(quiz.length / 2) // Need 50% to pass
    
    if (passed) {
      alert(`🎉 Quiz complete! Score: ${score}/${quiz.length} (${percentage}%)\n\n✅ Level ${levels[level].title} unlocked!`)
      markCompleted(level)
      
      // Auto-advance to next level if available
      const levelKeys = Object.keys(levels)
      const nextLevelIndex = levelKeys.indexOf(level) + 1
      if (nextLevelIndex < levelKeys.length) {
        const nextLevel = levelKeys[nextLevelIndex]
        setTimeout(() => {
          setLevel(nextLevel)
        }, 500)
      }
    } else {
      alert(`Score: ${score}/${quiz.length} (${percentage}%)\n\nYou need at least 50% to pass. Try again!`)
    }
  }

  const canAccessLevel = (lvl) => {
    return levels[lvl].prerequisites.every(prereq => completedLevels.has(prereq))
  }

  const getLevelStatus = (lvl) => {
    if (completedLevels.has(lvl)) return 'completed'
    if (canAccessLevel(lvl)) return 'available'
    return 'locked'
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Quantum Computing Learning Path</h1>
        <Link to="/" className="btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="flex space-x-4 mb-6">
        {Object.keys(levels).map((lvl) => {
          const status = getLevelStatus(lvl)
          return (
            <button
              key={lvl}
              onClick={() => {
                if (status === 'locked') {
                  alert(`Complete ${levels[lvl].prerequisites.join(' and ')} level(s) first!`)
                } else {
                  setLevel(lvl)
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                level === lvl
                  ? 'bg-cyan-600 text-white'
                  : status === 'completed'
                    ? 'bg-green-700 text-white hover:bg-green-600'
                    : status === 'available'
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-800 text-slate-500 hover:bg-slate-700 cursor-pointer'
              }`}
            >
              {levels[lvl].title}
              {status === 'completed' && ' ✓'}
              {status === 'locked' && ' 🔒'}
            </button>
          )
        })}
      </div>

      <div className="card">
        {getLevelStatus(level) === 'locked' ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-medium mb-2">Level Locked</h2>
            <p className="text-slate-400 mb-4">
              Complete the {levels[level].prerequisites.join(' and ')} level(s) first to unlock this content.
            </p>
            <button
              onClick={() => setLevel(levels[level].prerequisites[0] || 'basic')}
              className="btn-primary"
            >
              Go to {levels[levels[level].prerequisites[0] || 'basic'].title}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium">{levels[level].title}</h2>
                <p className="text-slate-400">{levels[level].description}</p>
              </div>
              <div className="flex space-x-2">
                {!completedLevels.has(level) ? (
                  <button
                    onClick={() => takeQuiz(levels[level].quiz)}
                    className="btn-primary"
                  >
                    Take Quiz
                  </button>
                ) : (
                  <>
                    <span className="text-green-400 font-medium flex items-center">✓ Completed</span>
                    {(() => {
                      const levelKeys = Object.keys(levels)
                      const nextLevelIndex = levelKeys.indexOf(level) + 1
                      if (nextLevelIndex < levelKeys.length) {
                        return (
                          <button
                            onClick={() => setLevel(levelKeys[nextLevelIndex])}
                            className="btn-primary"
                          >
                            Next Level →
                          </button>
                        )
                      }
                      return null
                    })()}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {levels[level].content.map((item, index) => (
                <div key={index} className="border-l-4 border-cyan-500 pl-6">
                  <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">{item.text}</p>
                  <div className="bg-slate-950 p-4 rounded-lg mb-4">
                    <pre className="text-xs overflow-auto text-cyan-100">
                      <code>{item.code}</code>
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleOption(option, item.code)}
                        className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 text-sm"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-slate-800 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Ready to Experiment?</h3>
              <p className="text-slate-300 mb-4">
                Try these concepts in the Quantum Editor. Start with simple circuits and gradually build complexity.
              </p>
              <Link to="/editor" className="btn-primary">Open Quantum Editor</Link>
            </div>
          </>
        )}
      </div>
      {demoOpen && (
        <InteractiveDemo
          type={demoType}
          onClose={() => setDemoOpen(false)}
        />
      )}
    </div>
  )
}
