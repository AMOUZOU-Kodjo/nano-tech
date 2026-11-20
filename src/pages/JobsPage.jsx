import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  return <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// Normalise une liste non typée pour afficher au minimum un identifiant cliquable.
function normalizeJobs(payload) {
  const raw = Array.isArray(payload) ? payload : (payload?.jobs ?? payload?.data ?? [])
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const id = item.id ?? item.job_id
      return {
        id: id === undefined || id === null ? '' : String(id),
        tool: item.tool ?? '',
        status: item.status ?? '',
      }
    })
    .filter((item) => item.id)
}

// Page historique : liste paginée des jobs, détail et résultat téléchargeable.
export default function JobsPage() {
  const { isGuest, loading: meLoading } = useMeContext()
  const manager = useJobsManager()
  const { jobs, loading, error, listJobs: fetchJobs } = manager
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState('')
  const job = useJob(selected)
  const jobDownload = useJobDownload()

  // Diffère le chargement pour ne pas modifier l'état pendant l'effet lui-même.
  useEffect(() => {
    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return fetchJobs({ limit, offset })
      }
      return null
    })

    return () => {
      active = false
    }
  }, [limit, offset, fetchJobs])

  const items = normalizeJobs(jobs)

  function handlePrevious() {
    setSelected('')
    setOffset((current) => Math.max(0, current - limit))
  }

  function handleNext() {
    if (items.length < limit) {
      return
    }
    setSelected('')
    setOffset((current) => current + limit)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Historique des jobs</h1>
      <p className="mt-2 text-sm text-slate-600">Traitements lancés depuis les outils et résultats disponibles.</p>

      {!meLoading && isGuest && (
        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          Vous consultez en invité. <Link to="/login" className="text-sky-600 hover:text-sky-700">Connectez-vous</Link> pour voir vos jobs.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Jobs récents</h2>
          {loading && !items.length && <p className="mt-4 text-sm text-slate-600">Chargement…</p>}
          {!loading && !items.length && <p className="mt-4 text-sm text-slate-600">Aucun job disponible.</p>}

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                className={`block w-full rounded-lg border p-3 text-left text-sm transition ${
                  selected === item.id
                    ? 'border-sky-500 bg-sky-50 text-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="block font-medium">{item.tool || item.id}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {item.id}
                  {item.status ? ` · ${item.status}` : ''}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={offset === 0 || loading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={items.length < limit || loading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
            >
              Suivant
            </button>
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value))
                setOffset(0)
                setSelected('')
              }}
              className="rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-900"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Détail du job</h2>
          {!selected && <p className="mt-4 text-sm text-slate-600">Sélectionnez un job pour voir son état.</p>}
          {selected && job.loading && <p className="mt-4 text-sm text-slate-600">Chargement…</p>}
          {selected && job.error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {job.error.message}
            </p>
          )}
          {selected && job.data && <JsonBlock value={job.data} />}

          {selected && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={job.reload}
                disabled={job.loading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
              >
                Actualiser le statut
              </button>
              <button
                type="button"
                onClick={() => jobDownload.download(selected)}
                disabled={jobDownload.loading}
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
              >
                {jobDownload.loading ? 'Téléchargement…' : 'Télécharger le résultat'}
              </button>
            </div>
          )}

          {jobDownload.error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {jobDownload.error.message}
            </p>
          )}
          {jobDownload.data && <JsonBlock value={jobDownload.data} />}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </section>
  )
}
