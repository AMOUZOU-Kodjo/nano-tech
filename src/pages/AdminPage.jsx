import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
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
import { TOOLS } from '@/config/tools.js'

const TEXT = {
  controlRoom: { fr: 'Control-room', en: 'Control room' },
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
  runsHelp: { fr: 'Historique administratif des traitements.', en: 'Administrative history of processing jobs.' },
  events: { fr: 'Événements', en: 'Events' },
  eventsHelp: { fr: 'Événements reçus par l’API.', en: 'Events received by the API.' },
  eventErrors: { fr: 'Erreurs d’événements', en: 'Event errors' },
  eventErrorsHelp: { fr: 'Événements rejetés ou en erreur, regroupés par outil et code.', en: 'Rejected or failed events, grouped by tool and code.' },
  anonymous: { fr: 'Utilisation anonyme', en: 'Anonymous usage' },
  anonymousHelp: { fr: 'Statistiques agrégées des visiteurs.', en: 'Aggregated visitor statistics.' },
  settings: { fr: 'Paramètres', en: 'Settings' },
  settingsHelp: { fr: 'Clés documentées : tools_enabled, limits, compression.', en: 'Documented keys: tools_enabled, limits, compression.' },
  settingKey: { fr: 'Clé', en: 'Key' },
  jsonValue: { fr: 'Valeur JSON', en: 'JSON value' },
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
  denied: { fr: 'Accès refusé', en: 'Access denied' },
  deniedTitle: { fr: 'Espace réservé aux administrateurs', en: 'Administrators only' },
  deniedFallback: { fr: 'Votre session ne permet pas d’accéder au control-room.', en: 'Your session cannot access the control room.' },
  actionDenied: { fr: 'L’action administrative a été refusée.', en: 'The administrative action was denied.' },
  announcementDone: { fr: 'Annonce créée.', en: 'Announcement created.' },
  settingDone: { fr: 'Paramètre mis à jour.', en: 'Setting updated.' },
  badJson: { fr: 'La valeur du paramètre doit être un JSON valide.', en: 'The setting value must be valid JSON.' },
  badObject: { fr: 'La valeur du paramètre doit être un objet JSON.', en: 'The setting value must be a JSON object.' },
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

const SETTING_KEYS = ['tools_enabled', 'limits', 'compression']

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

function DataTable({ value, empty, labelFor, columns }) {
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
                  {column.replaceAll('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.map((row, index) => (
              <tr key={index} className="transition hover:bg-sky-50/60">
                {keys.map((column) => (
                  <td key={column} className="max-w-[18rem] truncate px-3 py-2.5 text-slate-700" title={formatCell(row[column])}>
                    {column === 'tool' && labelFor ? labelFor(row[column]) : formatCell(row[column])}
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
    <div className="mt-5 grid gap-3 lg:grid-cols-2">
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
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">admin</span>
                )}
                {user.plan && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 ring-1 ring-sky-100">{String(user.plan)}</span>
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

function EventsView({ value, empty, labelFor, t }) {
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
        labelFor={labelFor}
        columns={['id', 'name', 'tool', 'code', 'files', 'input_bytes']}
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

function AnonymousView({ value, empty, labelFor, t }) {
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
              {t(TEXT.lastUse)} : {formatCell(row.last_used_at)}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

function SettingValue({ name, value, t }) {
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
              {toolLabel(key, 'fr')}
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
            <dt className="truncate font-mono text-[11px] text-slate-500">{key.replaceAll('_', ' ')}</dt>
            <dd className="shrink-0 text-sm font-bold tabular-nums text-slate-800">{formatCell(item)}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return <p className="mt-4 font-mono text-sm text-slate-700">{formatCell(value)}</p>
}

function SettingsView({ value, empty, t, onSave, disabled, formError, formSuccess }) {
  const values = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const [drafts, setDrafts] = useState({})

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
            <SettingValue name={key} value={values[key]} t={t} />
            <details className="mt-4 group">
              <summary className="cursor-pointer list-none text-xs font-bold text-sky-700 transition group-open:text-sky-900">
                {t(TEXT.editValue)}
              </summary>
              <form
                className="mt-3 grid gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  onSave(key, drafts[key] ?? JSON.stringify(values[key], null, 2))
                }}
              >
                <textarea
                  rows={5}
                  value={drafts[key] ?? JSON.stringify(values[key], null, 2)}
                  onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
                  className={`${inputClass} font-mono text-xs`}
                  aria-label={`${t(TEXT.jsonValue)} ${key}`}
                />
                <button type="submit" disabled={disabled} className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
                  <FiSettings aria-hidden="true" className="h-3.5 w-3.5" />
                  {t(TEXT.save)}
                </button>
              </form>
            </details>
          </section>
        ))}
      </div>
    </>
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

  const [activeTab, setActiveTab] = useState('overview')
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
      settings: getAdminSettings,
    }),
    [
      getAdminDashboard,
      listAdminUsers,
      listToolRuns,
      listAdminEvents,
      listEventErrors,
      listAnonymousUsage,
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

  async function handleSetting(key, rawValue) {
    let value
    try {
      value = JSON.parse(rawValue)
    } catch {
      setSettingError(t(TEXT.badJson))
      setSettingSuccess(null)
      return
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      setSettingError(t(TEXT.badObject))
      setSettingSuccess(null)
      return
    }

    await runAction(() => updateAdminSetting(key, value), t(TEXT.settingDone))
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
    ['settings', TEXT.settings, FiSettings],
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
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

      <div role="tablist" aria-label={t(TEXT.title)} className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              activeTab === id
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {t(label)}
          </button>
        ))}
      </div>

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
              <DataTable value={tools} empty={t(TEXT.noData)} labelFor={labelFor} />
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
            <DataTable value={toolRuns} empty={t(TEXT.noData)} labelFor={labelFor} />
          </Panel>
        )}

        {activeTab === 'events' && (
          <Panel title={t(TEXT.events)} description={t(TEXT.eventsHelp)} badge={<FiActivity aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <EventsView value={events} empty={t(TEXT.noData)} labelFor={labelFor} t={t} />
          </Panel>
        )}

        {activeTab === 'errors' && (
          <Panel title={t(TEXT.eventErrors)} description={t(TEXT.eventErrorsHelp)} badge={<FiAlertCircle aria-hidden="true" className="h-5 w-5 text-red-500" />}>
            <ErrorsView value={eventErrors} empty={t(TEXT.noData)} labelFor={labelFor} t={t} />
          </Panel>
        )}

        {activeTab === 'anonymous' && (
          <Panel title={t(TEXT.anonymous)} description={t(TEXT.anonymousHelp)} badge={<FiGlobe aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <AnonymousView value={anonymousUsage} empty={t(TEXT.noData)} labelFor={labelFor} t={t} />
          </Panel>
        )}

        {activeTab === 'settings' && (
          <Panel title={t(TEXT.settings)} description={t(TEXT.settingsHelp)} badge={<FiSettings aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <SettingsView
              value={settings}
              empty={t(TEXT.noData)}
              t={t}
              onSave={handleSetting}
              disabled={loading}
              formError={settingError}
              formSuccess={settingSuccess}
            />
          </Panel>
        )}
      </div>
    </section>
  )
}
