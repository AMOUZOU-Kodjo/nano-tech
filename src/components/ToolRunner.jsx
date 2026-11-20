import { useState } from 'react'
import { useRunTool } from '@/hooks/useRunTool.js'

// Composant de lancement d'outil : saisie d'un identifiant et affichage brut de la réponse 202.
export default function ToolRunner() {
  const [tool, setTool] = useState('')
  const { data, loading, error, runTool } = useRunTool()

  // Soumet l'identifiant saisi ; le schéma de réponse n'étant pas documenté, on l'affiche tel quel.
  async function handleSubmit(event) {
    event.preventDefault()

    if (!tool) {
      return
    }

    await runTool(tool)
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-slate-100">Lancer un outil</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={tool}
          onChange={(event) => setTool(event.target.value)}
          placeholder="Identifiant de l'outil"
          required
          className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
        />
        <button
          type="submit"
          disabled={loading || !tool}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? 'Lancement…' : 'Lancer'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error.message}
        </p>
      )}

      {data !== null && !error && !loading && (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  )
}
