import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDownload,
  FiFile,
  FiRefreshCw,
  FiShield,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'
import ImagesOrder from '@/components/ImagesOrder.jsx'
import PdfPageReorder from '@/components/PdfPageReorder.jsx'
import PdfPageSelector from '@/components/PdfPageSelector.jsx'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'
import { useEnabledTools } from '@/hooks/useEnabledTools.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useCatalog } from '@/hooks/useCatalog.js'
import { useEvents } from '@/hooks/useEvents.js'
import { useJob } from '@/hooks/useJob.js'
import { useJobDownload } from '@/hooks/useJobDownload.js'
import { useJobsManager } from '@/hooks/useJobsManager.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { usePublicLimits } from '@/hooks/usePublicLimits.js'

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
  'w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50'

const TEXT = {
  unknownTool: { fr: 'Outil inconnu', en: 'Unknown tool' },
  unknownToolDescription: {
    fr: 'Cet outil ne fait pas partie du catalogue.',
    en: 'This tool is not part of the catalogue.',
  },
  disabledTool: { fr: 'Outil indisponible', en: 'Tool unavailable' },
  disabledToolDescription: {
    fr: 'Cet outil est actuellement désactivé par l’administration.',
    en: 'This tool is currently disabled by the administrator.',
  },
  backCatalogue: { fr: 'Retour au catalogue', en: 'Back to the catalogue' },
  catalogue: { fr: 'Catalogue', en: 'Catalog' },
  breadcrumb: { fr: 'Fil d’Ariane', en: 'Breadcrumb' },
  workspace: { fr: 'Espace de travail', en: 'Workspace' },
  secured: { fr: 'Traitement sécurisé', en: 'Secure processing' },
  uploadHint: { fr: 'Glissez vos fichiers ou parcourez votre appareil', en: 'Drag your files or browse your device' },
  levelHelp: { fr: 'Choisissez le niveau de compression souhaité.', en: 'Select the compression level you want.' },
  hintAuto: { fr: 'Réglage automatique', en: 'Automatic' },
  hintFast: { fr: 'Traitement rapide', en: 'Fast processing' },
  hintBalanced: { fr: 'Qualité équilibrée', en: 'Balanced quality' },
  hintOptimal: { fr: 'Gain maximal', en: 'Maximum gain' },
  targetHelp: { fr: 'Ou fixez une taille cible en Ko.', en: 'Or set a target size in KB.' },
  resultReady: { fr: 'Votre fichier est prêt', en: 'Your file is ready' },
  viewHistory: { fr: 'Voir dans l’historique →', en: 'View in history →' },
  download: { fr: 'Télécharger le fichier', en: 'Download the file' },
  dropFiles: { fr: 'Déposez vos fichiers ici', en: 'Drop your files here' },
  clickSelect: { fr: 'ou cliquez pour les sélectionner', en: 'or click to select them' },
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
  allPages: { fr: 'Toutes les pages', en: 'All pages' },
  format: { fr: 'Format', en: 'Format' },
  resolution: { fr: 'Résolution (dpi)', en: 'Resolution (dpi)' },
  resolutionPlaceholder: { fr: '72 à 600', en: '72 to 600' },
  pageRanges: { fr: 'Plages de pages', en: 'Page ranges' },
  pageOrder: { fr: 'Ordre des pages', en: 'Page order' },
  defaultOrder: { fr: 'Ordre par défaut', en: 'Default order' },
  imagesOrderHelp: {
    fr: 'Les images sont assemblées dans l’ordre du panneau « Ordre des images », à droite.',
    en: 'Images are assembled in the order shown in the “Image order” panel on the right.',
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
  maxFilesError: {
    fr: 'Vous pouvez sélectionner au maximum {n} fichiers.',
    en: 'You can select up to {n} files.',
  },
  maxFileSizeError: {
    fr: 'Un fichier ne peut pas dépasser {n} Mo.',
    en: 'A file cannot exceed {n} MB.',
  },
  maxTotalSizeError: {
    fr: 'La taille totale ne peut pas dépasser {n} Mo.',
    en: 'The total size cannot exceed {n} MB.',
  },
  maxFilesHint: { fr: '{n} fichiers max.', en: 'Up to {n} files' },
  maxFileSizeHint: { fr: '{n} Mo par fichier', en: '{n} MB per file' },
  maxTotalSizeHint: { fr: '{n} Mo au total', en: '{n} MB in total' },
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

const LIMIT_ERRORS = {
  max_files: TEXT.maxFilesError,
  max_file_mb: TEXT.maxFileSizeError,
  max_total_mb: TEXT.maxTotalSizeError,
}

// Remplace le symbole {n} par la valeur de limite renvoyée par l'API.
function limitMessage(code, value, t) {
  return t(LIMIT_ERRORS[code]).replace('{n}', String(value))
}

// Libellés des statuts documentés pour un job.
const STATUS_LABELS = {
  queued: { fr: 'En attente', en: 'Queued' },
  running: { fr: 'En cours', en: 'Running' },
  done: { fr: 'Terminé', en: 'Done' },
  failed: { fr: 'Échec', en: 'Failed' },
}

const STATUS_STYLES = {
  queued: 'bg-surface-strong text-ink-muted',
  running: 'bg-sky-500/10 text-sky-700 dark:text-sky-200',
  done: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  failed: 'bg-red-500/10 text-red-700 dark:text-red-200',
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
    <li
      className={`flex gap-2.5 rounded-xl p-2.5 transition ${
        done
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
          : active
            ? 'bg-brand-surface/70 text-brand-soft'
            : 'bg-surface-muted/60 text-ink-muted'
      } ${className}`}
    >
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ring-2 ring-surface ${
          done ? 'bg-emerald-500 text-white' : active ? 'bg-brand text-white' : 'bg-surface-strong text-ink-faint'
        }`}
      >
        {done ? (
          <FiCheckCircle aria-hidden="true" className="h-4 w-4" />
        ) : (
          <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : 'bg-line-strong'}`} />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-ink-faint">{description}</p>
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
      <p className="text-sm text-ink-muted">{countriesLabel}</p>
      {countries.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {countries.map((item) => (
            <li key={item.value} className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-200">
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
  const { isEnabled } = useEnabledTools()
  const { limits, validateFiles } = usePublicLimits()
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
  const [selectedPdfPages, setSelectedPdfPages] = useState([])

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
  const pdfFile =
    toolInfo?.tool === 'pdf_to_images' || toolInfo?.tool === 'pdf_reorder'
      ? files.find((item) => item.type === 'application/pdf' || item.name.toLowerCase().endsWith('.pdf'))
      : null
  const category = TOOL_CATEGORIES.find((item) => item.id === toolInfo?.category)
  const categoryLabel =
    locale === 'en' ? category?.labelEn ?? toolInfo?.category : category?.label ?? toolInfo?.category
  const status = job?.status
  const progress = typeof job?.progress === 'number' ? Math.min(100, Math.max(0, job.progress)) : 0
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
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
        <h1 className="text-2xl font-semibold text-ink">{t(TEXT.unknownTool)}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t(TEXT.unknownToolDescription)}</p>
        <Link to="/catalogue" className="mt-6 inline-block text-sky-600 hover:text-sky-700">
          {t(TEXT.backCatalogue)}
        </Link>
      </section>
    )
  }

  // Un outil désactivé reste inaccessible même par URL directe.
  if (!isEnabled(tool)) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">{t(TEXT.disabledTool)}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t(TEXT.disabledToolDescription)}</p>
        <Link to="/catalogue" className="mt-6 inline-block text-sky-600 hover:text-sky-700">
          {t(TEXT.backCatalogue)}
        </Link>
      </section>
    )
  }

  const toolName = locale === 'en' ? toolInfo.nameEn : toolInfo.name
  const toolDescription = locale === 'en' ? toolInfo.descriptionEn : toolInfo.description
  const relatedTools = TOOLS.filter(
    (item) =>
      item.category === toolInfo.category && item.tool !== toolInfo.tool && isEnabled(item.tool),
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

    const validation = validateFiles(files)
    if (validation.error) {
      setLocalError(limitMessage(validation.error, validation.value, t))
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

    if (toolInfo.tool === 'pdf_reorder') {
      const order = Array.isArray(toolOptions.order)
        ? toolOptions.order
        : parsePageOrder(toolOptions.order)
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

    setLocalError(null)
    const payload = await createJob(files, toolInfo.tool, options)
    if (payload === null) {
      return
    }
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
    const validation = validateFiles(selected)
    if (validation.error) {
      setFiles([])
      setLocalError(limitMessage(validation.error, validation.value, t))
      return
    }

    setFiles(validation.files)
    if (tool === 'pdf_to_images') {
      setSelectedPdfPages([])
      setToolOptions((current) => ({ ...current, pages: 'all' }))
    }
    if (tool === 'pdf_reorder') {
      setToolOptions((current) => ({ ...current, order: '' }))
    }
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

  // La sélection visuelle alimente directement l'option documentée `pages`.
  function handlePdfPagesChange(pages) {
    setSelectedPdfPages(pages)
    setToolOptions((current) => ({ ...current, pages: pages.length > 0 ? pages : 'all' }))
    setLocalError(null)
  }

  function handlePdfPageOrderChange(order) {
    setToolOptions((current) => ({ ...current, order }))
    setLocalError(null)
  }

  // Convertit une saisie « 3, 1, 2 » en liste de numéros de pages valides.
  function parsePageOrder(value) {
    return String(value)
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0)
  }

  function resetTool() {
    setFiles([])
    setJobId(null)
    setDownloadedJobId(null)
    setLocalError(null)
    setPhotoOptions({ country: '', document: '', background: '', sheet: '', maxSizeKb: '' })
    setCompressOptions({ level: '', targetSizeKb: '' })
    setSelectedPdfPages([])
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
      <nav aria-label={t(TEXT.breadcrumb)} className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
        <Link to="/catalogue" className="text-sky-700 hover:text-sky-800">
          {t(TEXT.catalogue)}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{categoryLabel}</span>
        <span aria-hidden="true">/</span>
        <span className="text-ink-soft">{toolName}</span>
      </nav>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-surface shadow-xl shadow-slate-900/5 ring-1 ring-line/40">
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-600" />
            <div className="p-5 lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-soft">
                    <FiCpu aria-hidden="true" className="h-3.5 w-3.5" />
                    {categoryLabel}
                  </span>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink lg:text-3xl">{toolName}</h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{toolDescription}</p>
                </div>
                <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200 sm:inline-flex">
                  <FiShield aria-hidden="true" className="h-3.5 w-3.5" />
                  {t(TEXT.secured)}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-faint">{t(TEXT.workspace)}</h2>
                  {files.length > 0 && (
                    <span className="rounded-full bg-surface-strong px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                      {files.length}{' '}
                      {locale === 'fr'
                        ? files.length > 1 ? 'fichiers' : 'fichier'
                        : files.length > 1 ? 'files' : 'file'}{' '}
                      · {formatFileSize(totalSize, locale)}
                    </span>
                  )}
                </div>
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
                  className={`group relative mt-3 overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 ${
                    isDragging
                      ? 'scale-[1.01] border-brand bg-brand-surface/70 shadow-lg shadow-brand/10'
                      : 'border-line-strong bg-surface-muted/60 hover:border-brand hover:bg-brand-surface/60'
                  }`}
                >
                  <input
                    id="job-files"
                    type="file"
                    multiple
                    onChange={(event) => handleFiles(event.target.files)}
                    className="sr-only"
                  />
                  <label htmlFor="job-files" className="flex cursor-pointer flex-col items-center">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-2xl bg-surface shadow-lg shadow-slate-900/5 ring-1 ring-line/50 transition duration-200 group-hover:scale-105 ${
                        isDragging ? 'text-brand-soft' : 'text-brand'
                      }`}
                    >
                      <FiUploadCloud aria-hidden="true" className="h-7 w-7" />
                    </span>
                    <span className="mt-4 text-sm font-semibold text-ink">{t(TEXT.dropFiles)}</span>
                    <span className="mt-1 text-xs text-ink-faint">{t(TEXT.uploadHint)}</span>
                    <span className="mt-1 text-[11px] text-ink-faint">
                      {[
                        limits.maxFiles ? t(TEXT.maxFilesHint).replace('{n}', String(limits.maxFiles)) : null,
                        limits.maxFileMb ? t(TEXT.maxFileSizeHint).replace('{n}', String(limits.maxFileMb)) : null,
                        limits.maxTotalMb ? t(TEXT.maxTotalSizeHint).replace('{n}', String(limits.maxTotalMb)) : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand/20 transition group-hover:bg-brand-soft">
                      {t(TEXT.clickSelect)}
                      <FiArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                  </label>
                </div>

                {files.length > 0 && toolInfo.tool === 'images_to_pdf' && (
                  <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto pb-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-line/50"
                      >
                        {previews[index] ? (
                          <img src={previews[index]} alt={file.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full w-full place-items-center">
                            <FiFile aria-hidden="true" className="h-5 w-5 text-ink-faint" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                          disabled={creating}
                          aria-label={t(TEXT.remove)}
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-lg bg-surface/90 text-ink-faint shadow transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                        >
                          <FiX aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {files.length > 0 && toolInfo.tool !== 'images_to_pdf' && (
                  <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2.5 transition hover:bg-surface-strong"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-muted text-[10px] font-bold text-ink-faint ring-1 ring-line/50">
                            {previews[index] ? (
                              <img src={previews[index]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <FiFile aria-hidden="true" className="h-5 w-5 text-ink-faint" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                            <p className="mt-0.5 text-xs text-ink-faint">{formatFileSize(file.size, locale)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                          disabled={creating}
                          aria-label={t(TEXT.remove)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                        >
                          <FiX aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

              {hasAdvancedOptions && toolInfo.tool !== 'compress' && toolInfo.tool !== 'photo_id' && (
                <div className="mt-4 space-y-3 rounded-xl bg-surface-muted/70 p-4 lg:p-3">
                  <h3 className="text-sm font-semibold text-ink">{t(TEXT.advancedOptions)}</h3>
                  {toolInfo.tool === 'pdf_to_images' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="grid gap-1 text-xs font-semibold text-ink-soft">
                        <span>{t(TEXT.pages)}</span>
                        <span className={`${OPTION_INPUT_CLASS} truncate`}>
                          {Array.isArray(toolOptions.pages)
                            ? toolOptions.pages.join(', ')
                            : t(TEXT.allPages)}
                        </span>
                      </div>
                      <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                      <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                    <div className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.pageOrder)}</span>
                      <span className={`${OPTION_INPUT_CLASS} truncate`}>
                        {Array.isArray(toolOptions.order)
                          ? toolOptions.order.join(', ')
                          : t(TEXT.defaultOrder)}
                      </span>
                    </div>
                  )}
                  {toolInfo.tool === 'images_to_pdf' && (
                    <p className="text-xs leading-relaxed text-ink-muted">
                      {t(TEXT.imagesOrderHelp)}
                    </p>
                  )}
                  {toolInfo.tool === 'pdf_sign' && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                        <span>{t(TEXT.signatureText)}</span>
                        <input
                          type="text"
                          value={toolOptions.signatureText}
                          onChange={(event) => updateToolOption('signatureText', event.target.value)}
                          disabled={creating}
                          className={OPTION_INPUT_CLASS}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                      <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
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
                <div className="mt-4 space-y-3 rounded-xl bg-surface-muted/70 p-4 lg:p-3">
                  <h3 className="text-sm font-semibold text-ink">{t(TEXT.photoOptions)}</h3>
                  {specsLoading && <p className="text-sm text-ink-muted">{t(TEXT.loadingCountries)}</p>}
                  {specsError && (
                    <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
                      {specsError.message}
                    </p>
                  )}
                  {photoSetupUnavailable && !specsError && (
                    <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      {t(TEXT.noCountriesConfigured)}
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.country)}</span>
                      <select
                        value={selectedPhotoCountry}
                        onChange={(event) => updatePhotoOption('country', event.target.value)}
                        disabled={specsLoading || photoCountries.length === 0 || creating}
                        className="w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                      >
                        {photoCountries.length === 0 && <option value="">{t(TEXT.noCountries)}</option>}
                        {photoCountries.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.document)}</span>
                      <select
                        value={photoOptions.document}
                        onChange={(event) => updatePhotoOption('document', event.target.value)}
                        disabled={!selectedPhotoCountry || creating}
                        className="w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
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
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.background)}</span>
                      <input
                        type="text"
                        value={photoOptions.background}
                        onChange={(event) => updatePhotoOption('background', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.sheet)}</span>
                      <select
                        value={photoOptions.sheet}
                        onChange={(event) => updatePhotoOption('sheet', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                      >
                        <option value="">{t(TEXT.standardSize)}</option>
                        <option value="10x15">10x15</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-ink-soft">
                      <span>{t(TEXT.targetSizeKb)}</span>
                      <input
                        type="number"
                        min="1"
                        value={photoOptions.maxSizeKb}
                        onChange={(event) => updatePhotoOption('maxSizeKb', event.target.value)}
                        disabled={creating}
                        className="w-full rounded-lg bg-surface px-3 py-2 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>
              )}
              {!hasAdvancedOptions && (
                <p className="mt-4 text-xs text-ink-faint">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                >
                  {t(creating ? TEXT.creating : TEXT.startProcessing)}
                  <FiArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                {jobId && (
                  <button
                    type="button"
                    onClick={resetTool}
                    className="inline-flex items-center gap-2 rounded-xl bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-muted transition hover:bg-surface-strong"
                  >
                    <FiRefreshCw aria-hidden="true" className="h-4 w-4" />
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
          </div>

        </div>

        <aside className="space-y-4 lg:space-y-3">
          {toolInfo.tool === 'compress' && (
            <div className="rounded-2xl bg-surface-muted/60 p-5 lg:p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                  {t(TEXT.compressionOptions)}
                </h2>
                <FiCpu aria-hidden="true" className="h-4 w-4 text-sky-500" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{t(TEXT.levelHelp)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { value: '', label: t(TEXT.default), hint: t(TEXT.hintAuto) },
                  { value: 'basic', label: t(TEXT.basic), hint: t(TEXT.hintFast) },
                  { value: 'medium', label: t(TEXT.medium), hint: t(TEXT.hintBalanced) },
                  { value: 'max', label: t(TEXT.max), hint: t(TEXT.hintOptimal) },
                ].map((option) => {
                  const active = compressOptions.level === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={creating || Boolean(compressOptions.targetSizeKb)}
                      onClick={() => updateCompressOption('level', option.value)}
                      className={`rounded-xl px-3 py-2.5 text-left transition disabled:opacity-50 ${
                        active
                          ? 'bg-brand text-white shadow-lg shadow-brand/20'
                          : 'bg-surface text-ink-muted hover:bg-surface-strong hover:text-brand'
                      }`}
                    >
                      <span className={`block text-xs font-semibold ${active ? 'text-white' : 'text-ink'}`}>
                        {option.label}
                      </span>
                      <span className={`mt-0.5 block text-[10px] ${active ? 'text-white/70' : 'text-ink-faint'}`}>{option.hint}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 border-t border-line/50 pt-4">
                <p className="text-xs font-semibold text-ink-soft">{t(TEXT.targetSizeKb)}</p>
                <p className="mt-1 text-[11px] text-ink-faint">{t(TEXT.targetHelp)}</p>
                <div className="relative mt-2">
                  <input
                    type="number"
                    min="1"
                    value={compressOptions.targetSizeKb}
                    onChange={(event) => updateCompressOption('targetSizeKb', event.target.value)}
                    disabled={creating || Boolean(compressOptions.level)}
                    className="w-full rounded-xl bg-surface py-2.5 pl-3 pr-12 text-sm text-ink ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                    placeholder="500"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-faint">
                    Ko
                  </span>
                </div>
              </div>
              <p className="mt-4 rounded-lg bg-surface-muted px-3 py-2 text-[11px] leading-relaxed text-ink-faint">
                {t(TEXT.acceptedFormats)}
              </p>
            </div>
          )}
          <div className="rounded-2xl bg-surface-muted/60 p-5 lg:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-ink">
                <FiCpu aria-hidden="true" className="h-4 w-4 text-sky-500" />
                {t(TEXT.liveTracking)}
              </h2>
              {jobId && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_STYLES[status] ?? 'bg-surface-strong text-ink-muted'}`}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === 'done'
                        ? 'bg-emerald-500'
                        : status === 'failed'
                          ? 'bg-red-500'
                          : status === 'running'
                            ? 'animate-pulse bg-sky-500'
                            : 'bg-line-strong'
                    }`}
                  />
                  {t(STATUS_LABELS[status] ?? STATUS_LABELS.queued)}
                </span>
              )}
            </div>
            {jobId && (
              <>
                <p className="mt-3 truncate rounded-lg bg-surface-muted px-3 py-2 font-mono text-[11px] text-ink-faint">
                  {t(TEXT.identifier)} · {jobId}
                </p>
                <div className="mt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                      {t(TEXT.jobProgress)}
                    </span>
                    <span className="text-lg font-bold tabular-nums text-ink">{progress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={t(TEXT.jobProgress)}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-strong"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-[0_0_12px_rgba(14,165,233,0.5)] transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {((job?.stage) || (typeof job?.eta_seconds === 'number' && job.eta_seconds > 0)) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.stage && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:text-sky-200">
                          <FiCpu aria-hidden="true" className="h-3 w-3" />
                          {job.stage}
                        </span>
                      )}
                      {typeof job.eta_seconds === 'number' && job.eta_seconds > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-strong px-2.5 py-1 text-[11px] font-medium text-ink-muted">
                          <FiClock aria-hidden="true" className="h-3 w-3" />
                          {t(TEXT.eta)} {job.eta_seconds} {t(TEXT.seconds)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {jobLoading && !job && <p className="mt-3 text-sm text-ink-muted">{t(TEXT.loadingStatus)}</p>}
            {jobError && (
              <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
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
          {toolInfo.tool === 'pdf_to_images' && (
            <PdfPageSelector
              file={pdfFile}
              selectedPages={selectedPdfPages}
              onChange={handlePdfPagesChange}
              maxPages={limits.maxPdfPages}
            />
          )}
          {toolInfo.tool === 'pdf_reorder' && (
            <PdfPageReorder file={pdfFile} onChange={handlePdfPageOrderChange} />
          )}
          {toolInfo.tool === 'images_to_pdf' && (
            <ImagesOrder files={files} previews={previews} onChange={setFiles} disabled={creating} />
          )}
          {job && (status === 'failed' || status === 'done') && (
            <div
              className={`rounded-2xl p-5 lg:p-4 ${
                status === 'done' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}
            >
              {status === 'failed' && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-200">
                      <FiAlertCircle aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-bold text-red-700 dark:text-red-200">{t(TEXT.resultFailed)}</p>
                  </div>
                  <p
                    role="alert"
                    className="mt-3 rounded-lg bg-surface/70 p-3 text-xs leading-relaxed text-red-700 dark:text-red-200"
                  >
                    {job.error?.message ?? t(TEXT.processingFailed)}
                  </p>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-700 dark:text-red-200 transition hover:bg-red-500/20"
                  >
                    <FiRefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                    {t(TEXT.retry)}
                  </button>
                </div>
              )}
              {status === 'done' && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-200">
                      <FiCheckCircle aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-200">{t(TEXT.resultReady)}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-300">{t(TEXT.resultAvailable)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadResult}
                    disabled={downloading}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl disabled:translate-y-0 disabled:opacity-50"
                  >
                    <FiDownload aria-hidden="true" className="h-4 w-4" />
                    {t(downloading ? TEXT.retrieving : TEXT.download)}
                  </button>
                  <Link
                    to="/jobs"
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 transition hover:bg-emerald-500/20"
                  >
                    {t(TEXT.viewHistory)}
                  </Link>
                  {downloadedJobId === jobId && downloadError && (
                      <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-200">
                      {downloadError.message}
                    </p>
                  )}
                  {downloadedJobId === jobId && !downloadError && !downloading && (
                    <p className="mt-3 text-center text-xs font-medium text-emerald-700 dark:text-emerald-200">
                      {t(TEXT.downloadStarted)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {toolInfo.tool === 'photo_id' && (
            <div className="rounded-2xl bg-surface-muted/60 p-5 lg:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink">{t(TEXT.photoSpecs)}</h2>
                <button
                  type="button"
                  onClick={getPhotoSpecs}
                  disabled={specsLoading}
                  className="rounded-lg bg-surface px-3 py-2 text-sm text-ink-muted ring-1 ring-line hover:bg-surface-strong disabled:opacity-50"
                >
                  {t(specsLoading ? TEXT.loading : TEXT.refresh)}
                </button>
              </div>
              {specsError && (
                <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
                  {specsError.message}
                </p>
              )}
              <PhotoSpecSummary countries={photoCountries} excluded={photoExcluded} />
            </div>
          )}

          {relatedTools.length > 0 && (
            <div className="rounded-2xl bg-surface p-5 ring-1 ring-line/40 lg:hidden">
              <h2 className="text-lg font-semibold text-ink">{t(TEXT.similarTools)}</h2>
              <div className="mt-4 space-y-2">
                {relatedTools.map((item) => (
                  <Link
                    key={item.tool}
                    to={`/tools/${item.tool}`}
                    className="block rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-brand"
                  >
                    {locale === 'en' ? item.nameEn : item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-brand-surface p-6 lg:hidden">
            <h2 className="text-sm font-semibold text-brand-soft">{t(TEXT.needAnotherTool)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t(TEXT.catalogueHelp)}
            </p>
            <Link to="/catalogue" className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-soft">
              {t(TEXT.viewCatalogue)}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
