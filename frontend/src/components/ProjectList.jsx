export default function ProjectList({ projects, activeId, onSelect, onDelete }) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`card cursor-pointer ${activeId === project.id ? 'border-cyan-500' : ''}`}
          onClick={() => onSelect(project)}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium">{project.name}</h3>
            <button
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project.id)
              }}
            >
              Delete
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">{project.description || 'No description'}</p>
        </div>
      ))}
    </div>
  )
}
