import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiFile,
  FiInfo,
  FiRefreshCw,
} from 'react-icons/fi'
import { TOOLS } from '@/config/tools.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobPreview } from '@/hooks/useJobPreview.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const STATUS_LABELS = {
  queued: { fr: 'En attente', en: 'Queued' },
  running: { fr: 'En cours', en: 'Running' },
  done: { fr: 'Terminé', en: 'Done' },
  failed: { fr: 'Échec', en: 'Failed' },
}

const STATUS_STYLES = {
  queued: 'bg-slate-100 text-slate-700 ring-slate-200',
  running: 'bg-sky-50 text-sky-700 ring-sky-200',
  done: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
}

const STATUS_DOTS = {
  queued: 'bg-slate-400',
  running: 'animate-pulse bg-sky-500',
  done: 'bg-emerald-500',
  failed: 'bg-red-500',
}

const TEXT = {
  title: { fr: 'Historique des traitements', en: 'Processing history' },
  subtitle: {
    fr: 'Retrouvez vos traitements, leur avancement et leurs résultats.',
    en: 'Find your processing, track its progress and retrieve its results.',
  },
  guestBrowsing: { fr: 'Vous consultez en invité.', en: 'You are browsing as a guest.' },
  signIn: { fr: 'Connectez-vous', en: 'Sign in' },
  toSeeJobs: { fr: 'pour retrouver votre historique.', en: 'to retrieve your history.' },
  recentJobs: { fr: 'Traitements récents', en: 'Recent processing' },
  perPage: { fr: 'Par page', en: 'Per page' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  noJobs: { fr: 'Aucun traitement disponible.', en: 'No processing available.' },
  previous: { fr: 'Précédent', en: 'Previous' },
  next: { fr: 'Suivant', en: 'Next' },
  jobDetail: { fr: 'Détail du traitement', en: 'Processing details' },
  selectJob: {
    fr: 'Sélectionnez un traitement pour voir son état.',
    en: 'Select a processing to see its status.',
  },
  unknownTool: { fr: 'Outil inconnu', en: 'Unknown tool' },
  identifier: { fr: 'Identifiant', en: 'Identifier' },
  progress: { fr: 'Progression', en: 'Progress' },
  jobProgress: { fr: 'Progression du traitement', en: 'Processing progress' },
  createdAt: { fr: 'Créé le', en: 'Created at' },
  finishedAt: { fr: 'Terminé le', en: 'Finished at' },
  inputSize: { fr: 'Taille d’entrée', en: 'Input size' },
  targetMet: { fr: 'Objectif atteint', en: 'Target met' },
  resultFiles: { fr: 'Fichiers de résultat', en: 'Result files' },
  noFiles: { fr: 'Aucun fichier de résultat.', en: 'No result file.' },
  overview: { fr: 'Vue d’ensemble', en: 'Overview' },
  information: { fr: 'Informations', en: 'Information' },
  preview: { fr: 'Aperçu', en: 'Preview' },
  previewTitle: { fr: 'Aperçu du résultat', en: 'Result preview' },
  noPreview: { fr: 'L’aperçu sera disponible une fois le traitement terminé.', en: 'The preview will be available once processing is complete.' },
  previewUnavailable: {
    fr: 'Aperçu indisponible pour ce format.',
    en: 'Preview is not available for this format.',
  },
  file: { fr: 'Fichier', en: 'File' },
  downloading: { fr: 'Téléchargement…', en: 'Downloading…' },
  download: { fr: 'Télécharger', en: 'Download' },
  downloadStarted: { fr: 'Téléchargement lancé.', en: 'Download started.' },
  refreshStatus: { fr: 'Actualiser le statut', en: 'Refresh status' },
  yes: { fr: 'oui', en: 'yes' },
  no: { fr: 'non', en: 'no' },
  doneCount: { fr: 'Terminés', en: 'Completed' },
  runningCount: { fr: 'En cours', en: 'Running' },
  failedCount: { fr: 'Échecs', en: 'Failed' },
}

function formatBytes(bytes, locale) {
  if (!Number.isFinite(bytes)) {
    return '—'
  }
  if (bytes < 1024) {
    return `${bytes} ${locale === 'fr' ? 'o' : 'B'}`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} ${locale === 'fr' ? 'Ko' : 'KB'}`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${locale === 'fr' ? 'Mo' : 'MB'}`
}

function formatDate(value, locale) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
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

function safeDownloadName(value, locale) {
  return value.replace(/[\\/:*?"<>|]/g, '_') || (locale === 'fr' ? 'resultat' : 'result')
}

function formatBoolean(value, t) {
  if (typeof value !== 'boolean') {
    return '—'
  }
  return t(value ? TEXT.yes : TEXT.no)
}

function statusLabel(status, t) {
  if (!status) {
    return t(STATUS_LABELS.queued)
  }
  return t(STATUS_LABELS[status] ?? status)
}

function toolLabel(tool, locale) {
  const found = TOOLS.find((item) => item.tool === tool)
  if (!found) {
    return tool || ''
  }
  return locale === 'en' ? found.nameEn : found.name
}

function shortId(id) {
  if (!id || id.length <= 14) {
    return id
  }
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

function StatusBadge({ status, t }) {
  const key = status || 'queued'
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLES[key] ?? STATUS_STYLES.queued}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[key] ?? STATUS_DOTS.queued}`} />
      {statusLabel(status, t)}
    </span>
  )
}

function SummaryCard({ label, value, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
  }

  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="max-w-full break-words text-right text-sm font-medium text-slate-800">{value}</dd>
    </div>
  )
}

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
        created_at: item.created_at ?? null,
      }
    })
    .filter((item) => item.id)
}

export default function JobsPage() {
  const { locale, t } = useLocale()
  const { isGuest, loading: meLoading } = useMeContext()
  const manager = useJobsManager()
  const { jobs, loading, error, listJobs: fetchJobs } = manager
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState('')
  const [downloadedFileKey, setDownloadedFileKey] = useState('')
  const job = useJob(selected)
  const jobDownload = useJobDownload()

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
  const progress = typeof job.data?.progress === 'number' ? Math.min(100, Math.max(0, job.data.progress)) : 0
  const firstResultFile = resultFiles[0] ?? null
  const { preview, loading: previewLoading } = useJobPreview(selected, firstResultFile)
  const previewName = decodeFileName(firstResultFile?.name)
  const isImagePreview =
    preview?.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(previewName)
  const isPdfPreview = preview?.type === 'application/pdf' || /\.pdf$/i.test(previewName)
  const counts = {
    done: items.filter((item) => item.status === 'done').length,
    running: items.filter((item) => item.status === 'running').length,
    failed: items.filter((item) => item.status === 'failed').length,
  }

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

    const name = decodeFileName(file?.name) || `${locale === 'fr' ? 'resultat' : 'result'}-${selected}-${index + 1}`
    const fileName = safeDownloadName(name, locale)
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
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-100">
            <FiActivity aria-hidden="true" className="h-3 w-3" />
            NanoFile
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{t(TEXT.title)}</h1>
          <p className="mt-2 text-sm text-slate-600">{t(TEXT.subtitle)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <FiClock aria-hidden="true" className="h-4 w-4 text-slate-400" />
          {items.length} {t(TEXT.recentJobs).toLowerCase()}
        </div>
      </header>

      {!meLoading && isGuest && (
        <p className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-800">
          {t(TEXT.guestBrowsing)}{' '}
          <Link to="/login" className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900">
            {t(TEXT.signIn)}
          </Link>{' '}
          {t(TEXT.toSeeJobs)}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <SummaryCard label={t(TEXT.doneCount)} value={counts.done} tone="emerald" />
        <SummaryCard label={t(TEXT.runningCount)} value={counts.running} tone="sky" />
        <SummaryCard label={t(TEXT.failedCount)} value={counts.failed} tone="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.recentJobs)}</h2>
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">{items.length}</span>
          </div>

          {loading && !items.length && <p className="mt-4 text-sm text-slate-600">{t(TEXT.loading)}</p>}
          {!loading && !items.length && <p className="mt-4 text-sm text-slate-600">{t(TEXT.noJobs)}</p>}

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelected(item.id)
                  setDownloadedFileKey('')
                }}
                className={`w-full rounded-xl border p-3.5 text-left transition ${
                  selected === item.id
                    ? 'border-sky-400 bg-sky-50/70 shadow-sm ring-1 ring-sky-100'
                    : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                      <FiActivity aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {toolLabel(item.tool, locale) || item.id}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400" title={item.id}>
                        {shortId(item.id)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} t={t} />
                </div>
                <p className="mt-3 text-[11px] text-slate-400">{formatDate(item.created_at, locale)}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={offset === 0 || loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <FiChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
              {t(TEXT.previous)}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={items.length < limit || loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              {t(TEXT.next)}
              <FiChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
            <label className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              {t(TEXT.perPage)}
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value))
                  setOffset(0)
                  setSelected('')
                  setDownloadedFileKey('')
                }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.jobDetail)}</h2>
            {selected && (
              <button
                type="button"
                onClick={job.reload}
                disabled={job.loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <FiRefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                {t(TEXT.refreshStatus)}
              </button>
            )}
          </div>

          {!selected && (
            <div className="mt-6 grid min-h-64 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
              <div>
                <FiActivity aria-hidden="true" className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">{t(TEXT.selectJob)}</p>
              </div>
            </div>
          )}
          {selected && job.loading && <p className="mt-4 text-sm text-slate-600">{t(TEXT.loading)}</p>}
          {selected && job.error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {job.error.message}
            </p>
          )}

          {selected && job.data && (
            <div className="mt-5 space-y-5">
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-500/20 blur-2xl" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      {job.data.status === 'done' ? (
                        <FiCheckCircle aria-hidden="true" className="h-6 w-6 text-emerald-300" />
                      ) : job.data.status === 'failed' ? (
                        <FiAlertCircle aria-hidden="true" className="h-6 w-6 text-red-300" />
                      ) : (
                        <FiClock aria-hidden="true" className="h-6 w-6 text-sky-300" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-sky-300">{t(TEXT.overview)}</p>
                      <p className="mt-0.5 truncate text-xl font-semibold">
                        {toolLabel(job.data.tool, locale) || t(TEXT.unknownTool)}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {t(TEXT.identifier)} · <span className="font-mono" title={job.data.id || selected}>{shortId(job.data.id || selected)}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
                    {statusLabel(job.data.status, t)}
                  </span>
                </div>
                <div className="relative mt-5 rounded-xl bg-white/10 p-3.5 ring-1 ring-white/10">
                  <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-200">
                    <span>{t(TEXT.progress)}</span>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={t(TEXT.jobProgress)}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/15"
                  >
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]">
                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.previewTitle)}</h3>
                    {firstResultFile && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        {t(TEXT.preview)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid min-h-44 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    {job.data.status !== 'done' && (
                      <div className="text-center text-slate-400">
                        <FiClock aria-hidden="true" className="mx-auto h-7 w-7" />
                        <p className="mt-2 text-sm">{t(TEXT.noPreview)}</p>
                      </div>
                    )}
                    {job.data.status === 'done' && previewLoading && (
                      <p className="text-sm text-slate-500">{t(TEXT.loading)}</p>
                    )}
                    {job.data.status === 'done' && !previewLoading && preview && isImagePreview && (
                      <img
                        src={preview.url}
                        alt={previewName || t(TEXT.preview)}
                        className="max-h-64 w-full rounded-lg bg-white object-contain shadow-sm"
                      />
                    )}
                    {job.data.status === 'done' && !previewLoading && preview && isPdfPreview && (
                      <iframe
                        src={preview.url}
                        title={previewName || t(TEXT.preview)}
                        className="h-64 w-full rounded-lg bg-white shadow-sm"
                      />
                    )}
                    {job.data.status === 'done' && !previewLoading && (!preview || (!isImagePreview && !isPdfPreview)) && (
                      <div className="text-center text-slate-400">
                        <FiFile aria-hidden="true" className="mx-auto h-7 w-7" />
                        <p className="mt-2 text-sm">{t(TEXT.previewUnavailable)}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-xs text-slate-500" title={previewName}>
                      {firstResultFile ? previewName : '—'}
                    </p>
                    {firstResultFile && job.data.status === 'done' && (
                      <button
                        type="button"
                        onClick={() => handleDownloadResult(firstResultFile, 0)}
                        disabled={jobDownload.loading}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
                      >
                        <FiDownload aria-hidden="true" className="h-3.5 w-3.5" />
                        {t(TEXT.download)}
                      </button>
                    )}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FiInfo aria-hidden="true" className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.information)}</h3>
                  </div>
                  <dl className="mt-1 divide-y divide-slate-100">
                    <InfoRow label={t(TEXT.createdAt)} value={formatDate(job.data.created_at, locale)} />
                    <InfoRow label={t(TEXT.finishedAt)} value={formatDate(job.data.finished_at, locale)} />
                    <InfoRow label={t(TEXT.inputSize)} value={formatBytes(job.data.input_bytes, locale)} />
                    <InfoRow label={t(TEXT.targetMet)} value={formatBoolean(job.data.result?.target_met ?? job.data.target_met, t)} />
                  </dl>
                </section>
              </div>

              <section className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiFile aria-hidden="true" className="h-4 w-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.resultFiles)}</h3>
                  </div>
                  <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                    {resultFiles.length}
                  </span>
                </div>
                {resultFiles.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">{t(TEXT.noFiles)}</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {resultFiles.map((file, index) => {
                      const name = decodeFileName(file?.name) || `${t(TEXT.file)} ${index + 1}`
                      const fileKey = `${selected}:${file?.file_id ?? index}`

                      return (
                        <li key={file?.file_id ?? `${name}-${index}`} className="flex flex-wrap items-center gap-3 p-3.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                            <FiFile aria-hidden="true" className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800" title={name}>{name}</p>
                            <p className="text-xs text-slate-500">{formatBytes(file?.size_bytes, locale)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadResult(file, index)}
                            disabled={job.data.status !== 'done' || jobDownload.loading}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                          >
                            <FiDownload aria-hidden="true" className="h-3.5 w-3.5" />
                            {jobDownload.loading && downloadedFileKey === fileKey ? t(TEXT.downloading) : t(TEXT.download)}
                          </button>
                          {downloadedFileKey === fileKey && !jobDownload.error && !jobDownload.loading && (
                            <p className="w-full text-xs text-emerald-700">{t(TEXT.downloadStarted)}</p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {job.data.quality_warning?.message && (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{job.data.quality_warning.message}</p>
              )}
              {job.data.error?.message && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{job.data.error.message}</p>
              )}
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
