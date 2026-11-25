import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCamera,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCpu,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiRefreshCw,
  FiSend,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { useLocale } from '@/hooks/useLocale.js'
import { useAdmin } from '@/hooks/useAdmin.js'
import { useCatalog } from '@/hooks/useCatalog.js'
import { TOOLS } from '@/config/tools.js'

const TEXT = {
  controlRoom: { fr: 'Centre de contrôle', en: 'Control room' },
  title: { fr: 'Administration NanoFile', en: 'NanoFile administration' },
  intro: {
    fr: 'Pilotage complet de la plateforme. Données et actions réservées aux sessions autorisées.',
    en: 'Full platform control. Data and actions restricted to authorized sessions.',
  },
  refreshTab: { fr: 'Actualiser cet onglet', en: 'Refresh this tab' },
  loading: { fr: 'Chargement des données administratives…', en: 'Loading administrative data…' },
  overview: { fr: 'Vue d’ensemble', en: 'Overview' },
  overviewHelp: { fr: 'Indicateurs généraux des 30 derniers jours.', en: 'Key metrics for the last 30 days.' },
  users: { fr: 'Utilisateurs', en: 'Users' },
  usersHelp: { fr: 'Cliquez sur une carte pour ouvrir la gestion du compte.', en: 'Click a card to open the account management page.' },
  activity: { fr: 'Activité par outil', en: 'Activity by tool' },
  activityHelp: { fr: 'Requêtes réussies sur 30 jours.', en: 'Successful requests over 30 days.' },
  documents: { fr: 'Documents traités', en: 'Documents processed' },
  documentsHelp: { fr: 'Volume traité par outil sur 30 jours.', en: 'Processed volume by tool over 30 days.' },
  ranking: { fr: 'Classement des outils', en: 'Tool ranking' },
  rankingHelp: { fr: 'Détail des requêtes et documents par outil.', en: 'Requests and documents per tool.' },
  tool: { fr: 'Outil', en: 'Tool' },
  requests: { fr: 'Requêtes réussies', en: 'Successful requests' },
  processed: { fr: 'Documents traités', en: 'Documents processed' },
  totalUsers: { fr: 'Utilisateurs', en: 'Users' },
  totalRuns: { fr: 'Exécutions 30 j', en: 'Runs 30d' },
  totalEvents: { fr: 'Événements 30 j', en: 'Events 30d' },
  activeTools: { fr: 'Outils actifs', en: 'Active tools' },
  announcement: { fr: 'Créer une annonce', en: 'Create an announcement' },
  announcementHelp: { fr: 'Les champs title et body sont documentés par l’OpenAPI.', en: 'The title and body fields are documented in OpenAPI.' },
  titleField: { fr: 'Titre', en: 'Title' },
  bodyField: { fr: 'Message', en: 'Message' },
  send: { fr: 'Envoyer l’annonce', en: 'Send announcement' },
  runs: { fr: 'Exécutions d’outils', en: 'Tool runs' },
  runsHelp: { fr: 'Historique administratif des traitements, avec filtres locaux.', en: 'Administrative history of processing jobs, with local filters.' },
  searchRuns: { fr: 'Rechercher un outil, un utilisateur ou un ID', en: 'Search a tool, user or ID' },
  allStatuses: { fr: 'Tous les statuts', en: 'All statuses' },
  unknown: { fr: 'Indéterminé', en: 'Unknown' },
  shownRuns: { fr: 'exécutions affichées', en: 'runs shown' },
  user: { fr: 'Utilisateur', en: 'User' },
  jobId: { fr: 'Tâche', en: 'Job' },
  filterLabel: { fr: 'Filtres', en: 'Filters' },
  events: { fr: 'Événements', en: 'Events' },
  eventsHelp: { fr: 'Événements reçus par l’API.', en: 'Events received by the API.' },
  eventErrors: { fr: 'Erreurs d’événements', en: 'Event errors' },
  eventErrorsHelp: { fr: 'Événements rejetés ou en erreur, regroupés par outil et code.', en: 'Rejected or failed events, grouped by tool and code.' },
  anonymous: { fr: 'Utilisation anonyme', en: 'Anonymous usage' },
  anonymousHelp: { fr: 'Statistiques agrégées des visiteurs.', en: 'Aggregated visitor statistics.' },
  settings: { fr: 'Paramètres', en: 'Settings' },
  settingsHelp: { fr: 'Clés documentées : tools_enabled, limits, compression.', en: 'Documented keys: tools_enabled, limits, compression.' },
  settingKey: { fr: 'Clé', en: 'Key' },
  save: { fr: 'Enregistrer', en: 'Save' },
  noData: { fr: 'Aucune donnée disponible.', en: 'No data available.' },
  moreRows: { fr: 'lignes supplémentaires', en: 'additional rows' },
  noUsers: { fr: 'Aucun utilisateur exposé par l’API.', en: 'No user exposed by the API.' },
  manageUser: { fr: 'Gérer le compte', en: 'Manage account' },
  creditBalance: { fr: 'Crédits', en: 'Credits' },
  total: { fr: 'Total', en: 'Total' },
  started: { fr: 'Démarrés', en: 'Started' },
  completed: { fr: 'Terminés', en: 'Completed' },
  failed: { fr: 'En échec', en: 'Failed' },
  lastEvents: { fr: 'Derniers événements', en: 'Latest events' },
  occurrences: { fr: 'Occurrences', en: 'Occurrences' },
  requestsShort: { fr: 'Requêtes', en: 'Requests' },
  successes: { fr: 'Réussites', en: 'Successes' },
  failures: { fr: 'Échecs', en: 'Failures' },
  documentsWord: { fr: 'Documents', en: 'Documents' },
  lastUse: { fr: 'Dernière utilisation', en: 'Last used' },
  latestSessions: { fr: 'Dernières sessions', en: 'Latest sessions' },
  enabled: { fr: 'Activés', en: 'Enabled' },
  disabled: { fr: 'Désactivés', en: 'Disabled' },
  editValue: { fr: 'Modifier la valeur', en: 'Edit value' },
  adminBadge: { fr: 'Admin', en: 'Admin' },
  freePlan: { fr: 'Gratuit', en: 'Free' },
  proPlan: { fr: 'Pro', en: 'Pro' },
  maxTargetPct: { fr: 'Pourcentage cible max.', en: 'Max target pct' },
  photo: { fr: 'Photo d’identité', en: 'ID photo' },
  photoSpecs: { fr: 'Spécifications photo', en: 'Photo specifications' },
  photoSpecsHelp: { fr: 'Pays et documents disponibles exposés par l’API catalogue.', en: 'Countries and documents exposed by the catalog API.' },
  countries: { fr: 'Pays', en: 'Countries' },
  excludedCountries: { fr: 'Pays exclus', en: 'Excluded countries' },
  documentsPerCountry: { fr: 'Documents disponibles', en: 'Available documents' },
  noPhotoSpecs: { fr: 'Aucune spécification photo disponible.', en: 'No photo specification available.' },
  readOnly: {
    fr: 'Lecture seule : l’API n’expose pas de modification des pays, documents ou polices.',
    en: 'Read-only: the API does not expose editing of countries, documents or fonts.',
  },
  reason: { fr: 'Motif', en: 'Reason' },
  denied: { fr: 'Accès refusé', en: 'Access denied' },
  deniedTitle: { fr: 'Espace réservé aux administrateurs', en: 'Administrators only' },
  deniedFallback: { fr: 'Votre session ne permet pas d’accéder au centre de contrôle.', en: 'Your session cannot access the control room.' },
  actionDenied: { fr: 'L’action administrative a été refusée.', en: 'The administrative action was denied.' },
  announcementDone: { fr: 'Annonce créée.', en: 'Announcement created.' },
  settingDone: { fr: 'Paramètre mis à jour.', en: 'Setting updated.' },
  badObject: { fr: 'La valeur du paramètre doit être un objet JSON.', en: 'The setting value must be a JSON object.' },
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

const SETTING_KEYS = ['tools_enabled', 'limits', 'compression']

const TAB_IDS = ['overview', 'users', 'runs', 'events', 'errors', 'anonymous', 'photo', 'settings']

const COLUMN_LABELS = {
  id: { fr: 'ID', en: 'ID' },
  name: { fr: 'Nom', en: 'Name' },
  tool: { fr: 'Outil', en: 'Tool' },
  code: { fr: 'Code', en: 'Code' },
  files: { fr: 'Fichiers', en: 'Files' },
  input_bytes: { fr: 'Volume', en: 'Size' },
  user_id: { fr: 'ID utilisateur', en: 'User ID' },
  email: { fr: 'E-mail', en: 'Email' },
  success: { fr: 'Succès', en: 'Success' },
  status: { fr: 'Statut', en: 'Status' },
  created_at: { fr: 'Créé le', en: 'Created at' },
  started_at: { fr: 'Démarré le', en: 'Started at' },
  duration_ms: { fr: 'Durée', en: 'Duration' },
  key: { fr: 'Clé', en: 'Key' },
  value: { fr: 'Valeur', en: 'Value' },
}

function columnLabel(column, t) {
  return COLUMN_LABELS[column] ? t(COLUMN_LABELS[column]) : column.replaceAll('_', ' ')
}

function formatCell(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function normalizeRows(value) {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []

  for (const key of ['users', 'items', 'data', 'results', 'events', 'errors', 'usage', 'runs', 'tools']) {
    if (Array.isArray(value[key])) return value[key]
  }

  return Object.entries(value).map(([key, item]) => ({ key, value: item }))
}

// Les identifiants historiques utilisent indifféremment tirets et underscores.
function normalizeToolKey(value) {
  return String(value ?? '').trim().toLowerCase().replaceAll('-', '_')
}

// Les libellés officiels viennent du catalogue ; l'identifiant technique reste en infobulle.
function toolLabel(value, locale) {
  const key = normalizeToolKey(value)
  const tool = TOOLS.find((item) => normalizeToolKey(item.tool) === key)
  if (tool) return locale === 'en' ? tool.nameEn : tool.name
  return String(value ?? '')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

// Additionne les variantes d'un même outil pour éviter les lignes dupliquées.
function mergeTools(value) {
  const rows = normalizeRows(value)
  const merged = new Map()

  for (const row of rows) {
    const raw = row.tool ?? row.key ?? ''
    const key = normalizeToolKey(raw)
    const current = merged.get(key) ?? { tool: raw, successful_requests: 0, documents_processed: 0 }
    current.successful_requests = Number(current.successful_requests ?? 0) + Number(row.successful_requests ?? 0)
    current.documents_processed = Number(current.documents_processed ?? 0) + Number(row.documents_processed ?? 0)
    merged.set(key, current)
  }

  return [...merged.values()]
}

function shorten(value, size = 8) {
  const text = String(value ?? '')
  return text.length > size ? `${text.slice(0, size)}…` : text
}

const EVENT_LABELS = {
  tool_started: { fr: 'Outil démarré', en: 'Tool started' },
  tool_run_completed: { fr: 'Traitement terminé', en: 'Run completed' },
  tool_run_failed: { fr: 'Traitement en échec', en: 'Run failed' },
  job_completed: { fr: 'Tâche terminée', en: 'Job completed' },
  job_failed: { fr: 'Tâche en échec', en: 'Job failed' },
}

function eventLabel(value, locale) {
  const key = String(value ?? '')
  const label = EVENT_LABELS[key]
  if (label) return locale === 'en' ? label.en : label.fr
  return key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const LIMIT_LABELS = {
  max_file_mb_anon: { fr: 'Taille max. par fichier (invité)', en: 'Max file size (guest)' },
  max_file_mb_user: { fr: 'Taille max. par fichier (utilisateur)', en: 'Max file size (user)' },
  max_total_mb_anon: { fr: 'Volume total max. (invité)', en: 'Max total size (guest)' },
  max_total_mb_user: { fr: 'Volume total max. (utilisateur)', en: 'Max total size (user)' },
  max_files_anon: { fr: 'Nombre max. de fichiers (invité)', en: 'Max files (guest)' },
  max_files_user: { fr: 'Nombre max. de fichiers (utilisateur)', en: 'Max files (user)' },
  max_pdf_pages: { fr: 'Pages PDF max.', en: 'Max PDF pages' },
  max_video_min_anon: { fr: 'Durée vidéo max. (invité)', en: 'Max video length (guest)' },
  max_video_min_user: { fr: 'Durée vidéo max. (utilisateur)', en: 'Max video length (user)' },
  user_daily_jobs: { fr: 'Tâches quotidiennes', en: 'Daily jobs' },
  user_daily_renders: { fr: 'Rendus quotidiens', en: 'Daily renders' },
}

function limitLabel(key, locale) {
  const label = LIMIT_LABELS[key]
  return label ? (locale === 'en' ? label.en : label.fr) : key.replaceAll('_', ' ')
}

function settingLabel(name, key, locale, t) {
  if (name === 'limits') return limitLabel(key, locale)
  if (name === 'compression' && key === 'max_target_pct') return t(TEXT.maxTargetPct)
  return key.replaceAll('_', ' ')
}

function formatDate(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return `${new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date)} UTC`
}

function formatBytes(value) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['o', 'Ko', 'Mo', 'Go']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function StatCard({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    sky: 'from-sky-500 to-cyan-500 shadow-sky-200',
    violet: 'from-violet-500 to-fuchsia-500 shadow-violet-200',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-200',
    amber: 'from-amber-500 to-orange-500 shadow-amber-200',
    rose: 'from-rose-500 to-orange-500 shadow-rose-200',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone] ?? tones.sky}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-slate-900">{value ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tones[tone] ?? tones.sky} text-white shadow-lg`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}

function Panel({ title, description, children, badge }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
        {badge}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Empty({ children }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {children}
    </div>
  )
}

function BarChart({ items, labelKey, valueKey, empty, labelFor }) {
  const rows = [...items]
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
    .slice(0, 8)
  const max = Math.max(1, ...rows.map((row) => row[valueKey] ?? 0))

  if (rows.length === 0) return <p className="mt-5 text-sm text-slate-500">{empty}</p>

  return (
    <div className="mt-5 space-y-3">
      {rows.map((row) => (
        <div key={normalizeToolKey(row[labelKey])} className="grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3 sm:grid-cols-[minmax(0,12rem)_1fr_3rem]">
          <span className="truncate text-xs font-medium text-slate-600" title={String(row[labelKey])}>
            {labelFor ? labelFor(row[labelKey]) : String(row[labelKey])}
          </span>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-[width] duration-500"
              style={{ width: `${Math.round(((row[valueKey] ?? 0) / max) * 100)}%` }}
            />
          </div>
          <span className="text-right text-xs font-bold tabular-nums text-slate-700">{row[valueKey] ?? 0}</span>
        </div>
      ))}
    </div>
  )
}

function ColumnChart({ items, labelKey, valueKey, empty, labelFor }) {
  const rows = [...items]
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
    .slice(0, 6)
  const max = Math.max(1, ...rows.map((row) => row[valueKey] ?? 0))

  if (rows.length === 0) return <p className="mt-5 text-sm text-slate-500">{empty}</p>

  return (
    <div className="mt-6 flex h-40 items-end gap-2 sm:gap-4">
      {rows.map((row) => (
        <div key={normalizeToolKey(row[labelKey])} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
          <span className="text-center text-[10px] font-bold tabular-nums text-slate-600">{row[valueKey] ?? 0}</span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all duration-500 group-hover:from-violet-500 group-hover:to-fuchsia-300"
            style={{ height: `${Math.max(6, Math.round(((row[valueKey] ?? 0) / max) * 100))}%` }}
            title={String(row[labelKey])}
          />
          <span className="truncate text-center text-[10px] text-slate-500" title={String(row[labelKey])}>
            {labelFor ? labelFor(row[labelKey]) : String(row[labelKey])}
          </span>
        </div>
      ))}
    </div>
  )
}

function DataTable({ value, empty, labelFor, columns, headerFor, renderCell }) {
  const { t } = useLocale()
  const rows = normalizeRows(value)

  if (rows.length === 0) return <Empty>{empty}</Empty>

  const keys = columns ?? Object.keys(rows[0]).slice(0, 8)
  const visibleRows = rows.slice(0, 20)

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              {keys.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-2.5">
                  {headerFor ? headerFor(column) : columnLabel(column, t)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.map((row, index) => (
              <tr key={index} className="transition hover:bg-sky-50/60">
                {keys.map((column) => (
                  <td key={column} className="max-w-[18rem] truncate px-3 py-2.5 text-slate-700" title={formatCell(row[column])}>
                    {renderCell
                      ? renderCell(column, row)
                      : column === 'tool' && labelFor
                        ? labelFor(row[column])
                        : formatCell(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > visibleRows.length && (
        <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          + {rows.length - visibleRows.length} {t(TEXT.moreRows)}
        </p>
      )}
    </div>
  )
}

function UserCards({ value, empty, t }) {
  const rows = normalizeRows(value)

  if (rows.length === 0) return <Empty>{empty}</Empty>

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rows.map((user, index) => {
        const userId = user.id ?? user.user_id ?? index
        const displayName = user.name ?? [user.first_name, user.last_name].filter(Boolean).join(' ') ?? user.email ?? `#${userId}`
        const initials = displayName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join('')
        const isAdmin = user.is_admin === true || user.role === 'admin'
        const credits = user.credits ?? user.quota?.remaining

        return (
          <Link
            key={userId}
            to={`/admin/users/${userId}`}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
              {initials || '?'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-slate-900">{displayName}</span>
              <span className="block truncate text-xs text-slate-500">{user.email ?? `#${userId}`}</span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {isAdmin && (
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">{t(TEXT.adminBadge)}</span>
                )}
                {user.plan && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 ring-1 ring-sky-100">
                    {user.plan === 'pro' ? t(TEXT.proPlan) : t(TEXT.freePlan)}
                  </span>
                )}
                {credits !== undefined && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    {formatCell(credits)} {t(TEXT.creditBalance).toLowerCase()}
                  </span>
                )}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-400 transition group-hover:text-sky-600">
              {t(TEXT.manageUser)}
              <FiChevronRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}

function ToolRanking({ value, empty, labelFor, t }) {
  const rows = [...normalizeRows(value)].sort(
    (a, b) => Number(b.successful_requests ?? 0) - Number(a.successful_requests ?? 0),
  )

  if (rows.length === 0) return <Empty>{empty}</Empty>

  const max = Math.max(1, ...rows.map((row) => Number(row.successful_requests ?? 0)))

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row, index) => (
        <article
          key={normalizeToolKey(row.tool)}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
              index < 3 ? 'from-sky-500 to-cyan-400' : 'from-slate-300 to-slate-200'
            }`}
          />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900" title={String(row.tool)}>
                {labelFor(row.tool)}
              </h3>
              <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">{String(row.tool)}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">#{index + 1}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-sky-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">{t(TEXT.requestsShort)}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{formatCell(row.successful_requests)}</p>
            </div>
            <div className="rounded-xl bg-violet-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">{t(TEXT.documentsWord)}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{formatCell(row.documents_processed)}</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
              style={{ width: `${Math.round((Number(row.successful_requests ?? 0) / max) * 100)}%` }}
            />
          </div>
        </article>
      ))}
    </div>
  )
}

function EventsView({ value, empty, labelFor, t, locale }) {
  const rows = normalizeRows(value)
  const started = rows.filter((row) => row.name === 'tool_started').length
  const completed = rows.filter((row) => row.name === 'tool_run_completed').length
  const failed = rows.filter((row) => row.name === 'tool_run_failed').length

  if (rows.length === 0) return <Empty>{empty}</Empty>

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiActivity} label={t(TEXT.total)} value={rows.length} tone="sky" />
        <StatCard icon={FiZap} label={t(TEXT.started)} value={started} tone="amber" />
        <StatCard icon={FiCheckCircle} label={t(TEXT.completed)} value={completed} tone="emerald" />
        <StatCard icon={FiAlertCircle} label={t(TEXT.failed)} value={failed} tone="violet" />
      </div>
      <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">{t(TEXT.lastEvents)}</h3>
      <DataTable
        value={rows.slice(0, 20)}
        empty={empty}
        columns={['id', 'name', 'tool', 'code', 'files', 'input_bytes']}
        headerFor={(column) => (column === 'name' ? t({ fr: 'Événement', en: 'Event' }) : columnLabel(column, t))}
        renderCell={(column, row) => {
          if (column === 'name') return eventLabel(row.name, locale)
          if (column === 'tool') return labelFor(row.tool)
          if (column === 'input_bytes') return formatBytes(row.input_bytes)
          return formatCell(row[column])
        }}
      />
    </>
  )
}

function ErrorsView({ value, empty, labelFor, t }) {
  const rows = Array.isArray(value?.errors) ? value.errors : normalizeRows(value)
  const max = Math.max(1, ...rows.map((row) => Number(row.count ?? 0)))

  if (rows.length === 0) return <Empty>{empty}</Empty>

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {rows.map((row, index) => (
        <div key={`${row.tool}-${row.code}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800" title={String(row.tool)}>
                {labelFor(row.tool)}
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">{String(row.code ?? '—')}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-sm font-bold tabular-nums text-slate-800 shadow-sm ring-1 ring-slate-200">
              {row.count ?? 0}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
              style={{ width: `${Math.round((Number(row.count ?? 0) / max) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t(TEXT.occurrences)}</p>
        </div>
      ))}
    </div>
  )
}

function AnonymousView({ value, empty, labelFor, t, locale }) {
  const rows = Array.isArray(value?.usage) ? value.usage : normalizeRows(value)

  if (rows.length === 0) return <Empty>{empty}</Empty>

  const totals = rows.reduce(
    (acc, row) => ({
      requests: acc.requests + Number(row.request_count ?? 0),
      successes: acc.successes + Number(row.success_count ?? 0),
      failures: acc.failures + Number(row.failure_count ?? 0),
      documents: acc.documents + Number(row.documents_count ?? 0),
    }),
    { requests: 0, successes: 0, failures: 0, documents: 0 },
  )

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiGlobe} label={t(TEXT.requestsShort)} value={totals.requests} tone="sky" />
        <StatCard icon={FiCheckCircle} label={t(TEXT.successes)} value={totals.successes} tone="emerald" />
        <StatCard icon={FiAlertCircle} label={t(TEXT.failures)} value={totals.failures} tone="rose" />
        <StatCard icon={FiFileText} label={t(TEXT.documentsWord)} value={totals.documents} tone="violet" />
      </div>
      <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">{t(TEXT.latestSessions)}</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {rows.slice(0, 20).map((row, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-bold text-slate-800" title={String(row.tool)}>
                {labelFor(row.tool)}
              </p>
              <span className="shrink-0 rounded-lg bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                {formatCell(row.request_count)} {t(TEXT.requestsShort).toLowerCase()}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
              <span>{t(TEXT.successes)} : <strong className="text-emerald-600">{formatCell(row.success_count)}</strong></span>
              <span>{t(TEXT.failures)} : <strong className="text-rose-600">{formatCell(row.failure_count)}</strong></span>
              <span>{t(TEXT.documentsWord)} : <strong className="text-slate-700">{formatCell(row.documents_count)}</strong></span>
            </div>
            <p className="mt-2 truncate font-mono text-[10px] text-slate-400" title={String(row.device_id ?? '')}>
              {shorten(row.ip_hash)} · {shorten(row.device_id)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              {t(TEXT.lastUse)} : {formatDate(row.last_used_at, locale)}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

function photoCountries(specs) {
  const source = Array.isArray(specs) ? specs : (specs?.countries ?? [])
  return source
    .map((item) => {
      if (typeof item === 'string') return { code: item, name: item, documents: [] }
      const code = String(item?.code ?? item?.id ?? item?.name ?? '')
      const rawDocuments = item?.documents ?? item?.document_types ?? item?.types ?? []
      return {
        code,
        name: String(item?.name ?? item?.label ?? item?.title ?? code),
        documents: rawDocuments
          .map((document) =>
            typeof document === 'string'
              ? document
              : String(document?.name ?? document?.label ?? document?.code ?? ''),
          )
          .filter(Boolean),
      }
    })
    .filter((item) => item.code)
}

function photoExcluded(specs) {
  const source = Array.isArray(specs?.excluded) ? specs.excluded : []
  return source
    .map((item) => ({
      code: String(item?.code ?? item?.id ?? ''),
      reason: String(item?.reason ?? ''),
    }))
    .filter((item) => item.code)
}

function PhotoView({ value, empty, t }) {
  const countries = photoCountries(value)
  const excluded = photoExcluded(value)

  if (countries.length === 0 && excluded.length === 0) return <Empty>{empty}</Empty>

  const documentCount = countries.reduce((total, country) => total + country.documents.length, 0)

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard icon={FiGlobe} label={t(TEXT.countries)} value={countries.length} tone="sky" />
        <StatCard icon={FiFileText} label={t(TEXT.documentsWord)} value={documentCount} tone="violet" />
        <StatCard icon={FiAlertCircle} label={t(TEXT.excludedCountries)} value={excluded.length} tone="rose" />
      </div>
      <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">{t(TEXT.readOnly)}</p>

      <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">{t(TEXT.countries)}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <article key={country.code} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="truncate text-sm font-bold text-slate-900">{country.name}</h4>
              <code className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{country.code}</code>
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t(TEXT.documentsPerCountry)}</p>
            {country.documents.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {country.documents.map((document, index) => (
                  <li key={`${document}-${index}`} className="rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">
                    {document}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-400">{t(TEXT.noData)}</p>
            )}
          </article>
        ))}
      </div>

      {excluded.length > 0 && (
        <>
          <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">{t(TEXT.excludedCountries)}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {excluded.map((item) => (
              <div key={item.code} className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                <code className="text-xs font-bold text-amber-800">{item.code}</code>
                <span className="text-right text-[11px] text-amber-700">{item.reason || t(TEXT.reason)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

function runTool(row) {
  return row.tool ?? row.tool_name ?? row.name ?? row.key ?? ''
}

function runDate(row) {
  return row.created_at ?? row.started_at ?? row.finished_at ?? row.completed_at ?? row.timestamp ?? ''
}

function runDocuments(row) {
  return Number(row.documents_processed ?? row.documents_count ?? row.files ?? row.documents ?? 0) || 0
}

function runUser(row) {
  return row.user_id ?? row.email ?? row.user ?? ''
}

function runDuration(row) {
  return row.duration_ms ?? row.duration ?? row.elapsed_ms ?? ''
}

function runStatus(row) {
  const raw = row.status ?? row.state ?? row.result ?? row.event ?? ''
  const value = String(raw).toLowerCase()
  if (value.includes('fail') || value.includes('error') || row.success === false) return 'failed'
  if (value.includes('success') || value.includes('complete') || value === 'done' || row.success === true) return 'success'
  return 'unknown'
}

function formatDuration(value) {
  const milliseconds = Number(value)
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return '—'
  if (milliseconds < 1000) return `${Math.round(milliseconds)} ms`
  const seconds = milliseconds / 1000
  if (seconds < 60) return `${seconds.toFixed(1)} s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min ${Math.round(seconds % 60)} s`
}

function StatusBadge({ status, t }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    failed: 'bg-rose-50 text-rose-700 ring-rose-100',
    unknown: 'bg-slate-100 text-slate-600 ring-slate-200',
  }
  const labels = { success: t(TEXT.success), failed: t(TEXT.failed), unknown: t(TEXT.unknown) }

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

// Vue administrative des exécutions : indicateurs, filtres locaux et tableau lisible.
function RunsView({ value, empty, labelFor, t, locale }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = normalizeRows(value).map((row) => ({
    ...row,
    toolName: runTool(row),
    statusKey: runStatus(row),
    dateValue: runDate(row),
    documentsValue: runDocuments(row),
    userValue: runUser(row),
    durationValue: runDuration(row),
    idValue: row.id ?? row.job_id ?? '',
  }))

  if (rows.length === 0) return <Empty>{empty}</Empty>

  const totalDocuments = rows.reduce((total, row) => total + row.documentsValue, 0)
  const successes = rows.filter((row) => row.statusKey === 'success').length
  const failures = rows.filter((row) => row.statusKey === 'failed').length
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = rows.filter((row) => {
    const matchStatus = statusFilter === 'all' || row.statusKey === statusFilter
    const haystack = [labelFor(row.toolName), row.toolName, row.userValue, row.idValue].join(' ').toLowerCase()
    return matchStatus && (!normalizedQuery || haystack.includes(normalizedQuery))
  })

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiActivity} label={t(TEXT.total)} value={rows.length} tone="sky" />
        <StatCard icon={FiCheckCircle} label={t(TEXT.successes)} value={successes} tone="emerald" />
        <StatCard icon={FiAlertCircle} label={t(TEXT.failed)} value={failures} tone="rose" />
        <StatCard icon={FiFileText} label={t(TEXT.documentsWord)} value={totalDocuments} tone="violet" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">{t(TEXT.filterLabel)}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(TEXT.searchRuns)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">{t(TEXT.allStatuses)}</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}>
            <option value="all">{t(TEXT.allStatuses)}</option>
            <option value="success">{t(TEXT.success)}</option>
            <option value="failed">{t(TEXT.failed)}</option>
            <option value="unknown">{t(TEXT.unknown)}</option>
          </select>
        </label>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        {filtered.length}/{rows.length} {t(TEXT.shownRuns)}
      </p>

      <DataTable
        value={filtered}
        empty={t(TEXT.noData)}
        columns={['tool', 'status', 'documents_processed', 'user_id', 'created_at', 'duration_ms']}
        headerFor={(column) => (column === 'documents_processed' ? t(TEXT.documentsWord) : columnLabel(column, t))}
        renderCell={(column, row) => {
          if (column === 'tool') {
            return (
              <span title={String(row.toolName)} className="font-semibold text-slate-900">
                {labelFor(row.toolName) || formatCell(row.toolName)}
              </span>
            )
          }
          if (column === 'status') return <StatusBadge status={row.statusKey} t={t} />
          if (column === 'documents_processed') return formatCell(row.documentsValue)
          if (column === 'user_id') return formatCell(row.userValue)
          if (column === 'created_at') return formatDate(row.dateValue, locale)
          if (column === 'duration_ms') return formatDuration(row.durationValue)
          return formatCell(row[column])
        }}
      />
    </>
  )
}

function SettingValue({ name, value, t, locale }) {
  if (value === null || value === undefined) return <p className="mt-4 text-sm text-slate-500">{t(TEXT.noData)}</p>

  if (name === 'tools_enabled' && value && typeof value === 'object') {
    const enabled = Object.values(value).filter(Boolean).length
    const disabled = Object.values(value).filter((item) => !item).length

    return (
      <>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
            {enabled} {t(TEXT.enabled).toLowerCase()}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {disabled} {t(TEXT.disabled).toLowerCase()}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(value).map(([key, active]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ring-1 ${
                active ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-slate-50 text-slate-400 ring-slate-200'
              }`}
              title={key}
            >
              {active ? <FiCheckCircle aria-hidden="true" className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
              {toolLabel(key, locale)}
            </span>
          ))}
        </div>
      </>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
            <dt className="truncate text-[11px] font-semibold text-slate-500" title={key}>
              {settingLabel(name, key, locale, t)}
            </dt>
            <dd className="shrink-0 text-sm font-bold tabular-nums text-slate-800">{formatCell(item)}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return <p className="mt-4 font-mono text-sm text-slate-700">{formatCell(value)}</p>
}

function SaveButton({ disabled, t }) {
  return (
    <button type="submit" disabled={disabled} className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
      <FiSettings aria-hidden="true" className="h-3.5 w-3.5" />
      {t(TEXT.save)}
    </button>
  )
}

function ToolsEditor({ value, locale, onSave, disabled, t }) {
  const [draft, setDraft] = useState(() => ({ ...value }))

  return (
    <form
      className="mt-5 grid gap-2 border-t border-slate-200 pt-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSave('tools_enabled', draft)
      }}
    >
      <p className="text-xs font-bold text-slate-700">{t(TEXT.editValue)}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(draft).map(([key, active]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700"
          >
            <span className="truncate" title={key}>{toolLabel(key, locale)}</span>
            <input
              type="checkbox"
              checked={Boolean(active)}
              onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.checked }))}
              className="h-4 w-4 shrink-0 rounded border-slate-300 accent-sky-600"
            />
          </label>
        ))}
      </div>
      <SaveButton disabled={disabled} t={t} />
    </form>
  )
}

function LimitsEditor({ value, locale, onSave, disabled, t }) {
  const [draft, setDraft] = useState(() => ({ ...value }))

  return (
    <form
      className="mt-5 grid gap-3 border-t border-slate-200 pt-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSave('limits', Object.fromEntries(Object.entries(draft).map(([key, current]) => [key, Number(current)])))
      }}
    >
      <p className="text-xs font-bold text-slate-700">{t(TEXT.editValue)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(draft).map(([key, current]) => (
          <label key={key} className="grid gap-1 text-[11px] font-semibold text-slate-600">
            <span>{limitLabel(key, locale)}</span>
            <input
              type="number"
              min="0"
              value={current}
              onChange={(event) => setDraft((data) => ({ ...data, [key]: event.target.value }))}
              className={inputClass}
            />
          </label>
        ))}
      </div>
      <SaveButton disabled={disabled} t={t} />
    </form>
  )
}

function CompressionEditor({ value, onSave, disabled, t }) {
  const [draft, setDraft] = useState(() => String(value?.max_target_pct ?? ''))

  return (
    <form
      className="mt-5 grid gap-3 border-t border-slate-200 pt-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSave('compression', { ...value, max_target_pct: Number(draft) })
      }}
    >
      <p className="text-xs font-bold text-slate-700">{t(TEXT.editValue)}</p>
      <label className="grid gap-1 text-[11px] font-semibold text-slate-600">
        <span>{t(TEXT.maxTargetPct)}</span>
        <input
          type="number"
          min="1"
          max="100"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className={inputClass}
        />
      </label>
      <SaveButton disabled={disabled} t={t} />
    </form>
  )
}

function SettingsView({ value, empty, t, locale, onSave, disabled, formError, formSuccess }) {
  const values = value && typeof value === 'object' && !Array.isArray(value) ? value : {}

  if (!Object.keys(values).length) return <Empty>{empty}</Empty>

  return (
    <>
      {formError && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</p>
      )}
      {formSuccess && (
        <p role="status" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <FiCheckCircle aria-hidden="true" className="h-4 w-4" />
          {formSuccess}
        </p>
      )}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {SETTING_KEYS.filter((key) => key in values).map((key) => (
          <section key={key} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-sm font-bold text-slate-800">{key}</h3>
              {key === 'compression' && <FiTrendingUp aria-hidden="true" className="h-5 w-5 text-violet-500" />}
            </div>
            <SettingValue name={key} value={values[key]} t={t} locale={locale} />
            {key === 'tools_enabled' && (
              <ToolsEditor
                key={JSON.stringify(values[key])}
                value={values[key]}
                locale={locale}
                onSave={onSave}
                disabled={disabled}
                t={t}
              />
            )}
            {key === 'limits' && (
              <LimitsEditor
                key={JSON.stringify(values[key])}
                value={values[key]}
                locale={locale}
                onSave={onSave}
                disabled={disabled}
                t={t}
              />
            )}
            {key === 'compression' && (
              <CompressionEditor
                key={JSON.stringify(values[key])}
                value={values[key]}
                onSave={onSave}
                disabled={disabled}
                t={t}
              />
            )}
          </section>
        ))}
      </div>
    </>
  )
}

// Navigation commune à la sidebar fixe et à la barre mobile.
function NavTabs({ tabs, activeTab, onSelect, t, vertical = false }) {
  return (
    <nav
      role="tablist"
      aria-label={t(TEXT.title)}
      className={vertical ? 'flex flex-col gap-1' : 'flex gap-2 overflow-x-auto'}
    >
      {tabs.map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onSelect(id)}
          className={`inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
            vertical ? 'w-full' : 'shrink-0'
          } ${
            activeTab === id
              ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className={vertical ? '' : 'whitespace-nowrap'}>{t(label)}</span>
        </button>
      ))}
    </nav>
  )
}

export default function AdminPage() {
  const { t, locale } = useLocale()
  const {
    dashboard,
    users,
    toolRuns,
    events,
    eventErrors,
    anonymousUsage,
    settings,
    loading,
    error,
    getAdminDashboard,
    listAdminUsers,
    createAnnouncement,
    updateAdminSetting,
    listToolRuns,
    listAdminEvents,
    listEventErrors,
    listAnonymousUsage,
    getAdminSettings,
  } = useAdmin()
  const { photoSpecs, getPhotoSpecs } = useCatalog()

  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab = TAB_IDS.includes(requestedTab) ? requestedTab : 'overview'
  const setActiveTab = (id) => setSearchParams({ tab: id })

  const [announcement, setAnnouncement] = useState({ title: '', body: '' })
  const [settingError, setSettingError] = useState(null)
  const [settingSuccess, setSettingSuccess] = useState(null)

  // Chaque onglet ne déclenche que son propre chargement lorsqu'il est ouvert.
  const loaders = useMemo(
    () => ({
      overview: getAdminDashboard,
      users: listAdminUsers,
      runs: listToolRuns,
      events: listAdminEvents,
      errors: listEventErrors,
      anonymous: listAnonymousUsage,
      photo: getPhotoSpecs,
      settings: getAdminSettings,
    }),
    [
      getAdminDashboard,
      listAdminUsers,
      listToolRuns,
      listAdminEvents,
      listEventErrors,
      listAnonymousUsage,
      getPhotoSpecs,
      getAdminSettings,
    ],
  )

  useEffect(() => {
    loaders[activeTab]?.()
  }, [activeTab, loaders])

  async function runAction(action, successMessage) {
    setSettingError(null)
    setSettingSuccess(null)

    const payload = await action()
    if (!payload) {
      setSettingError(t(TEXT.actionDenied))
      return
    }

    setSettingSuccess(successMessage)
  }

  async function handleAnnouncement(event) {
    event.preventDefault()
    await runAction(
      () => createAnnouncement({ title: announcement.title.trim(), body: announcement.body.trim() }),
      t(TEXT.announcementDone),
    )
  }

  async function saveSetting(key, value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      setSettingError(t(TEXT.badObject))
      setSettingSuccess(null)
      return
    }

    await runAction(() => updateAdminSetting(key, value), t(TEXT.settingDone))
    await getAdminSettings()
  }

  if (error?.status === 401 || error?.status === 403) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-8 shadow-sm">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-100 text-red-600">
            <FiShield aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-red-600">{t(TEXT.denied)}</p>
          <h1 className="mt-2 text-2xl font-bold text-red-900">{t(TEXT.deniedTitle)}</h1>
          <p className="mt-3 text-sm leading-relaxed text-red-800">
            {error.message ?? t(TEXT.deniedFallback)}
          </p>
        </div>
      </section>
    )
  }

  const tools = mergeTools(dashboard?.tools)
  const labelFor = (value) => toolLabel(value, locale)
  const tabs = [
    ['overview', TEXT.overview, FiBarChart2],
    ['users', TEXT.users, FiUsers],
    ['runs', TEXT.runs, FiFileText],
    ['events', TEXT.events, FiActivity],
    ['errors', TEXT.eventErrors, FiAlertCircle],
    ['anonymous', TEXT.anonymous, FiGlobe],
    ['photo', TEXT.photo, FiCamera],
    ['settings', TEXT.settings, FiSettings],
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-violet-400 to-cyan-500" />
          <div className="flex flex-wrap items-start justify-between gap-5 p-5 lg:p-7">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-100">
                <FiCpu aria-hidden="true" className="h-3.5 w-3.5" />
                {t(TEXT.controlRoom)}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">{t(TEXT.title)}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{t(TEXT.intro)}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 lg:hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <NavTabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} t={t} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {loading && (
            <span className="inline-flex items-center gap-1.5">
              <FiClock aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
              {t(TEXT.loading)}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => loaders[activeTab]?.()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-50"
        >
          <FiRefreshCw aria-hidden="true" className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {t(TEXT.refreshTab)}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <div role="tabpanel" className="mt-5 grid gap-5">
        {activeTab === 'overview' && (
          <>
            <Panel title={t(TEXT.overview)} description={t(TEXT.overviewHelp)} badge={<FiBarChart2 aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={FiUsers} label={t(TEXT.totalUsers)} value={dashboard?.users} hint="30j" tone="sky" />
                <StatCard icon={FiZap} label={t(TEXT.totalRuns)} value={dashboard?.tool_runs_30d} hint="30j" tone="violet" />
                <StatCard icon={FiActivity} label={t(TEXT.totalEvents)} value={dashboard?.events_30d} hint="30j" tone="emerald" />
                <StatCard icon={FiLayers} label={t(TEXT.activeTools)} value={tools.length} hint="catalogue" tone="amber" />
              </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title={t(TEXT.activity)} description={t(TEXT.activityHelp)}>
                <BarChart items={tools} labelKey="tool" valueKey="successful_requests" empty={t(TEXT.noData)} labelFor={labelFor} />
              </Panel>
              <Panel title={t(TEXT.documents)} description={t(TEXT.documentsHelp)}>
                <ColumnChart items={tools} labelKey="tool" valueKey="documents_processed" empty={t(TEXT.noData)} labelFor={labelFor} />
              </Panel>
            </div>

            <Panel title={t(TEXT.ranking)} description={t(TEXT.rankingHelp)}>
              <ToolRanking value={tools} empty={t(TEXT.noData)} labelFor={labelFor} t={t} />
            </Panel>

            <Panel title={t(TEXT.announcement)} description={t(TEXT.announcementHelp)}>
              <form onSubmit={handleAnnouncement} className="mt-5 grid gap-3">
                <Field label={t(TEXT.titleField)}>
                  <input required maxLength={160} value={announcement.title} onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })} className={inputClass} />
                </Field>
                <Field label={t(TEXT.bodyField)}>
                  <textarea required rows={4} maxLength={10000} value={announcement.body} onChange={(event) => setAnnouncement({ ...announcement, body: event.target.value })} className={inputClass} />
                </Field>
                <button type="submit" disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50">
                  <FiSend aria-hidden="true" className="h-4 w-4" />
                  {t(TEXT.send)}
                </button>
              </form>
              {settingSuccess && (
                <p role="status" className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-700">
                  <FiCheckCircle aria-hidden="true" className="h-4 w-4" />
                  {settingSuccess}
                </p>
              )}
              {settingError && <p role="alert" className="mt-3 text-sm text-red-700">{settingError}</p>}
            </Panel>
          </>
        )}

        {activeTab === 'users' && (
          <Panel title={t(TEXT.users)} description={t(TEXT.usersHelp)} badge={<FiUsers aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <UserCards value={users} empty={t(TEXT.noUsers)} t={t} />
          </Panel>
        )}

        {activeTab === 'runs' && (
          <Panel title={t(TEXT.runs)} description={t(TEXT.runsHelp)} badge={<FiFileText aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <RunsView value={toolRuns} empty={t(TEXT.noData)} labelFor={labelFor} t={t} locale={locale} />
          </Panel>
        )}

        {activeTab === 'events' && (
          <Panel title={t(TEXT.events)} description={t(TEXT.eventsHelp)} badge={<FiActivity aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <EventsView value={events} empty={t(TEXT.noData)} labelFor={labelFor} t={t} locale={locale} />
          </Panel>
        )}

        {activeTab === 'errors' && (
          <Panel title={t(TEXT.eventErrors)} description={t(TEXT.eventErrorsHelp)} badge={<FiAlertCircle aria-hidden="true" className="h-5 w-5 text-red-500" />}>
            <ErrorsView value={eventErrors} empty={t(TEXT.noData)} labelFor={labelFor} t={t} />
          </Panel>
        )}

        {activeTab === 'anonymous' && (
          <Panel title={t(TEXT.anonymous)} description={t(TEXT.anonymousHelp)} badge={<FiGlobe aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <AnonymousView value={anonymousUsage} empty={t(TEXT.noData)} labelFor={labelFor} t={t} locale={locale} />
          </Panel>
        )}

        {activeTab === 'photo' && (
          <Panel
            title={t(TEXT.photoSpecs)}
            description={t(TEXT.photoSpecsHelp)}
            badge={<FiCamera aria-hidden="true" className="h-5 w-5 text-sky-500" />}
          >
            <PhotoView value={photoSpecs} empty={t(TEXT.noPhotoSpecs)} t={t} />
          </Panel>
        )}

        {activeTab === 'settings' && (
          <Panel title={t(TEXT.settings)} description={t(TEXT.settingsHelp)} badge={<FiSettings aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <SettingsView
              value={settings}
              empty={t(TEXT.noData)}
              t={t}
              locale={locale}
              onSave={saveSetting}
              disabled={loading}
              formError={settingError}
              formSuccess={settingSuccess}
            />
          </Panel>
        )}
      </div>
        </div>
    </section>
  )
}
