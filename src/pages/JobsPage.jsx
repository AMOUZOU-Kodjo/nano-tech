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
  FiInbox,
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

const STATUS_TONES = {
  queued: 'bg-slate-500/10 text-slate-600 dark:text-slate-200',
  running: 'bg-sky-500/10 text-sky-700 dark:text-sky-200',
  done: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  failed: 'bg-red-500/10 text-red-700 dark:text-red-200',
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
  noPreview: {
    fr: 'L’aperçu sera disponible une fois le traitement terminé.',
    en: 'The preview will be available once processing is complete.',
  },
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
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONES[key] ?? STATUS_TONES.queued}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[key] ?? STATUS_DOTS.queued}`} />
      {statusLabel(status, t)}
    </span>
  )
}

function SummaryCard({ label, value, tone, icon: Icon }) {
  const tones = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-200',
    red: 'bg-red-500/10 text-red-700 dark:text-red-200',
  }

  return (
    <div className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 ${tones[tone]}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/60 dark:bg-white/5">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="max-w-full break-words text-right text-sm font-medium text-ink">{value}</dd>
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
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <FiActivity aria-hidden="true" className="h-3.5 w-3.5" />
            NanoFile
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t(TEXT.subtitle)}</p>
        </div>
        <p className="flex items-center gap-2 text-xs font-semibold text-ink-faint">
          <FiClock aria-hidden="true" className="h-4 w-4" />
          {items.length} {t(TEXT.recentJobs).toLowerCase()}
        </p>
      </header>

      {!meLoading && isGuest && (
        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-surface/70 px-4 py-3 text-sm text-brand-soft">
          <FiInfo aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>
            {t(TEXT.guestBrowsing)}{' '}
            <Link to="/login" className="font-bold underline decoration-brand/40 underline-offset-2 hover:text-brand">
              {t(TEXT.signIn)}
            </Link>{' '}
            {t(TEXT.toSeeJobs)}
          </span>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard label={t(TEXT.doneCount)} value={counts.done} tone="emerald" icon={FiCheckCircle} />
        <SummaryCard label={t(TEXT.runningCount)} value={counts.running} tone="sky" icon={FiClock} />
        <SummaryCard label={t(TEXT.failedCount)} value={counts.failed} tone="red" icon={FiAlertCircle} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">{t(TEXT.recentJobs)}</h2>
            <span className="text-xs font-bold tabular-nums text-ink-faint">{items.length}</span>
          </div>

          <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-2xl bg-surface-muted/60">
            {loading && !items.length && <p className="px-4 py-5 text-sm text-ink-muted">{t(TEXT.loading)}</p>}
            {!loading && !items.length && (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-ink-faint">
                <FiInbox aria-hidden="true" className="h-7 w-7" />
                <p className="text-sm">{t(TEXT.noJobs)}</p>
              </div>
            )}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelected(item.id)
                  setDownloadedFileKey('')
                }}
                className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                  selected === item.id ? 'bg-brand-surface/70' : 'hover:bg-surface-strong/60'
                }`}
              >
                <span className={`h-8 w-1 shrink-0 rounded-full transition ${selected === item.id ? 'bg-brand' : 'bg-transparent group-hover:bg-line-strong'}`} />
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${selected === item.id ? 'bg-brand text-white' : 'bg-surface text-brand'}`}>
                  <FiActivity aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {toolLabel(item.tool, locale) || item.id}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[11px] text-ink-faint" title={item.id}>
                    {shortId(item.id)} · {formatDate(item.created_at, locale)}
                  </span>
                </span>
                <StatusBadge status={item.status} t={t} />
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1 px-1">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={offset === 0 || loading}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-brand disabled:opacity-40"
            >
              <FiChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
              {t(TEXT.previous)}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={items.length < limit || loading}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-brand disabled:opacity-40"
            >
              {t(TEXT.next)}
              <FiChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
            <label className="ml-auto flex items-center gap-2 text-xs text-ink-faint">
              {t(TEXT.perPage)}
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value))
                  setOffset(0)
                  setSelected('')
                  setDownloadedFileKey('')
                }}
                className="rounded-lg bg-surface px-2 py-1.5 text-xs font-semibold text-ink ring-1 ring-line"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-surface shadow-xl shadow-slate-900/5 ring-1 ring-line/40">
          <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-ink">{t(TEXT.jobDetail)}</h2>
            {selected && (
              <button
                type="button"
                onClick={job.reload}
                disabled={job.loading}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-brand disabled:opacity-40"
              >
                <FiRefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                {t(TEXT.refreshStatus)}
              </button>
            )}
          </div>

          {!selected && (
            <div className="mx-5 mb-5 grid min-h-72 place-items-center rounded-2xl bg-surface-muted/60 px-6 text-center sm:mx-6 sm:mb-6">
              <div className="max-w-sm">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-surface text-brand">
                  <FiActivity aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm text-ink-muted">{t(TEXT.selectJob)}</p>
              </div>
            </div>
          )}
          {selected && job.loading && <p className="px-5 pb-5 text-sm text-ink-muted sm:px-6">{t(TEXT.loading)}</p>}
          {selected && job.error && (
            <p role="alert" className="mx-5 mb-5 rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200 sm:mx-6">
              {job.error.message}
            </p>
          )}

          {selected && job.data && (
            <div className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-lg shadow-slate-900/10 sm:p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      {job.data.status === 'done' ? (
                        <FiCheckCircle aria-hidden="true" className="h-6 w-6 text-emerald-300" />
                      ) : job.data.status === 'failed' ? (
                        <FiAlertCircle aria-hidden="true" className="h-6 w-6 text-red-300" />
                      ) : (
                        <FiClock aria-hidden="true" className="h-6 w-6 text-sky-200" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-100/80">{t(TEXT.overview)}</p>
                      <p className="mt-1 truncate text-xl font-semibold">
                        {toolLabel(job.data.tool, locale) || t(TEXT.unknownTool)}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        {t(TEXT.identifier)} · <span className="font-mono" title={job.data.id || selected}>{shortId(job.data.id || selected)}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    {statusLabel(job.data.status, t)}
                  </span>
                </div>
                <div className="relative mt-5 rounded-xl bg-white/10 p-3.5">
                  <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-white/70">
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

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)]">
                <section className="rounded-2xl bg-surface-muted/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-ink">{t(TEXT.previewTitle)}</h3>
                    {firstResultFile && <span className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">{t(TEXT.preview)}</span>}
                  </div>
                  <div className="mt-3 grid min-h-44 place-items-center overflow-hidden rounded-xl bg-surface p-2.5 shadow-inner shadow-slate-900/5">
                    {job.data.status !== 'done' && (
                      <div className="text-center text-ink-faint">
                        <FiClock aria-hidden="true" className="mx-auto h-7 w-7" />
                        <p className="mt-2 text-sm">{t(TEXT.noPreview)}</p>
                      </div>
                    )}
                    {job.data.status === 'done' && previewLoading && (
                      <p className="text-sm text-ink-muted">{t(TEXT.loading)}</p>
                    )}
                    {job.data.status === 'done' && !previewLoading && preview && isImagePreview && (
                      <img
                        src={preview.url}
                        alt={previewName || t(TEXT.preview)}
                        className="max-h-64 w-full rounded-lg object-contain"
                      />
                    )}
                    {job.data.status === 'done' && !previewLoading && preview && isPdfPreview && (
                      <iframe
                        src={preview.url}
                        title={previewName || t(TEXT.preview)}
                        className="h-64 w-full rounded-lg"
                      />
                    )}
                    {job.data.status === 'done' && !previewLoading && (!preview || (!isImagePreview && !isPdfPreview)) && (
                      <div className="text-center text-ink-faint">
                        <FiFile aria-hidden="true" className="mx-auto h-7 w-7" />
                        <p className="mt-2 text-sm">{t(TEXT.previewUnavailable)}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-xs text-ink-faint" title={previewName}>
                      {firstResultFile ? previewName : '—'}
                    </p>
                    {firstResultFile && job.data.status === 'done' && (
                      <button
                        type="button"
                        onClick={() => handleDownloadResult(firstResultFile, 0)}
                        disabled={jobDownload.loading}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-soft disabled:opacity-40"
                      >
                        <FiDownload aria-hidden="true" className="h-3.5 w-3.5" />
                        {t(TEXT.download)}
                      </button>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl bg-surface-muted/70 p-4">
                  <div className="flex items-center gap-2">
                    <FiInfo aria-hidden="true" className="h-4 w-4 text-brand" />
                    <h3 className="text-sm font-semibold text-ink">{t(TEXT.information)}</h3>
                  </div>
                  <dl className="mt-2 divide-y divide-line/60">
                    <InfoRow label={t(TEXT.createdAt)} value={formatDate(job.data.created_at, locale)} />
                    <InfoRow label={t(TEXT.finishedAt)} value={formatDate(job.data.finished_at, locale)} />
                    <InfoRow label={t(TEXT.inputSize)} value={formatBytes(job.data.input_bytes, locale)} />
                    <InfoRow label={t(TEXT.targetMet)} value={formatBoolean(job.data.result?.target_met ?? job.data.target_met, t)} />
                  </dl>
                </section>
              </div>

              <section className="rounded-2xl bg-surface-muted/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiFile aria-hidden="true" className="h-4 w-4 text-ink-faint" />
                    <h3 className="text-sm font-semibold text-ink">{t(TEXT.resultFiles)}</h3>
                  </div>
                  <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-bold text-ink-faint">{resultFiles.length}</span>
                </div>
                {resultFiles.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-muted">{t(TEXT.noFiles)}</p>
                ) : (
                  <ul className="mt-2 divide-y divide-line/60">
                    {resultFiles.map((file, index) => {
                      const name = decodeFileName(file?.name) || `${t(TEXT.file)} ${index + 1}`
                      const fileKey = `${selected}:${file?.file_id ?? index}`

                      return (
                        <li key={file?.file_id ?? `${name}-${index}`} className="flex flex-wrap items-center gap-3 py-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-brand">
                            <FiFile aria-hidden="true" className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink" title={name}>{name}</p>
                            <p className="text-xs text-ink-faint">{formatBytes(file?.size_bytes, locale)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadResult(file, index)}
                            disabled={job.data.status !== 'done' || jobDownload.loading}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-soft disabled:opacity-40"
                          >
                            <FiDownload aria-hidden="true" className="h-3.5 w-3.5" />
                            {jobDownload.loading && downloadedFileKey === fileKey ? t(TEXT.downloading) : t(TEXT.download)}
                          </button>
                          {downloadedFileKey === fileKey && !jobDownload.error && !jobDownload.loading && (
                            <p className="w-full text-xs text-emerald-700 dark:text-emerald-200">{t(TEXT.downloadStarted)}</p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {job.data.quality_warning?.message && (
                <p className="rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-100">
                  {job.data.quality_warning.message}
                </p>
              )}
              {job.data.error?.message && (
                <p role="alert" className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                  {job.data.error.message}
                </p>
              )}
            </div>
          )}

          {jobDownload.error && (
            <p role="alert" className="mx-5 mb-5 rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200 sm:mx-6">
              {jobDownload.error.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {error.message}
        </p>
      )}
    </section>
  )
}
