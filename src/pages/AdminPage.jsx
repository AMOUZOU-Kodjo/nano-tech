import { useEffect, useState } from 'react'
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDollarSign,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiRefreshCw,
  FiSend,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { useLocale } from '@/hooks/useLocale.js'
import { useAdmin } from '@/hooks/useAdmin.js'

const TEXT = {
  controlRoom: { fr: 'Control-room', en: 'Control room' },
  title: { fr: 'Administration NanoFile', en: 'NanoFile administration' },
  intro: {
    fr: 'Pilotage complet de la plateforme. Données et actions réservées aux sessions autorisées.',
    en: 'Full platform control. Data and actions restricted to authorized sessions.',
  },
  refresh: { fr: 'Actualiser tout', en: 'Refresh all' },
  loading: { fr: 'Chargement des données administratives…', en: 'Loading administrative data…' },
  overview: { fr: 'Vue d’ensemble', en: 'Overview' },
  overviewHelp: { fr: 'Indicateurs généraux des 30 derniers jours.', en: 'Key metrics for the last 30 days.' },
  users: { fr: 'Utilisateurs', en: 'Users' },
  usersHelp: { fr: 'Comptes exposés par l’API administrative.', en: 'Accounts exposed by the admin API.' },
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
  adminStatus: { fr: 'Statut administrateur', en: 'Administrator status' },
  adminStatusHelp: { fr: 'Le paramètre enabled est envoyé en query comme l’exige l’OpenAPI.', en: 'The enabled parameter is sent as a query param as required by OpenAPI.' },
  userId: { fr: 'Identifiant utilisateur', en: 'User ID' },
  administrator: { fr: 'Administrateur', en: 'Administrator' },
  update: { fr: 'Mettre à jour', en: 'Update' },
  credits: { fr: 'Crédits utilisateur', en: 'User credits' },
  creditsHelp: { fr: 'Ajuste le solde avec delta et reason.', en: 'Adjusts the balance with delta and reason.' },
  delta: { fr: 'Delta', en: 'Delta' },
  reason: { fr: 'Motif', en: 'Reason' },
  adjust: { fr: 'Ajuster', en: 'Adjust' },
  plan: { fr: 'Plan utilisateur', en: 'User plan' },
  planHelp: { fr: 'Applique un plan free ou pro avec une durée optionnelle.', en: 'Applies a free or pro plan with an optional duration.' },
  duration: { fr: 'Durée en jours', en: 'Duration in days' },
  apply: { fr: 'Appliquer', en: 'Apply' },
  runs: { fr: 'Exécutions d’outils', en: 'Tool runs' },
  runsHelp: { fr: 'Historique administratif des traitements.', en: 'Administrative history of processing jobs.' },
  events: { fr: 'Événements', en: 'Events' },
  eventsHelp: { fr: 'Événements reçus par l’API.', en: 'Events received by the API.' },
  eventErrors: { fr: 'Erreurs d’événements', en: 'Event errors' },
  eventErrorsHelp: { fr: 'Événements rejetés ou en erreur.', en: 'Rejected or failed events.' },
  anonymous: { fr: 'Utilisation anonyme', en: 'Anonymous usage' },
  anonymousHelp: { fr: 'Statistiques agrégées des visiteurs.', en: 'Aggregated visitor statistics.' },
  settings: { fr: 'Paramètres', en: 'Settings' },
  settingsHelp: { fr: 'Clés documentées : tools_enabled, limits, compression.', en: 'Documented keys: tools_enabled, limits, compression.' },
  settingKey: { fr: 'Clé', en: 'Key' },
  jsonValue: { fr: 'Valeur JSON', en: 'JSON value' },
  save: { fr: 'Enregistrer', en: 'Save' },
  noData: { fr: 'Aucune donnée disponible.', en: 'No data available.' },
  moreRows: { fr: 'lignes supplémentaires', en: 'additional rows' },
  denied: { fr: 'Accès refusé', en: 'Access denied' },
  deniedTitle: { fr: 'Espace réservé aux administrateurs', en: 'Administrators only' },
  deniedFallback: { fr: 'Votre session ne permet pas d’accéder au control-room.', en: 'Your session cannot access the control room.' },
  actionDenied: { fr: 'L’action administrative a été refusée.', en: 'The administrative action was denied.' },
  announcementDone: { fr: 'Annonce créée.', en: 'Announcement created.' },
  adminDone: { fr: 'Statut administrateur mis à jour.', en: 'Administrator status updated.' },
  creditsDone: { fr: 'Crédits mis à jour.', en: 'Credits updated.' },
  planDone: { fr: 'Plan mis à jour.', en: 'Plan updated.' },
  settingDone: { fr: 'Paramètre mis à jour.', en: 'Setting updated.' },
  badJson: { fr: 'La valeur du paramètre doit être un JSON valide.', en: 'The setting value must be valid JSON.' },
  badObject: { fr: 'La valeur du paramètre doit être un objet JSON.', en: 'The setting value must be a JSON object.' },
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

function formatCell(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function normalizeRows(value) {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []

  for (const key of ['users', 'items', 'data', 'results', 'events', 'runs', 'tools']) {
    if (Array.isArray(value[key])) return value[key]
  }

  return Object.entries(value).map(([key, item]) => ({ key, value: item }))
}

function StatCard({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    sky: 'from-sky-500 to-cyan-500 shadow-sky-200',
    violet: 'from-violet-500 to-fuchsia-500 shadow-violet-200',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-200',
    amber: 'from-amber-500 to-orange-500 shadow-amber-200',
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

function BarChart({ items, labelKey, valueKey, empty }) {
  const rows = [...items]
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
    .slice(0, 8)
  const max = Math.max(1, ...rows.map((row) => row[valueKey] ?? 0))

  if (rows.length === 0) return <p className="mt-5 text-sm text-slate-500">{empty}</p>

  return (
    <div className="mt-5 space-y-3">
      {rows.map((row) => (
        <div key={String(row[labelKey])} className="grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3 sm:grid-cols-[minmax(0,12rem)_1fr_3rem]">
          <span className="truncate text-xs font-medium text-slate-600" title={String(row[labelKey])}>
            {String(row[labelKey])}
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

function ColumnChart({ items, labelKey, valueKey, empty }) {
  const rows = [...items]
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
    .slice(0, 6)
  const max = Math.max(1, ...rows.map((row) => row[valueKey] ?? 0))

  if (rows.length === 0) return <p className="mt-5 text-sm text-slate-500">{empty}</p>

  return (
    <div className="mt-6 flex h-40 items-end gap-2 sm:gap-4">
      {rows.map((row) => (
        <div key={String(row[labelKey])} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
          <span className="text-center text-[10px] font-bold tabular-nums text-slate-600">{row[valueKey] ?? 0}</span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all duration-500 group-hover:from-violet-500 group-hover:to-fuchsia-300"
            style={{ height: `${Math.max(6, Math.round(((row[valueKey] ?? 0) / max) * 100))}%` }}
            title={String(row[labelKey])}
          />
          <span className="truncate text-center text-[10px] text-slate-500" title={String(row[labelKey])}>
            {String(row[labelKey])}
          </span>
        </div>
      ))}
    </div>
  )
}

function DataTable({ value, empty }) {
  const { t } = useLocale()
  const rows = normalizeRows(value)

  if (rows.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        {empty}
      </div>
    )
  }

  const columns = Object.keys(rows[0]).slice(0, 8)
  const visibleRows = rows.slice(0, 20)

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-2.5">
                  {column.replaceAll('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.map((row, index) => (
              <tr key={index} className="transition hover:bg-sky-50/60">
                {columns.map((column) => (
                  <td key={column} className="max-w-[18rem] truncate px-3 py-2.5 text-slate-700" title={formatCell(row[column])}>
                    {formatCell(row[column])}
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

export default function AdminPage() {
  const { t } = useLocale()
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
    updateUserAdmin,
    updateUserCredits,
    updateUserPlan,
    listToolRuns,
    listAdminEvents,
    listEventErrors,
    listAnonymousUsage,
    getAdminSettings,
    updateAdminSetting,
  } = useAdmin()

  const [announcement, setAnnouncement] = useState({ title: '', body: '' })
  const [adminChange, setAdminChange] = useState({ userId: '', enabled: true })
  const [credits, setCredits] = useState({ userId: '', delta: '', reason: 'admin_adjustment' })
  const [plan, setPlan] = useState({ userId: '', plan: 'free', days: '' })
  const [setting, setSetting] = useState({ key: '', value: '{}' })
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  useEffect(() => {
    getAdminDashboard()
    listAdminUsers()
    listToolRuns()
    listAdminEvents()
    listEventErrors()
    listAnonymousUsage()
    getAdminSettings()
  }, [
    getAdminDashboard,
    listAdminUsers,
    listToolRuns,
    listAdminEvents,
    listEventErrors,
    listAnonymousUsage,
    getAdminSettings,
  ])

  async function runAction(action, successMessage, afterSuccess) {
    setFormError(null)
    setFormSuccess(null)

    const payload = await action()
    if (!payload) {
      setFormError(t(TEXT.actionDenied))
      return
    }

    setFormSuccess(successMessage)
    await afterSuccess?.()
  }

  async function handleAnnouncement(event) {
    event.preventDefault()
    await runAction(
      () => createAnnouncement({ title: announcement.title.trim(), body: announcement.body.trim() }),
      t(TEXT.announcementDone),
    )
  }

  async function handleAdminChange(event) {
    event.preventDefault()
    await runAction(
      () => updateUserAdmin(Number(adminChange.userId), adminChange.enabled),
      t(TEXT.adminDone),
      listAdminUsers,
    )
  }

  async function handleCredits(event) {
    event.preventDefault()
    await runAction(
      () => updateUserCredits(Number(credits.userId), {
        delta: Number(credits.delta),
        reason: credits.reason.trim(),
      }),
      t(TEXT.creditsDone),
      listAdminUsers,
    )
  }

  async function handlePlan(event) {
    event.preventDefault()
    await runAction(
      () => updateUserPlan(Number(plan.userId), {
        plan: plan.plan,
        days: plan.days ? Number(plan.days) : null,
      }),
      t(TEXT.planDone),
      listAdminUsers,
    )
  }

  async function handleSetting(event) {
    event.preventDefault()
    let value

    try {
      value = JSON.parse(setting.value)
    } catch {
      setFormError(t(TEXT.badJson))
      setFormSuccess(null)
      return
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      setFormError(t(TEXT.badObject))
      setFormSuccess(null)
      return
    }

    await runAction(
      () => updateAdminSetting(setting.key.trim(), value),
      t(TEXT.settingDone),
      getAdminSettings,
    )
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

  const tools = Array.isArray(dashboard?.tools) ? dashboard.tools : []
  const refreshActions = [
    [t(TEXT.refresh), getAdminDashboard, FiRefreshCw],
    [t(TEXT.users), listAdminUsers, FiUsers],
    [t(TEXT.runs), listToolRuns, FiZap],
    [t(TEXT.events), listAdminEvents, FiActivity],
    [t(TEXT.eventErrors), listEventErrors, FiAlertCircle],
    [t(TEXT.anonymous), listAnonymousUsage, FiGlobe],
    [t(TEXT.settings), getAdminSettings, FiSettings],
  ]
  const refreshAll = () => refreshActions.forEach(([, action]) => action())

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
          <button
            type="button"
            onClick={refreshAll}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-50"
          >
            <FiRefreshCw aria-hidden="true" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t(TEXT.refresh)}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {refreshActions.map(([label, action, Icon]) => (
          <button
            key={label}
            type="button"
            onClick={action}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-50"
          >
            <Icon aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">
          <FiClock aria-hidden="true" className="h-4 w-4" />
          {t(TEXT.loading)}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}
      {formError && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}
      {formSuccess && (
        <p role="status" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <FiCheckCircle aria-hidden="true" className="h-4 w-4" />
          {formSuccess}
        </p>
      )}

      <div className="mt-6 grid gap-5">
        <Panel
          title={t(TEXT.overview)}
          description={t(TEXT.overviewHelp)}
          badge={<FiBarChart2 aria-hidden="true" className="h-5 w-5 text-sky-500" />}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FiUsers} label={t(TEXT.totalUsers)} value={dashboard?.users} hint="30j" tone="sky" />
            <StatCard icon={FiZap} label={t(TEXT.totalRuns)} value={dashboard?.tool_runs_30d} hint="30j" tone="violet" />
            <StatCard icon={FiActivity} label={t(TEXT.totalEvents)} value={dashboard?.events_30d} hint="30j" tone="emerald" />
            <StatCard icon={FiLayers} label={t(TEXT.activeTools)} value={tools.length} hint="catalogue" tone="amber" />
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title={t(TEXT.activity)} description={t(TEXT.activityHelp)}>
            <BarChart items={tools} labelKey="tool" valueKey="successful_requests" empty={t(TEXT.noData)} />
          </Panel>
          <Panel title={t(TEXT.documents)} description={t(TEXT.documentsHelp)}>
            <ColumnChart items={tools} labelKey="tool" valueKey="documents_processed" empty={t(TEXT.noData)} />
          </Panel>
        </div>

        <Panel title={t(TEXT.ranking)} description={t(TEXT.rankingHelp)}>
          <DataTable value={tools} empty={t(TEXT.noData)} />
        </Panel>

        <Panel title={t(TEXT.users)} description={t(TEXT.usersHelp)} badge={<FiUsers aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
          <DataTable value={users} empty={t(TEXT.noData)} />
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
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
          </Panel>

          <Panel title={t(TEXT.adminStatus)} description={t(TEXT.adminStatusHelp)}>
            <form onSubmit={handleAdminChange} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <Field label={t(TEXT.userId)}>
                <input required type="number" min="1" value={adminChange.userId} onChange={(event) => setAdminChange({ ...adminChange, userId: event.target.value })} className={inputClass} />
              </Field>
              <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-700">
                <input type="checkbox" checked={adminChange.enabled} onChange={(event) => setAdminChange({ ...adminChange, enabled: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
                {t(TEXT.administrator)}
              </label>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50">
                <FiUserCheck aria-hidden="true" className="h-4 w-4" />
                {t(TEXT.update)}
              </button>
            </form>
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title={t(TEXT.credits)} description={t(TEXT.creditsHelp)}>
            <form onSubmit={handleCredits} className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label={t(TEXT.userId)}>
                <input required type="number" min="1" value={credits.userId} onChange={(event) => setCredits({ ...credits, userId: event.target.value })} className={inputClass} />
              </Field>
              <Field label={t(TEXT.delta)}>
                <input required type="number" value={credits.delta} onChange={(event) => setCredits({ ...credits, delta: event.target.value })} className={inputClass} />
              </Field>
              <Field label={t(TEXT.reason)}>
                <input required maxLength={80} value={credits.reason} onChange={(event) => setCredits({ ...credits, reason: event.target.value })} className={inputClass} />
              </Field>
              <button type="submit" disabled={loading} className="inline-flex w-fit items-end gap-2 self-end rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50 sm:mb-0">
                <FiDollarSign aria-hidden="true" className="h-4 w-4" />
                {t(TEXT.adjust)}
              </button>
            </form>
          </Panel>

          <Panel title={t(TEXT.plan)} description={t(TEXT.planHelp)}>
            <form onSubmit={handlePlan} className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label={t(TEXT.userId)}>
                <input required type="number" min="1" value={plan.userId} onChange={(event) => setPlan({ ...plan, userId: event.target.value })} className={inputClass} />
              </Field>
              <Field label={t(TEXT.plan)}>
                <select value={plan.plan} onChange={(event) => setPlan({ ...plan, plan: event.target.value })} className={inputClass}>
                  <option value="free">free</option>
                  <option value="pro">pro</option>
                </select>
              </Field>
              <Field label={t(TEXT.duration)}>
                <input type="number" min="1" max="3660" value={plan.days} onChange={(event) => setPlan({ ...plan, days: event.target.value })} className={inputClass} />
              </Field>
              <button type="submit" disabled={loading} className="inline-flex w-fit items-end gap-2 self-end rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50">
                <FiTrendingUp aria-hidden="true" className="h-4 w-4" />
                {t(TEXT.apply)}
              </button>
            </form>
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title={t(TEXT.runs)} description={t(TEXT.runsHelp)} badge={<FiFileText aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <DataTable value={toolRuns} empty={t(TEXT.noData)} />
          </Panel>
          <Panel title={t(TEXT.events)} description={t(TEXT.eventsHelp)} badge={<FiActivity aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <DataTable value={events} empty={t(TEXT.noData)} />
          </Panel>
          <Panel title={t(TEXT.eventErrors)} description={t(TEXT.eventErrorsHelp)} badge={<FiAlertCircle aria-hidden="true" className="h-5 w-5 text-red-500" />}>
            <DataTable value={eventErrors} empty={t(TEXT.noData)} />
          </Panel>
          <Panel title={t(TEXT.anonymous)} description={t(TEXT.anonymousHelp)} badge={<FiGlobe aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
            <DataTable value={anonymousUsage} empty={t(TEXT.noData)} />
          </Panel>
        </div>

        <Panel title={t(TEXT.settings)} description={t(TEXT.settingsHelp)} badge={<FiSettings aria-hidden="true" className="h-5 w-5 text-sky-500" />}>
          <DataTable value={settings} empty={t(TEXT.noData)} />
          <form onSubmit={handleSetting} className="mt-5 grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
            <Field label={t(TEXT.settingKey)}>
              <input required list="admin-setting-keys" value={setting.key} onChange={(event) => setSetting({ ...setting, key: event.target.value })} className={inputClass} />
            </Field>
            <Field label={t(TEXT.jsonValue)}>
              <textarea required rows={3} value={setting.value} onChange={(event) => setSetting({ ...setting, value: event.target.value })} className={inputClass} />
            </Field>
            <datalist id="admin-setting-keys">
              <option value="tools_enabled" />
              <option value="limits" />
              <option value="compression" />
            </datalist>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50">
              <FiSettings aria-hidden="true" className="h-4 w-4" />
              {t(TEXT.save)}
            </button>
          </form>
        </Panel>
      </div>
    </section>
  )
}
