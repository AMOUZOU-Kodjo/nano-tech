import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'
import { useLocale } from '@/hooks/useLocale.js'
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

const TEXT = {
  unknownTool: { fr: 'Outil inconnu', en: 'Unknown tool' },
  unknownToolDescription: {
    fr: 'Cet outil ne fait pas partie du catalogue.',
    en: 'This tool is not part of the catalogue.',
  },
  backCatalogue: { fr: 'Retour au catalogue', en: 'Back to the catalogue' },
  catalogue: { fr: 'Catalogue', en: 'Catalog' },
  breadcrumb: { fr: 'Fil d’Ariane', en: 'Breadcrumb' },
  dropFiles: { fr: 'Déposez vos fichiers ici', en: 'Drop your files here' },
  clickSelect: { fr: 'ou cliquez pour les sélectionner', en: 'or click to select them' },
  moveUp: { fr: 'Monter', en: 'Move up' },
  moveDown: { fr: 'Descendre', en: 'Move down' },
  remove: { fr: 'Retirer', en: 'Remove' },
  compressionOptions: { fr: 'Options de compression', en: 'Compression options' },
  compressionHelp: {
    fr: 'Choisissez un niveau de compression ou une taille cible en Ko.',
    en: 'Choose a compression level or a target size in KB.',
  },
  acceptedFormats: {
    fr: 'Formats acceptés : images, vidéos, PDF, Word, Excel, PowerPoint, ODF.',
    en: 'Accepted formats: images, videos, PDF, Word, Excel, PowerPoint, ODF.',
  },
  level: { fr: 'Niveau', en: 'Level' },
  default: { fr: 'Par défaut', en: 'Default' },
  basic: { fr: 'Basique', en: 'Basic' },
  medium: { fr: 'Moyen', en: 'Medium' },
  max: { fr: 'Maximum', en: 'Maximum' },
  targetSizeKb: { fr: 'Taille cible (Ko)', en: 'Target size (KB)' },
  advancedOptions: { fr: 'Options avancées', en: 'Advanced options' },
  pages: { fr: 'Pages', en: 'Pages' },
  format: { fr: 'Format', en: 'Format' },
  resolution: { fr: 'Résolution (dpi)', en: 'Resolution (dpi)' },
  resolutionPlaceholder: { fr: '72 à 600', en: '72 to 600' },
  pageRanges: { fr: 'Plages de pages', en: 'Page ranges' },
  pageOrder: { fr: 'Ordre des pages', en: 'Page order' },
  imagesOrderHelp: {
    fr: 'Les images sont assemblées dans l’ordre affiché. Utilisez les boutons Monter et Descendre pour les classer.',
    en: 'Images are assembled in the displayed order. Use the Move up and Move down buttons to sort them.',
  },
  signatureText: { fr: 'Texte de la signature', en: 'Signature text' },
  page: { fr: 'Page', en: 'Page' },
  position: { fr: 'Position', en: 'Position' },
  bottomRight: { fr: 'Bas droite', en: 'Bottom right' },
  bottomLeft: { fr: 'Bas gauche', en: 'Bottom left' },
  topRight: { fr: 'Haut droite', en: 'Top right' },
  topLeft: { fr: 'Haut gauche', en: 'Top left' },
  password: { fr: 'Mot de passe', en: 'Password' },
  watermarkText: { fr: 'Texte du filigrane', en: 'Watermark text' },
  photoOptions: { fr: 'Options photo d’identité', en: 'ID photo options' },
  loadingCountries: { fr: 'Chargement des pays disponibles…', en: 'Loading available countries…' },
  noCountriesConfigured: {
    fr: 'Aucun pays disponible pour la photo d’identité. Les spécifications doivent être configurées côté API.',
    en: 'No country available for the ID photo. Specifications must be configured on the API side.',
  },
  noCountries: { fr: 'Aucun pays disponible', en: 'No country available' },
  country: { fr: 'Pays', en: 'Country' },
  document: { fr: 'Document', en: 'Document' },
  selectDocument: { fr: 'Sélectionnez un document', en: 'Select a document' },
  chooseCountryFirst: { fr: 'Choisissez d’abord un pays', en: 'Choose a country first' },
  background: { fr: 'Fond', en: 'Background' },
  sheet: { fr: 'Mise en page', en: 'Sheet layout' },
  standardSize: { fr: 'Taille standard', en: 'Standard size' },
  noAdvancedOptions: {
    fr: 'Cet outil n’a pas d’options avancées documentées : le job est lancé avec la valeur par défaut.',
    en: 'This tool has no documented advanced options: the job starts with the default value.',
  },
  creating: { fr: 'Création du job…', en: 'Creating the job…' },
  startProcessing: { fr: 'Lancer le traitement', en: 'Start processing' },
  newProcessing: { fr: 'Nouveau traitement', en: 'New processing' },
  identifier: { fr: 'Identifiant', en: 'Identifier' },
  loadingStatus: { fr: 'Chargement du statut…', en: 'Loading status…' },
  jobProgress: { fr: 'Progression du job', en: 'Job progress' },
  stage: { fr: 'Étape', en: 'Stage' },
  eta: { fr: 'Temps estimé', en: 'Estimated time' },
  seconds: { fr: 's', en: 's' },
  processingFailed: { fr: 'Le traitement a échoué.', en: 'Processing failed.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  retrieving: { fr: 'Récupération…', en: 'Retrieving…' },
  getResult: { fr: 'Récupérer le résultat', en: 'Get the result' },
  downloadStarted: { fr: 'Le téléchargement a été lancé.', en: 'The download has started.' },
  liveTracking: { fr: 'Suivi en direct', en: 'Live tracking' },
  filesReady: { fr: 'Fichiers prêts', en: 'Files ready' },
  processing: { fr: 'Traitement en cours', en: 'Processing' },
  resultStep: { fr: 'Résultat', en: 'Result' },
  notStarted: { fr: 'Pas encore lancé', en: 'Not started yet' },
  resultAvailable: { fr: 'Résultat disponible', en: 'Result available' },
  resultFailed: { fr: 'Traitement échoué', en: 'Processing failed' },
  resultPending: { fr: 'En attente du résultat', en: 'Waiting for the result' },
  photoSpecs: { fr: 'Spécifications photo', en: 'Photo specifications' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  excludedCountries: { fr: 'Pays exclus', en: 'Excluded countries' },
  similarTools: { fr: 'Outils similaires', en: 'Similar tools' },
  needAnotherTool: { fr: 'Besoin d’un autre outil ?', en: 'Need another tool?' },
  catalogueHelp: {
    fr: 'Retrouvez tous les traitements disponibles dans le catalogue.',
    en: 'Find all available processing tools in the catalogue.',
  },
  viewCatalogue: { fr: 'Voir le catalogue →', en: 'View the catalogue →' },
  noFiles: { fr: 'Sélectionnez au moins un fichier.', en: 'Select at least one file.' },
  positiveTargetSize: {
    fr: 'La taille cible doit être un nombre positif.',
    en: 'The target size must be a positive number.',
  },
  specsLoadingError: {
    fr: 'Chargement des spécifications photo en cours.',
    en: 'Photo specifications are still loading.',
  },
  selectCountryDocument: {
    fr: 'Sélectionnez un pays et un document.',
    en: 'Select a country and a document.',
  },
  numericTargetSize: {
    fr: 'La taille cible doit être un nombre.',
    en: 'The target size must be a number.',
  },
  dpiRange: {
    fr: 'La résolution doit être comprise entre 72 et 600.',
    en: 'The resolution must be between 72 and 600.',
  },
  invalidPageOrder: {
    fr: 'Indiquez des numéros de pages valides, séparés par des virgules.',
    en: 'Enter valid page numbers separated by commas.',
  },
  positivePage: {
    fr: 'Le numéro de page doit être un entier positif.',
    en: 'The page number must be a positive integer.',
  },
  jobNotCreated: { fr: 'Le job n’a pas pu être créé.', en: 'The job could not be created.' },
}

// Libellés des statuts documentés pour un job.
const STATUS_LABELS = {
  queued: { fr: 'En attente', en: 'Queued' },
  running: { fr: 'En cours', en: 'Running' },
  done: { fr: 'Terminé', en: 'Done' },
  failed: { fr: 'Échec', en: 'Failed' },
}

const STATUS_STYLES = {
  queued: 'bg-slate-100 text-slate-700',
  running: 'bg-sky-50 text-sky-700',
  done: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
}

function formatFileSize(bytes, locale) {
  if (!Number.isFinite(bytes)) {
    return ''
  }
  if (bytes < 1024) {
    return `${bytes} ${locale === 'fr' ? 'o' : 'B'}`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} ${locale === 'fr' ? 'Ko' : 'KB'}`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${locale === 'fr' ? 'Mo' : 'MB'}`
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

function Step({ title, description, done, active, className = '' }) {
  return (
    <li className={`flex gap-3 ${className}`}>
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
  const { locale, t } = useLocale()
  const countriesLabel =
    countries.length === 0
      ? t(TEXT.noCountries)
      : locale === 'fr'
        ? `${countries.length} pays disponible${countries.length > 1 ? 's' : ''}.`
        : `${countries.length} available countr${countries.length > 1 ? 'ies' : 'y'}.`

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-slate-600">{countriesLabel}</p>
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
          <p className="text-xs font-semibold text-amber-900">{t(TEXT.excludedCountries)}</p>
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
  const { locale, t } = useLocale()
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
  const category = TOOL_CATEGORIES.find((item) => item.id === toolInfo?.category)
  const categoryLabel =
    locale === 'en' ? category?.labelEn ?? toolInfo?.category : category?.label ?? toolInfo?.category
  const status = job?.status
  const progress = typeof job?.progress === 'number' ? Math.min(100, Math.max(0, job.progress)) : 0
  const processingDescription = !jobId
    ? t(TEXT.notStarted)
    : [
        t(STATUS_LABELS[status] ?? STATUS_LABELS.queued),
        job?.stage,
        typeof job?.eta_seconds === 'number' && job.eta_seconds > 0
          ? `${job.eta_seconds} ${t(TEXT.seconds)}`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
  const photoCountries = useMemo(() => normalizePhotoCountries(photoSpecs), [photoSpecs])
  const photoExcluded = useMemo(() => normalizePhotoExcluded(photoSpecs), [photoSpecs])
  const selectedPhotoCountry = photoOptions.country || photoCountries[0]?.value || ''
  const photoDocuments = useMemo(
    () => photoCountries.find((item) => item.value === selectedPhotoCountry)?.documents ?? [],
    [photoCountries, selectedPhotoCountry],
  )
  const photoSetupUnavailable = toolInfo?.tool === 'photo_id' && !specsLoading && photoCountries.length === 0

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

  // Prépare les miniatures des images sélectionnées et libère les URL à chaque changement.
  const previews = useMemo(
    () => files.map((file) => (file.type.startsWith('image/') ? URL.createObjectURL(file) : null)),
    [files],
  )

  useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)), [previews])

  if (!toolInfo) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">{t(TEXT.unknownTool)}</h1>
        <p className="mt-2 text-sm text-slate-600">{t(TEXT.unknownToolDescription)}</p>
        <Link to="/catalogue" className="mt-6 inline-block text-sky-600 hover:text-sky-700">
          {t(TEXT.backCatalogue)}
        </Link>
      </section>
    )
  }

  const toolName = locale === 'en' ? toolInfo.nameEn : toolInfo.name
  const toolDescription = locale === 'en' ? toolInfo.descriptionEn : toolInfo.description
  const relatedTools = TOOLS.filter(
    (item) => item.category === toolInfo.category && item.tool !== toolInfo.tool,
  ).slice(0, 3)
  const hasAdvancedOptions = DOCUMENTED_OPTION_TOOLS.has(toolInfo.tool)

  // Crée le job avec les options documentées selon l'outil sélectionné.
  async function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (files.length === 0) {
      setLocalError(t(TEXT.noFiles))
      return
    }

    let options = {}

    if (toolInfo.tool === 'compress') {
      if (compressOptions.targetSizeKb) {
        const targetSize = Number(compressOptions.targetSizeKb)
        if (!Number.isFinite(targetSize) || targetSize <= 0) {
          setLocalError(t(TEXT.positiveTargetSize))
          return
        }
        options.target_size_kb = targetSize
      } else if (compressOptions.level) {
        options.level = compressOptions.level
      }
    }

    if (toolInfo.tool === 'photo_id') {
      if (specsLoading) {
        setLocalError(t(TEXT.specsLoadingError))
        return
      }
      if (photoCountries.length === 0) {
        setLocalError(t(TEXT.noCountries))
        return
      }
      if (!selectedPhotoCountry || !photoOptions.document) {
        setLocalError(t(TEXT.selectCountryDocument))
        return
      }
      if (photoOptions.maxSizeKb && !Number.isFinite(Number(photoOptions.maxSizeKb))) {
        setLocalError(t(TEXT.numericTargetSize))
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
          setLocalError(t(TEXT.dpiRange))
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
        setLocalError(t(TEXT.invalidPageOrder))
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
          setLocalError(t(TEXT.positivePage))
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
      setLocalError(t(TEXT.jobNotCreated))
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
    const fileName = decodeFileName(resultFile?.name) || `${locale === 'fr' ? 'resultat' : 'result'}-${jobId}`
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
    <section className="mx-auto max-w-6xl px-6 py-6 lg:py-4">
      <nav aria-label={t(TEXT.breadcrumb)} className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/catalogue" className="text-sky-700 hover:text-sky-800">
          {t(TEXT.catalogue)}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{categoryLabel}</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">{toolName}</span>
      </nav>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{categoryLabel}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">{toolName}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{toolDescription}</p>

            <form onSubmit={handleSubmit} className="mt-5">
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
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition lg:p-4 ${
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
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-bold text-sky-700 shadow-sm ring-1 ring-slate-200 lg:h-9 lg:w-9">
                    +
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-slate-900">
                    {t(TEXT.dropFiles)}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {t(TEXT.clickSelect)}
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                          {previews[index] ? (
                            <img src={previews[index]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            file.name.split('.').pop()?.toUpperCase().slice(0, 4)
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size, locale)}</p>
                        </div>
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
                              {t(TEXT.moveUp)}
                            </button>
                            <button
                              type="button"
                              onClick={() => moveFile(index, 1)}
                              disabled={creating || index === files.length - 1}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              {t(TEXT.moveDown)}
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                          disabled={creating}
                          className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                        >
                          {t(TEXT.remove)}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {hasAdvancedOptions && toolInfo.tool !== 'compress' && toolInfo.tool !== 'photo_id' && (
                <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:p-3">
                  <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.advancedOptions)}</h3>
                  {toolInfo.tool === 'pdf_to_images' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>{t(TEXT.pages)}</span>
                        <input
                          type="text"
                          value={toolOptions.pages}
                          onChange={(event) => updateToolOption('pages', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                          placeholder={locale === 'fr' ? 'all ou 1,3-5' : 'all or 1,3-5'}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>{t(TEXT.format)}</span>
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
                        <span>{t(TEXT.resolution)}</span>
                        <input
                          type="number"
                          min="72"
                          max="600"
                          value={toolOptions.dpi}
                          onChange={(event) => updateToolOption('dpi', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                          placeholder={t(TEXT.resolutionPlaceholder)}
                        />
                      </label>
                    </div>
                  )}
                  {toolInfo.tool === 'pdf_split' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.pageRanges)}</span>
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
                      <span>{t(TEXT.pageOrder)}</span>
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
                      {t(TEXT.imagesOrderHelp)}
                    </p>
                  )}
                  {toolInfo.tool === 'pdf_sign' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>{t(TEXT.signatureText)}</span>
                        <input
                          type="text"
                          value={toolOptions.signatureText}
                          onChange={(event) => updateToolOption('signatureText', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-700">
                        <span>{t(TEXT.page)}</span>
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
                        <span>{t(TEXT.position)}</span>
                        <select
                          value={toolOptions.position}
                          onChange={(event) => updateToolOption('position', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        >
                          <option value="bottom_right">{t(TEXT.bottomRight)}</option>
                          <option value="bottom_left">{t(TEXT.bottomLeft)}</option>
                          <option value="top_right">{t(TEXT.topRight)}</option>
                          <option value="top_left">{t(TEXT.topLeft)}</option>
                        </select>
                      </label>
                    </div>
                  )}
                  {toolInfo.tool === 'pdf_protect' && (
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.password)}</span>
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
                      <span>{t(TEXT.watermarkText)}</span>
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
                <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:p-3">
                  <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.photoOptions)}</h3>
                  {specsLoading && <p className="text-sm text-slate-600">{t(TEXT.loadingCountries)}</p>}
                  {specsError && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {specsError.message}
                    </p>
                  )}
                  {photoSetupUnavailable && !specsError && (
                    <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      {t(TEXT.noCountriesConfigured)}
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.country)}</span>
                      <select
                        value={selectedPhotoCountry}
                        onChange={(event) => updatePhotoOption('country', event.target.value)}
                        disabled={specsLoading || photoCountries.length === 0 || creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        {photoCountries.length === 0 && <option value="">{t(TEXT.noCountries)}</option>}
                        {photoCountries.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.document)}</span>
                      <select
                        value={photoOptions.document}
                        onChange={(event) => updatePhotoOption('document', event.target.value)}
                        disabled={!selectedPhotoCountry || creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        <option value="">
                          {selectedPhotoCountry ? t(TEXT.selectDocument) : t(TEXT.chooseCountryFirst)}
                        </option>
                        {photoDocuments.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.background)}</span>
                      <input
                        type="text"
                        value={photoOptions.background}
                        onChange={(event) => updatePhotoOption('background', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.sheet)}</span>
                      <select
                        value={photoOptions.sheet}
                        onChange={(event) => updatePhotoOption('sheet', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                      >
                        <option value="">{t(TEXT.standardSize)}</option>
                        <option value="10x15">10x15</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">
                      <span>{t(TEXT.targetSizeKb)}</span>
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
                  {t(TEXT.noAdvancedOptions)}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
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
                  {t(creating ? TEXT.creating : TEXT.startProcessing)}
                </button>
                {jobId && (
                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t(TEXT.newProcessing)}
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

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.liveTracking)}</h2>
              {jobId && (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700'}`}>
                  {t(STATUS_LABELS[status] ?? STATUS_LABELS.queued)}
                </span>
              )}
            </div>
            {jobId && (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  {t(TEXT.identifier)} : <span className="break-all font-mono text-slate-700">{jobId}</span>
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{t(TEXT.jobProgress)}</span>
                    <span>{progress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={t(TEXT.jobProgress)}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"
                  >
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
                  </div>
                  {((job?.stage) || (typeof job?.eta_seconds === 'number' && job.eta_seconds > 0)) && (
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
                      {job.stage && (
                        <span>
                          <span className="font-semibold text-slate-700">{t(TEXT.stage)} : </span>
                          {job.stage}
                        </span>
                      )}
                      {typeof job.eta_seconds === 'number' && job.eta_seconds > 0 && (
                        <span>
                          <span className="font-semibold text-slate-700">{t(TEXT.eta)} : </span>
                          {job.eta_seconds} {t(TEXT.seconds)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {jobLoading && !job && <p className="mt-3 text-sm text-slate-600">{t(TEXT.loadingStatus)}</p>}
            {jobError && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {jobError.message}
              </p>
            )}
            <ol className="mt-4 grid gap-3 sm:grid-cols-3 lg:gap-4">
              <Step
                title={t(TEXT.filesReady)}
                description={
                  files.length === 0
                    ? t(TEXT.notStarted)
                    : locale === 'fr'
                      ? `${files.length} fichier${files.length > 1 ? 's' : ''} sélectionné${files.length > 1 ? 's' : ''}`
                      : `${files.length} file${files.length > 1 ? 's' : ''} selected`
                }
                done={files.length > 0}
                active={files.length === 0}
              />
              <Step
                title={t(TEXT.processing)}
                description={processingDescription}
                done={status === 'done'}
                active={Boolean(jobId) && status !== 'done' && status !== 'failed'}
              />
              <Step
                title={t(TEXT.resultStep)}
                description={
                  status === 'done'
                    ? t(TEXT.resultAvailable)
                    : status === 'failed'
                      ? t(TEXT.resultFailed)
                      : t(TEXT.resultPending)
                }
                done={status === 'done'}
                active={Boolean(jobId) && status !== 'done' && status !== 'failed'}
              />
            </ol>
          </div>
        </div>

        <aside className="space-y-4 lg:space-y-3">
          {toolInfo.tool === 'compress' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:p-3">
                <h3 className="text-sm font-semibold text-slate-900">{t(TEXT.compressionOptions)}</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {t(TEXT.compressionHelp)}
                </p>
                <p className="text-xs leading-relaxed text-slate-500">
                  {t(TEXT.acceptedFormats)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <label className="grid gap-1 text-xs font-semibold text-slate-700">
                    <span>{t(TEXT.level)}</span>
                    <select
                      value={compressOptions.level}
                      onChange={(event) => updateCompressOption('level', event.target.value)}
                      disabled={creating || Boolean(compressOptions.targetSizeKb)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
                    >
                      <option value="">{t(TEXT.default)}</option>
                      <option value="basic">{t(TEXT.basic)}</option>
                      <option value="medium">{t(TEXT.medium)}</option>
                      <option value="max">{t(TEXT.max)}</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-700">
                    <span>{t(TEXT.targetSizeKb)}</span>
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
            </div>
          )}
          {job && (status === 'failed' || status === 'done') && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
              {status === 'failed' && (
                <div>
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {job.error?.message ?? t(TEXT.processingFailed)}
                  </p>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t(TEXT.retry)}
                  </button>
                </div>
              )}
              {status === 'done' && (
                <div>
                  <button
                    type="button"
                    onClick={handleDownloadResult}
                    disabled={downloading}
                    className="mt-3 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-50"
                  >
                    {t(downloading ? TEXT.retrieving : TEXT.getResult)}
                  </button>
                  {downloadedJobId === jobId && downloadError && (
                    <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {downloadError.message}
                    </p>
                  )}
                  {downloadedJobId === jobId && !downloadError && !downloading && (
                    <p className="mt-3 text-sm text-emerald-700">{t(TEXT.downloadStarted)}</p>
                  )}
                </div>
              )}
            </div>
          )}
          {toolInfo.tool === 'photo_id' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.photoSpecs)}</h2>
                <button
                  type="button"
                  onClick={getPhotoSpecs}
                  disabled={specsLoading}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {t(specsLoading ? TEXT.loading : TEXT.refresh)}
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
              <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.similarTools)}</h2>
              <div className="mt-4 space-y-2">
                {relatedTools.map((item) => (
                  <Link
                    key={item.tool}
                    to={`/tools/${item.tool}`}
                    className="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-sky-300 hover:text-sky-700"
                  >
                    {locale === 'en' ? item.nameEn : item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 lg:hidden">
            <h2 className="text-sm font-semibold text-sky-900">{t(TEXT.needAnotherTool)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-sky-800">
              {t(TEXT.catalogueHelp)}
            </p>
            <Link to="/catalogue" className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
              {t(TEXT.viewCatalogue)}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
