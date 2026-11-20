import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TOOLS } from '@/config/tools.js'
import { useEvents } from '@/hooks/useEvents.js'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Libellés français des statuts documentés pour un job.
const STATUS_LABELS = {
  queued: 'En attente',
  running: 'En cours',
  done: 'Terminé',
  failed: 'Échec',
}

// Page générique : un seul écran pour lancer chacun des outils documentés.
export default function ToolPage() {
  const { tool } = useParams()
  const { reload } = useMeContext()
  const [files, setFiles] = useState([])
  const [jobId, setJobId] = useState(null)
  const [localError, setLocalError] = useState(null)

  const { createJob, loading: creating, error: createError } = useJobsManager({ onSuccess: reload })
  const { data: job, loading: jobLoading, error: jobError, reload: reloadJob } = useJob(jobId)
  const { data: result, loading: downloading, error: downloadError, download } = useJobDownload()
  const { sendEvents } = useEvents()
  const reportedRef = useRef(null)

  // Envoie un événement documenté sans exposer de champs supplémentaires.
  const trackEvent = useCallback(
    (name, props) => sendEvents({ name, props }),
    [sendEvents],
  )

  const toolInfo = TOOLS.find((item) => item.tool === tool)
  const status = job?.status
  const progress = typeof job?.progress === 'number' ? job.progress : 0

  // Interroge le statut toutes les secondes jusqu'à un état terminal.
  useEffect(() => {
    if (!jobId || status === 'done' || status === 'failed') {
      return undefined
    }

    const timer = window.setInterval(() => {
      reloadJob()
    }, 1000)

    return () => window.clearInterval(timer)
  }, [jobId, status, reloadJob])

  // Notifie une seule fois les états terminaux du job via la route événementielle documentée.
  useEffect(() => {
    if (!jobId || (status !== 'done' && status !== 'failed')) {
      return undefined
    }

    const key = `${jobId}:${status}`
    if (reportedRef.current === key) {
      return undefined
    }
    reportedRef.current = key

    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return trackEvent(
          status === 'done' ? 'tool_run_completed' : 'tool_run_failed',
          { tool: toolInfo?.tool ?? tool },
        )
      }
      return null
    })

    return () => {
      active = false
    }
  }, [jobId, status, tool, toolInfo?.tool, trackEvent])

  if (!toolInfo) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Outil inconnu</h1>
        <p className="mt-2 text-sm text-slate-600">Cet outil ne fait pas partie du catalogue.</p>
        <Link to="/" className="mt-6 inline-block text-sky-600 hover:text-sky-700">
          Retour aux outils
        </Link>
      </section>
    )
  }

  // Crée le job avec les options par défaut documentées par l'API.
  async function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (files.length === 0) {
      setLocalError('Sélectionnez au moins un fichier.')
      return
    }

    const payload = await createJob(files, toolInfo.tool, {})
    if (!payload?.id) {
      trackEvent('tool_run_failed', { tool: toolInfo.tool })
      setLocalError('Le job a été créé mais aucun identifiant n’a été renvoyé.')
      return
    }

    trackEvent('tool_started', { tool: toolInfo.tool, files: files.length })
    setJobId(String(payload.id))
  }

  return (

    <section className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="text-sm text-sky-600 hover:text-sky-700">
        ← Tous les outils
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <p className="text-sm font-medium text-sky-600">{toolInfo.category}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{toolInfo.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{toolInfo.description}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="job-files" className="block text-sm font-medium text-slate-700">
            Fichiers à traiter
          </label>
          <input
            id="job-files"
            type="file"
            multiple
            required
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          />
          <p className="mt-2 text-xs text-slate-500">
            Les options avancées ne sont pas exposées : le job est lancé avec la valeur par défaut.
          </p>

          <button
            type="submit"
            disabled={creating || files.length === 0}
            className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? 'Création du job…' : 'Lancer le traitement'}
          </button>
        </form>

        {(localError || createError) && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {localError ?? createError.message}
          </p>
        )}
      </div>

      {jobId && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Suivi du job</h2>
          <p className="mt-2 text-sm text-slate-600">
            Identifiant : <span className="font-mono text-slate-600">{jobId}</span>
          </p>

          {jobLoading && !job && <p className="mt-4 text-sm text-slate-600">Chargement du statut…</p>}
          {jobError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {jobError.message}
            </p>
          )}

          {job && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{STATUS_LABELS[status] ?? status}</span>
                <span>{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Progression du job"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"
              >
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
              </div>

              {status === 'failed' && job.error && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {job.error.message ?? 'Le traitement a échoué.'}
                </p>
              )}

              {status === 'done' && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => download(jobId)}
                    disabled={downloading}
                    className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                  >
                    {downloading ? 'Récupération…' : 'Récupérer le résultat'}
                  </button>
                  {downloadError && (
                    <p role="alert" className="mt-3 text-sm text-red-700">
                      {downloadError.message}
                    </p>
                  )}
                  {result && (
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
