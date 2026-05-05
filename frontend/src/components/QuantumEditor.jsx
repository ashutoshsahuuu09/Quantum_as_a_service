import Editor from '@monaco-editor/react'

export default function QuantumEditor({ code, setCode }) {
  return (
    <Editor
      height="420px"
      defaultLanguage="python"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || '')}
      options={{ minimap: { enabled: false }, fontSize: 14 }}
    />
  )
}
