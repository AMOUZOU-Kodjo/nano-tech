import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const STATUS_LABELS = {
  queued: 'En attente',
  running: 'En cours',
  done: 'Terminé',
  failed: 'Échec',
}

const STATUS_STYLES = {
  queued: 'bg-slate-100 text-slate-700',
  running: 'bg-sky-50 text-sky-700',
  done: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return '—'
  }
  if (bytes < 1024) {
    return `${bytes} o`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function decodeFileName(value) {
  if (typeof value !== 'string' || !value) {
    return ''
  }
  if (!/[\u00c2-\u00c3][\u0080-\u00bf]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff)
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    const roundTrip = new TextEncoder().encode(decoded)

    if (roundTrip.every((byte, index) => byte === bytes[index])) {
      return decoded
    }
    return value
  } catch {
    return value
  }
}

function safeDownloadName(value) {
  return value.replace(/[\\/:*?"<>|]/g, '_') || 'resultat'
}

function formatBoolean(value) {
  if (typeof value !== 'boolean') {
    return '—'
  }
  return value ? 'oui' : 'non'
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
  const [downloadedFileKey, setDownloadedFileKey] = useState('')
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
  const resultFiles = Array.isArray(job.data?.result?.files) ? job.data.result.files : []

  function handlePrevious() {
    setSelected('')
    setDownloadedFileKey('')
    setOffset((current) => Math.max(0, current - limit))
  }

  function handleNext() {
    if (items.length < limit) {
      return
    }
    setSelected('')
    setDownloadedFileKey('')
    setOffset((current) => current + limit)
  }

  async function handleDownloadResult(file, index) {
    const payload = await jobDownload.download(selected, file)

    if (!(payload instanceof Blob)) {
      return
    }

    const name = decodeFileName(file?.name) || `resultat-${selected}-${index + 1}`
    const fileName = safeDownloadName(name)
    const url = URL.createObjectURL(payload)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    setDownloadedFileKey(`${selected}:${file?.file_id ?? index}`)
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
                onClick={() => {
                  setSelected(item.id)
                  setDownloadedFileKey('')
                }}
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
                setDownloadedFileKey('')
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
          {selected && job.data && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{job.data.tool || 'Outil inconnu'}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{job.data.id || selected}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[job.data.status] ?? STATUS_STYLES.queued}`}>
                  {STATUS_LABELS[job.data.status] ?? job.data.status ?? 'En attente'}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Progression</span>
                  <span>{typeof job.data.progress === 'number' ? Math.min(100, Math.max(0, job.data.progress)) : 0}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Progression du job"
                  aria-valuenow={typeof job.data.progress === 'number' ? Math.min(100, Math.max(0, job.data.progress)) : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"
                >
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${typeof job.data.progress === 'number' ? Math.min(100, Math.max(0, job.data.progress)) : 0}%` }}
                  />
                </div>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Créé le</dt>
                  <dd className="mt-1 text-sm text-slate-800">{formatDate(job.data.created_at)}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Terminé le</dt>
                  <dd className="mt-1 text-sm text-slate-800">{formatDate(job.data.finished_at)}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Taille d’entrée</dt>
                  <dd className="mt-1 text-sm text-slate-800">{formatBytes(job.data.input_bytes)}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Objectif atteint</dt>
                  <dd className="mt-1 text-sm text-slate-800">{formatBoolean(job.data.result?.target_met ?? job.data.target_met)}</dd>
                </div>
              </dl>

              {resultFiles.length > 0 && (
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fichiers de résultat</p>
                  <ul className="mt-2 space-y-2">
                    {resultFiles.map((file, index) => {
                      const name = decodeFileName(file?.name) || `Fichier ${index + 1}`
                      const fileKey = `${selected}:${file?.file_id ?? index}`

                      return (
                        <li key={file?.file_id ?? `${name}-${index}`} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 flex-1 truncate text-slate-800" title={name}>{name}</span>
                          <span className="shrink-0 text-xs text-slate-500">{formatBytes(file?.size_bytes)}</span>
                          <button
                            type="button"
                            onClick={() => handleDownloadResult(file, index)}
                            disabled={job.data?.status !== 'done' || jobDownload.loading}
                            className="shrink-0 rounded-lg border border-sky-300 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {jobDownload.loading && downloadedFileKey === fileKey ? 'Téléchargement…' : 'Télécharger'}
                          </button>
                          {downloadedFileKey === fileKey && !jobDownload.error && !jobDownload.loading && (
                            <span className="w-full text-xs text-emerald-700">Téléchargement lancé.</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {job.data.quality_warning?.message && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{job.data.quality_warning.message}</p>
              )}
              {job.data.error?.message && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{job.data.error.message}</p>
              )}
            </div>
          )}

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
            </div>
          )}

          {jobDownload.error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {jobDownload.error.message}
            </p>
          )}
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
