import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function HistogramChart({ counts }) {
  const data = useMemo(() => ({
    labels: Object.keys(counts || {}),
    datasets: [
      {
        label: 'Counts',
        data: Object.values(counts || {}),
        backgroundColor: '#06b6d4',
      },
    ],
  }), [counts])

  if (!counts || Object.keys(counts).length === 0) {
    return <div className="text-sm text-slate-400">No counts to visualize yet.</div>
  }

  return <Bar data={data} />
}
