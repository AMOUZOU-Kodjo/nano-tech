import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'
import { useCatalog } from '@/hooks/useCatalog.js'
import { useEvents } from '@/hooks/useEvents.js'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Outils dont les options sont documentées dans FRONTEND.md.
const DOCUMENTED_OPTION_TOOLS = new Set([
  'compress',
  'pdf_to_images',
  'pdf_split',
  'pdf_reorder',
  'images_to_pdf',
  'pdf_sign',
  'pdf_protect',
  'pdf_watermark',
  'photo_id',
])

const OPTION_INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50'

// Libellés français des statuts documentés pour un job.
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

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return ''
  }
  if (bytes < 1024) {
    return `${bytes} o`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function contentTypeFromName(name) {
  const extension = name.split('.').pop()?.toLowerCase()
  const types = {
    pdf: 'application/pdf',
    zip: 'application/zip',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
  }

  return types[extension] ?? 'application/octet-stream'
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
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return value
  }
}

function optionItems(value) {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.entries(value).map(([key, item]) =>
          item && typeof item === 'object' ? { code: key, ...item } : { code: key, name: String(item) },
        )
      : []

  return source
    .map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item, documents: [] }
      }
      if (!item || typeof item !== 'object') {
        return null
      }

      const code = item.code ?? item.id ?? item.name ?? item.label ?? ''
      const rawDocuments = item.documents ?? item.document_types ?? item.types ?? []

      return {
        value: String(code),
        label: String(item.name ?? item.label ?? item.title ?? code),
        documents: optionItems(rawDocuments),
      }
    })
    .filter((item) => item && item.value)
}

function normalizePhotoCountries(specs) {
  const source = Array.isArray(specs) ? specs : specs?.countries ?? []
  return optionItems(source)
}

function normalizePhotoExcluded(specs) {
  const source = Array.isArray(specs?.excluded) ? specs.excluded : []
  return source
    .map((item) => ({
      code: String(item?.code ?? item?.id ?? ''),
      reason: String(item?.reason ?? ''),
    }))
    .filter((item) => item.code)
}

function Step({ title, description, done, active }) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
          done ? 'bg-emerald-500 text-white' : active ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {done ? '✓' : active ? '•' : ''}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{description}</p>
      </div>
    </li>
  )
}

function PhotoSpecSummary({ countries, excluded }) {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-slate-600">
        {countries.length > 0
          ? `${countries.length} pays disponible${countries.length > 1 ? 's' : ''}.`
          : 'Aucun pays disponible pour la photo d’identité.'}
      </p>
      {countries.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {countries.map((item) => (
            <li key={item.value} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {excluded.length > 0 && (
        <div className="rounded-lg bg-amber-50 px-3 py-2">
          <p className="text-xs font-semibold text-amber-900">Pays exclus</p>
          <ul className="mt-1 space-y-1">
            {excluded.map((item) => (
              <li key={item.code} className="text-xs leading-relaxed text-amber-800">
                <span className="font-semibold">{item.code}</span>
                {item.reason ? ` : ${item.reason}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Page générique : un seul écran pour lancer chacun des outils documentés.
export default function ToolPage() {
  const { tool } = useParams()
  const { reload } = useMeContext()
  const { photoSpecs, loading: specsLoading, error: specsError, getPhotoSpecs } = useCatalog()
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [downloadedJobId, setDownloadedJobId] = useState(null)
  const [localError, setLocalError] = useState(null)
  const [photoOptions, setPhotoOptions] = useState({
    country: '',
    document: '',
    background: '',
    sheet: '',
    maxSizeKb: '',
  })
  const [compressOptions, setCompressOptions] = useState({
    level: '',
    targetSizeKb: '',
  })
  const [toolOptions, setToolOptions] = useState({
    pages: 'all',
    format: 'png',
    dpi: '',
    ranges: '',
    order: '',
    signatureText: '',
    page: '',
    position: 'bottom_right',
    password: '',
    watermark: '',
  })

  const { createJob, loading: creating, error: createError } = useJobsManager({ onSuccess: reload })
  const { data: job, loading: jobLoading, error: jobError, reload: reloadJob } = useJob(jobId)
  const { loading: downloading, error: downloadError, download } = useJobDownload()
  const { sendEvents } = useEvents()
  const reportedRef = useRef(null)

  // Envoie un événement documenté sans exposer de champs supplémentaires.
  const trackEvent = useCallback(
    (name, props) => sendEvents({ name, props }),
    [sendEvents],
  )

  const toolInfo = TOOLS.find((item) => item.tool === tool)
  const categoryLabel = TOOL_CATEGORIES.find((item) => item.id === toolInfo?.category)?.label ?? toolInfo?.category
  const status = job?.status
  const progress = typeof job?.progress === 'number' ? Math.min(100, Math.max(0, job.progress)) : 0
  const photoCountries = useMemo(() => normalizePhotoCountries(photoSpecs), [photoSpecs])
  const photoExcluded = useMemo(() => normalizePhotoExcluded(photoSpecs), [photoSpecs])
  const selectedPhotoCountry = photoOptions.country || photoCountries[0]?.value || ''
  const photoDocuments = useMemo(
    () => photoCountries.find((item) => item.value === selectedPhotoCountry)?.documents ?? [],
    [photoCountries, selectedPhotoCountry],
  )
  const photoSetupUnavailable = toolInfo.tool === 'photo_id' && !specsLoading && photoCountries.length === 0

  // Interroge le statut toutes les secondes jusqu'à un état terminal.
  useEffect(() => {
    if (!jobId || jobError || status === 'done' || status === 'failed') {
      return undefined
    }

    const timer = window.setInterval(() => {
      reloadJob()
    }, 1000)

    return () => window.clearInterval(timer)
  }, [jobId, jobError, status, reloadJob])

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

  // Charge les pays disponibles dès l'ouverture de l'outil photo d'identité.
  useEffect(() => {
    if (tool !== 'photo_id' || photoSpecs) {
      return undefined
    }

    getPhotoSpecs()
    return undefined
  }, [tool, photoSpecs, getPhotoSpecs])

  if (!toolInfo) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Outil inconnu</h1>
        <p className="mt-2 text-sm text-slate-600">Cet outil ne fait pas partie du catalogue.</p>
        <Link to="/catalogue" className="mt-6 inline-block text-sky-600 hover:text-sky-700">
          Retour au catalogue
        </Link>
      </section>
    )
  }

  const relatedTools = TOOLS.filter(
    (item) => item.category === toolInfo.category && item.tool !== toolInfo.tool,
  ).slice(0, 3)
  const hasAdvancedOptions = DOCUMENTED_OPTION_TOOLS.has(toolInfo.tool)

  // Crée le job avec les options documentées selon l'outil sélectionné.
  async function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (files.length === 0) {
      setLocalError('Sélectionnez au moins un fichier.')
      return
    }

    let options = {}

    if (toolInfo.tool === 'compress') {
      if (compressOptions.targetSizeKb) {
        const targetSize = Number(compressOptions.targetSizeKb)
        if (!Number.isFinite(targetSize) || targetSize <= 0) {
          setLocalError('La taille cible doit être un nombre positif.')
          return
        }
        options.target_size_kb = targetSize
      } else if (compressOptions.level) {
        options.level = compressOptions.level
      }
    }

    if (toolInfo.tool === 'photo_id') {
      if (specsLoading) {
        setLocalError('Chargement des spécifications photo en cours.')
        return
      }
      if (photoCountries.length === 0) {
        setLocalError('Aucun pays disponible pour la photo d’identité.')
        return
      }
      if (!selectedPhotoCountry || !photoOptions.document) {
        setLocalError('Sélectionnez un pays et un document.')
        return
      }
      if (photoOptions.maxSizeKb && !Number.isFinite(Number(photoOptions.maxSizeKb))) {
        setLocalError('La taille cible doit être un nombre.')
        return
      }

      options = {
        country: selectedPhotoCountry,
        document: photoOptions.document,
        sheet: photoOptions.sheet || null,
      }

      if (photoOptions.background) {
        options.background = photoOptions.background
      }
      if (photoOptions.maxSizeKb) {
        options.max_size_kb = Number(photoOptions.maxSizeKb)
      }
    }

    if (toolInfo.tool === 'pdf_to_images') {
      if (toolOptions.pages) {
        options.pages = toolOptions.pages
      }
      if (toolOptions.format) {
        options.format = toolOptions.format
      }
      if (toolOptions.dpi) {
        const dpi = Number(toolOptions.dpi)
        if (!Number.isInteger(dpi) || dpi < 72 || dpi > 600) {
          setLocalError('La résolution doit être comprise entre 72 et 600.')
          return
        }
        options.dpi = dpi
      }
    }

    if (toolInfo.tool === 'pdf_split' && toolOptions.ranges) {
      options.ranges = toolOptions.ranges.trim()
    }

    if (toolInfo.tool === 'pdf_reorder' && toolOptions.order) {
      const order = parsePageOrder(toolOptions.order)
      if (order.length === 0) {
        setLocalError('Indiquez des numéros de pages valides, séparés par des virgules.')
        return
      }
      options.order = order
    }

    if (toolInfo.tool === 'images_to_pdf') {
      options.order = files.map((file) => file.name)
    }

    if (toolInfo.tool === 'pdf_sign') {
      if (toolOptions.signatureText) {
        options.signature_text = toolOptions.signatureText
      }
      if (toolOptions.page) {
        const page = Number(toolOptions.page)
        if (!Number.isInteger(page) || page < 1) {
          setLocalError('Le numéro de page doit être un entier positif.')
          return
        }
        options.page = page
      }
      if (toolOptions.position) {
        options.position = toolOptions.position
      }
    }

    if (toolInfo.tool === 'pdf_protect' && toolOptions.password) {
      options.password = toolOptions.password
    }

    if (toolInfo.tool === 'pdf_watermark' && toolOptions.watermark) {
      options.text = toolOptions.watermark
    }

    const payload = await createJob(files, toolInfo.tool, options)
    if (!payload?.id) {
      trackEvent('tool_run_failed', { tool: toolInfo.tool })
      setLocalError('Le job n’a pas pu être créé.')
      return
    }

    trackEvent('tool_started', { tool: toolInfo.tool, files: files.length })
    setDownloadedJobId(null)
    setJobId(String(payload.id))
  }

  function handleFiles(selected) {
    setFiles(Array.from(selected ?? []))
    setLocalError(null)
  }

  function updatePhotoOption(field, value) {
    setPhotoOptions((current) => ({
      ...current,
      [field]: value,
      ...(field === 'country' ? { document: '' } : {}),
    }))
    setLocalError(null)
  }

  function updateCompressOption(field, value) {
    setCompressOptions(() => (field === 'level' ? { level: value, targetSizeKb: '' } : { level: '', targetSizeKb: value }))
    setLocalError(null)
  }

  function updateToolOption(field, value) {
    setToolOptions((current) => ({ ...current, [field]: value }))
    setLocalError(null)
  }

  // Convertit une saisie « 3, 1, 2 » en liste de numéros de pages valides.
  function parsePageOrder(value) {
    return String(value)
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0)
  }

  function moveFile(index, direction) {
    setFiles((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function resetTool() {
    setFiles([])
    setJobId(null)
    setDownloadedJobId(null)
    setLocalError(null)
    setPhotoOptions({ country: '', document: '', background: '', sheet: '', maxSizeKb: '' })
    setCompressOptions({ level: '', targetSizeKb: '' })
    setToolOptions({ pages: 'all', format: 'png', dpi: '', ranges: '', order: '', signatureText: '', page: '', position: 'bottom_right', password: '', watermark: '' })
    reportedRef.current = null
  }

  async function handleDownloadResult() {
    setDownloadedJobId(jobId)
    const payload = await download(jobId)

    if (!payload) {
      return
    }

    const resultFile = job?.result?.files?.[0]
    const fileName = decodeFileName(resultFile?.name) || `resultat-${jobId}`
    const type = contentTypeFromName(fileName)
    const text = String(payload)
    const bytes = Uint8Array.from(text, (character) => character.charCodeAt(0) & 0xff)
    const blob = payload instanceof Blob ? payload : new Blob([bytes], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/catalogue" className="text-sky-700 hover:text-sky-800">
          Catalogue
        </Link>
        <span aria-hidden="true">/</span>
        <span>{categoryLabel}</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">{toolInfo.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{categoryLabel}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{toolInfo.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{toolInfo.description}</p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDragging(false)
                  handleFiles(event.dataTransfer.files)
                }}
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  isDragging
                    ? 'border-sky-400 bg-sky-50'
                    : 'border-slate-300 bg-slate-50 hover:border-sky-300'
                }`}
              >
                <input
                  id="job-files"
                  type="file"
                  multiple
                  onChange={(event) => handleFiles(event.target.files)}
                  className="sr-only"
                />
                <label htmlFor="job-files" className="cursor-pointer">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-sm font-bold text-sky-700 shadow-sm ring-1 ring-slate-200">
                    +
                  </span>
                  <span className="mt-4 block text-sm font-semibold text-slate-900">
                    Déposez vos fichiers ici
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    ou cliquez pour les sélectionner
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {toolInfo.tool === 'images_to_pdf' && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveFile(index, -1)}
                              disabled={creating || index === 0}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              Monter
                            </button>
                            <button
                              type="button"
                              onClick={() => moveFile(index, 1)}
                              disabled={creating || index === files.length - 1}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              Descendre
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                          disabled={creating}
                          className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                        >
                          Retirer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {toolInfo.tool === 'compress' && (
                <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Options de compression</h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Choisissez un niveau de compression ou une taille cible en Ko.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Formats acceptés : images, vidéos, PDF, Word, Excel, PowerPoint, ODF.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Niveau</span>
                      <select
                        value={compressOptions.level}
                        onChange={(event) => updateCompressOption('level', event.target.value)}
                        disabled={creating || Boolean(compressOptions.targetSizeKb)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        <option value="">Par défaut</option>
                        <option value="basic">Basique</option>
                        <option value="medium">Moyen</option>
                        <option value="max">Maximum</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Taille cible (Ko)</span>
                      <input
                        type="number"
                        min="1"
                        value={compressOptions.targetSizeKb}
                        onChange={(event) => updateCompressOption('targetSizeKb', event.target.value)}
                        disabled={creating || Boolean(compressOptions.level)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>
              )}
              {hasAdvancedOptions && toolInfo.tool !== 'compress' && toolInfo.tool !== 'photo_id' && (
                <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Options avancées</h3>
                  {toolInfo.tool === 'pdf_to_images' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Pages</span>
                        <input
                          type="text"
                          value={toolOptions.pages}
                          onChange={(event) => updateToolOption('pages', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                          placeholder="all ou 1,3-5"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Format</span>
                        <select
                          value={toolOptions.format}
                          onChange={(event) => updateToolOption('format', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        >
                          <option value="png">PNG</option>
                          <option value="jpg">JPG</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Résolution (dpi)</span>
                        <input
                          type="number"
                          min="72"
                          max="600"
                          value={toolOptions.dpi}
                          onChange={(event) => updateToolOption('dpi', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                          placeholder="72 à 600"
                        />
                      </label>
                    </div>
                  )}
                  {toolInfo.tool === 'pdf_split' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Plages de pages</span>
                      <input
                        type="text"
                        value={toolOptions.ranges}
                        onChange={(event) => updateToolOption('ranges', event.target.value)}
                        disabled={creating}
                        className={OPTION_INPUT_CLASS}
                        placeholder="1-3,5"
                      />
                    </label>
                  )}
                  {toolInfo.tool === 'pdf_reorder' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Ordre des pages</span>
                      <input
                        type="text"
                        value={toolOptions.order}
                        onChange={(event) => updateToolOption('order', event.target.value)}
                        disabled={creating}
                        className={OPTION_INPUT_CLASS}
                        placeholder="3,1,2"
                      />
                    </label>
                  )}
                  {toolInfo.tool === 'images_to_pdf' && (
                    <p className="text-xs leading-relaxed text-slate-600">
                      Les images sont assemblées dans l’ordre affiché. Utilisez les boutons Monter et Descendre pour les classer.
                    </p>
                  )}
                  {toolInfo.tool === 'pdf_sign' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Texte de la signature</span>
                        <input
                          type="text"
                          value={toolOptions.signatureText}
                          onChange={(event) => updateToolOption('signatureText', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Page</span>
                        <input
                          type="number"
                          min="1"
                          value={toolOptions.page}
                          onChange={(event) => updateToolOption('page', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>Position</span>
                        <select
                          value={toolOptions.position}
                          onChange={(event) => updateToolOption('position', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        >
                          <option value="bottom_right">Bas droite</option>
                          <option value="bottom_left">Bas gauche</option>
                          <option value="top_right">Haut droite</option>
                          <option value="top_left">Haut gauche</option>
                        </select>
                      </label>
                    </div>
                  )}
                  {toolInfo.tool === 'pdf_protect' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Mot de passe</span>
                      <input
                        type="password"
                        value={toolOptions.password}
                        onChange={(event) => updateToolOption('password', event.target.value)}
                        disabled={creating}
                        className={OPTION_INPUT_CLASS}
                      />
                    </label>
                  )}
                  {toolInfo.tool === 'pdf_watermark' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Texte du filigrane</span>
                      <input
                        type="text"
                        value={toolOptions.watermark}
                        onChange={(event) => updateToolOption('watermark', event.target.value)}
                        disabled={creating}
                        className={OPTION_INPUT_CLASS}
                      />
                    </label>
                  )}
                </div>
              )}
              {toolInfo.tool === 'photo_id' && (
                <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Options photo d’identité</h3>
                  {specsLoading && <p className="text-sm text-slate-600">Chargement des pays disponibles…</p>}
                  {specsError && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {specsError.message}
                    </p>
                  )}
                  {photoSetupUnavailable && !specsError && (
                    <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      Aucun pays disponible pour la photo d’identité. Les spécifications doivent être configurées côté API.
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Pays</span>
                      <select
                        value={selectedPhotoCountry}
                        onChange={(event) => updatePhotoOption('country', event.target.value)}
                        disabled={specsLoading || photoCountries.length === 0 || creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        {photoCountries.length === 0 && <option value="">Aucun pays disponible</option>}
                        {photoCountries.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Document</span>
                      <select
                        value={photoOptions.document}
                        onChange={(event) => updatePhotoOption('document', event.target.value)}
                        disabled={!selectedPhotoCountry || creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        <option value="">
                          {selectedPhotoCountry ? 'Sélectionnez un document' : 'Choisissez d’abord un pays'}
                        </option>
                        {photoDocuments.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Fond</span>
                      <input
                        type="text"
                        value={photoOptions.background}
                        onChange={(event) => updatePhotoOption('background', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Mise en page</span>
                      <select
                        value={photoOptions.sheet}
                        onChange={(event) => updatePhotoOption('sheet', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        <option value="">Taille standard</option>
                        <option value="10x15">10x15</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>Taille cible (Ko)</span>
                      <input
                        type="number"
                        min="1"
                        value={photoOptions.maxSizeKb}
                        onChange={(event) => updatePhotoOption('maxSizeKb', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>
              )}
              {!hasAdvancedOptions && (
                <p className="mt-4 text-xs text-slate-500">
                  Cet outil n’a pas d’options avancées documentées : le job est lancé avec la valeur par défaut.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={
                    creating ||
                    files.length === 0 ||
                    (toolInfo.tool === 'photo_id' &&
                      (specsLoading || photoSetupUnavailable || !selectedPhotoCountry || !photoOptions.document))
                  }
                  className="rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? 'Création du job…' : 'Lancer le traitement'}
                </button>
                {jobId && (
                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Nouveau traitement
                  </button>
                )}
              </div>
            </form>

            {(localError || createError) && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {localError ?? createError.message}
              </p>
            )}
          </div>

          {jobId && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">Suivi du job</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700'}`}>
                  {STATUS_LABELS[status] ?? 'En attente'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Identifiant : <span className="font-mono text-slate-700">{jobId}</span>
              </p>

              {jobLoading && !job && <p className="mt-4 text-sm text-slate-600">Chargement du statut…</p>}
              {jobError && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {jobError.message}
                </p>
              )}

              {job && (
                <div className="mt-6">
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

                  {status === 'failed' && (
                    <div className="mt-5">
                      <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {job.error?.message ?? 'Le traitement a échoué.'}
                      </p>
                      <button
                        type="button"
                        onClick={resetTool}
                        className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}

                  {status === 'done' && (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={handleDownloadResult}
                        disabled={downloading}
                        className="rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-50"
                      >
                        {downloading ? 'Récupération…' : 'Récupérer le résultat'}
                      </button>
                      {downloadedJobId === jobId && downloadError && (
                        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          {downloadError.message}
                        </p>
                      )}
                      {downloadedJobId === jobId && !downloadError && !downloading && (
                        <p className="mt-3 text-sm text-emerald-700">Le téléchargement a été lancé.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Comment ça marche</h2>
            <ol className="mt-5 space-y-5">
              <Step title="Ajoutez vos fichiers" description="Glissez vos fichiers ou sélectionnez-les depuis votre appareil." done={files.length > 0} active={files.length === 0} />
              <Step
                title="Lancez le traitement"
                description={
                  toolInfo.tool === 'photo_id'
                    ? 'Le job est créé avec le pays et le document sélectionnés.'
                    : hasAdvancedOptions
                      ? 'Le job est créé avec les options choisies.'
                      : 'Le job est créé avec les options par défaut documentées.'
                }
                done={Boolean(jobId)}
                active={files.length > 0 && !jobId}
              />
              <Step title="Récupérez le résultat" description="Suivez le statut puis téléchargez le résultat quand le job est terminé." done={status === 'done'} active={Boolean(jobId) && status !== 'done' && status !== 'failed'} />
            </ol>
          </div>

          {toolInfo.tool === 'photo_id' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Spécifications photo</h2>
                <button
                  type="button"
                  onClick={getPhotoSpecs}
                  disabled={specsLoading}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {specsLoading ? 'Chargement…' : 'Actualiser'}
                </button>
              </div>
              {specsError && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {specsError.message}
                </p>
              )}
              <PhotoSpecSummary countries={photoCountries} excluded={photoExcluded} />
            </div>
          )}

          {relatedTools.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Outils similaires</h2>
              <div className="mt-4 space-y-2">
                {relatedTools.map((item) => (
                  <Link
                    key={item.tool}
                    to={`/tools/${item.tool}`}
                    className="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-sky-300 hover:text-sky-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
            <h2 className="text-sm font-semibold text-sky-900">Besoin d’un autre outil ?</h2>
            <p className="mt-2 text-sm leading-relaxed text-sky-800">
              Retrouvez tous les traitements disponibles dans le catalogue.
            </p>
            <Link to="/catalogue" className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
              Voir le catalogue →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
