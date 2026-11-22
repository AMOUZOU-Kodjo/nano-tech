import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMeActions } from '@/hooks/useMeActions.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { useUsage } from '@/hooks/useUsage.js'
import { useLocale } from '@/hooks/useLocale.js'

// Libellés des compteurs documentés, affichés seulement quand la réponse les contient.
const QUOTA_LABELS = {
  plan: { fr: 'Formule', en: 'Plan' },
  credits: { fr: 'Crédits', en: 'Credits' },
  paywall_enabled: { fr: 'Paywall actif', en: 'Paywall enabled' },
  free_uses_left: { fr: 'Essais gratuits restants', en: 'Free trials remaining' },
  ai_uses_left_today: { fr: 'Rendus IA restants aujourd’hui', en: 'AI renders remaining today' },
  daily_jobs_left: { fr: 'Jobs restants aujourd’hui', en: 'Jobs remaining today' },
  daily_renders_left: { fr: 'Rendus restants aujourd’hui', en: 'Renders remaining today' },
  limit: { fr: 'Limite', en: 'Limit' },
  used: { fr: 'Utilisé', en: 'Used' },
  remaining: { fr: 'Restant', en: 'Remaining' },
}

const USAGE_LABELS = {
  authenticated: { fr: 'Compte authentifié', en: 'Authenticated account' },
  plan: { fr: 'Formule', en: 'Plan' },
  credits: { fr: 'Crédits', en: 'Credits' },
  paywall_enabled: { fr: 'Paywall actif', en: 'Paywall enabled' },
  free_uses_left: { fr: 'Essais gratuits restants', en: 'Free trials remaining' },
  ai_uses_left_today: { fr: 'Rendus IA restants aujourd’hui', en: 'AI renders remaining today' },
  daily_jobs_left: { fr: 'Jobs restants aujourd’hui', en: 'Jobs remaining today' },
  daily_renders_left: { fr: 'Rendus restants aujourd’hui', en: 'Renders remaining today' },
}

const LIMIT_LABELS = {
  tier: { fr: 'Niveau', en: 'Tier' },
  max_file_mb: { fr: 'Taille max. par fichier', en: 'Max. size per file' },
  max_total_mb: { fr: 'Total max. par lot', en: 'Max. total per batch' },
  max_files: { fr: 'Nombre max. de fichiers', en: 'Max. number of files' },
  max_pdf_pages: { fr: 'Pages PDF max.', en: 'Max. PDF pages' },
  max_video_minutes: { fr: 'Durée vidéo max.', en: 'Max. video duration' },
  max_documents: { fr: 'Documents max.', en: 'Max. documents' },
  max_document_storage_mb: { fr: 'Stockage documents max.', en: 'Max. document storage' },
}

const AI_LABELS = {
  limit: { fr: 'Limite quotidienne', en: 'Daily limit' },
  used: { fr: 'Utilisé', en: 'Used' },
  remaining: { fr: 'Restant', en: 'Remaining' },
  resets_at: { fr: 'Réinitialisation', en: 'Resets at' },
}

const TABS = [
  { id: 'overview', label: { fr: 'Vue d’ensemble', en: 'Overview' }, description: { fr: 'Quota et consommation', en: 'Quota and usage' } },
  { id: 'data', label: { fr: 'Données personnelles', en: 'Personal data' }, description: { fr: 'Export et suppression', en: 'Export and deletion' } },
  { id: 'communication', label: { fr: 'Communication', en: 'Communication' }, description: { fr: 'Préférences email', en: 'Email preferences' } },
]

const OVERVIEW_TABS = [
  { id: 'quota', label: { fr: 'Quota courant', en: 'Current quota' } },
  { id: 'access', label: { fr: 'Accès et compteurs', en: 'Access and counters' } },
  { id: 'limits', label: { fr: 'Limites du compte', en: 'Account limits' } },
  { id: 'ai', label: { fr: 'Rendus IA', en: 'AI renders' } },
  { id: 'tools', label: { fr: 'Outils activés', en: 'Enabled tools' } },
]

const TEXT = {
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
  guest: { fr: 'Invité', en: 'Guest' },
  signedInAccount: { fr: 'Compte connecté', en: 'Signed-in account' },
  noData: { fr: 'Aucune donnée disponible.', en: 'No data available.' },
  accountSections: { fr: 'Sections du compte', en: 'Account sections' },
  overviewDetails: { fr: 'Détails de la vue d’ensemble', en: 'Overview details' },
  rawResponse: { fr: 'Réponse brute', en: 'Raw response' },
  deleteConfirmationRequired: { fr: 'Saisissez SUPPRIMER pour confirmer.', en: 'Type DELETE to confirm.' },
  unsubscribeTokenRequired: {
    fr: 'Saisissez le jeton de désinscription.',
    en: 'Enter the unsubscribe token.',
  },
  userSpace: { fr: 'Espace utilisateur', en: 'User space' },
  myAccount: { fr: 'Mon compte', en: 'My account' },
  accountIntro: {
    fr: 'Suivez votre quota, consultez votre consommation et gérez vos données personnelles.',
    en: 'Track your quota, review your usage and manage your personal data.',
  },
  currentAccount: { fr: 'Compte courant', en: 'Current account' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  signedIn: { fr: 'Connecté', en: 'Signed in' },
  editProfile: { fr: 'Modifier mon profil', en: 'Edit my profile' },
  signIn: { fr: 'Se connecter', en: 'Sign in' },
  navigation: { fr: 'Navigation', en: 'Navigation' },
  detailsTitle: { fr: 'Détails du compte', en: 'Account details' },
  detailsDescription: {
    fr: 'Choisissez une section pour afficher les données correspondantes.',
    en: 'Choose a section to display the corresponding data.',
  },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  identity: { fr: 'Identité', en: 'Identity' },
  availableTools: { fr: 'Outils disponibles', en: 'Available tools' },
  exportTitle: { fr: 'Exporter mes données', en: 'Export my data' },
  exportDescription: { fr: 'Récupère l’export RGPD prévu par l’API.', en: 'Retrieves the GDPR export provided by the API.' },
  requestExport: { fr: 'Demander l’export', en: 'Request export' },
  deleteTitle: { fr: 'Supprimer mes données', en: 'Delete my data' },
  deleteDescription: {
    fr: 'Action irréversible. La suppression du compte est optionnelle.',
    en: 'Irreversible action. Deleting the account is optional.',
  },
  deleteAccountToo: { fr: 'Supprimer également le compte.', en: 'Delete the account as well.' },
  confirmDelete: { fr: 'Confirmer la suppression', en: 'Confirm deletion' },
  dataDeleted: { fr: 'Données supprimées.', en: 'Data deleted.' },
  unsubscribeTitle: { fr: 'Désinscription marketing', en: 'Marketing unsubscribe' },
  unsubscribeDescription: {
    fr: 'Utilisez le jeton reçu dans l’email de communication.',
    en: 'Use the token received in the marketing email.',
  },
  unsubscribeToken: { fr: 'Jeton de désinscription', en: 'Unsubscribe token' },
  pasteToken: { fr: 'Collez votre jeton', en: 'Paste your token' },
  unsubscribe: { fr: 'Se désinscrire', en: 'Unsubscribe' },
  unsubscribed: { fr: 'Désinscription effectuée.', en: 'Unsubscribed successfully.' },
  planStat: { fr: 'Formule', en: 'Plan' },
  creditsStat: { fr: 'Crédits', en: 'Credits' },
  trialsStat: { fr: 'Essais restants', en: 'Trials remaining' },
  toolsStat: { fr: 'Outils activés', en: 'Enabled tools' },
  currentOffer: { fr: 'Offre actuelle', en: 'Current offer' },
  availableBalance: { fr: 'Solde disponible', en: 'Available balance' },
  freeQuota: { fr: 'Quota gratuit', en: 'Free quota' },
  catalogueAccess: { fr: 'Accès catalogue', en: 'Catalogue access' },
}

function formatValue(key, value, locale, t) {
  if (typeof value === 'boolean') {
    return t(value ? TEXT.yes : TEXT.no)
  }
  if (key === 'resets_at' && typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
    return new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  }
  if (typeof value === 'number' && key.endsWith('_mb')) {
    return `${value} ${locale === 'fr' ? 'Mo' : 'MB'}`
  }
  if (typeof value === 'number' && key.endsWith('_minutes')) {
    return `${value} min`
  }
  return String(value)
}

function rowsFrom(values, labels, locale, t) {
  if (!values || typeof values !== 'object') {
    return []
  }

  return Object.entries(labels)
    .filter(([key]) => key in values && values[key] !== null && values[key] !== undefined)
    .map(([key, label]) => ({
      key,
      label: t(label),
      value: formatValue(key, values[key], locale, t),
    }))
}

function quotaRows(quota, locale, t) {
  return rowsFrom(quota, QUOTA_LABELS, locale, t)
}

function usageIdentity(data, t) {
  if (!data) {
    return null
  }
  if (!data.user) {
    return t(TEXT.guest)
  }
  return data.user.email ?? data.user.id ?? t(TEXT.signedInAccount)
}

function rowValue(rows, key) {
  return rows.find((row) => row.key === key)?.value ?? '—'
}

function initials(value) {
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'NF'
}

function ValueList({ rows }) {
  const { t } = useLocale()

  if (!rows.length) {
    return <p className="mt-5 text-sm text-slate-600">{t(TEXT.noData)}</p>
  }

  return (
    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.key} className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{row.label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-slate-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function SectionCard({ title, description, action, children, tone = 'default' }) {
  const danger = tone === 'danger'

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${danger ? 'border-red-200 bg-red-50/70' : 'border-slate-200 bg-white'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={`text-lg font-semibold tracking-tight ${danger ? 'text-red-900' : 'text-slate-950'}`}>{title}</h2>
          {description && <p className={`mt-1 text-sm ${danger ? 'text-red-700' : 'text-slate-600'}`}>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function AccountTabs({ active, onChange }) {
  const { t } = useLocale()

  return (
    <div
      role="tablist"
      aria-label={t(TEXT.accountSections)}
      aria-orientation="vertical"
      className="space-y-2 lg:sticky lg:top-24"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              isActive
                ? 'border-sky-200 bg-sky-50 shadow-sm'
                : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`block text-sm font-semibold ${isActive ? 'text-sky-800' : 'text-slate-800'}`}>
              {t(tab.label)}
            </span>
            <span className="mt-1 block text-xs text-slate-500">{t(tab.description)}</span>
          </button>
        )
      })}
    </div>
  )
}

function OverviewTabs({ active, onChange }) {
  const { t } = useLocale()

  return (
    <div
      role="tablist"
      aria-label={t(TEXT.overviewDetails)}
      className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3"
    >
      {OVERVIEW_TABS.map((tab) => {
        const isActive = tab.id === active

        return (
          <button
            key={tab.id}
            id={`overview-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`overview-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              isActive ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t(tab.label)}
          </button>
        )
      })}
    </div>
  )
}

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  const { t } = useLocale()

  return (
    <div className="mt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t(TEXT.rawResponse)}</p>
      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}

// Page compte : quota courant, consommation détaillée et actions RGPD documentées.
export default function AccountPage() {
  const { locale, t } = useLocale()
  const [searchParams] = useSearchParams()
  const { user, quota, reload, isGuest, loading: meLoading } = useMeContext()
  const usage = useUsage()
  const { getUsage } = usage
  const actions = useMeActions({ onSuccess: reload })
  const [activeTab, setActiveTab] = useState('overview')
  const [overviewTab, setOverviewTab] = useState('quota')
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [includeAccount, setIncludeAccount] = useState(false)
  const [localError, setLocalError] = useState(null)

  // Diffère le chargement pour éviter de modifier l'état pendant l'effet lui-même.
  useEffect(() => {
    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return getUsage()
      }
      return null
    })

    return () => {
      active = false
    }
  }, [getUsage])

  function handleExport() {
    setLocalError(null)
    actions.exportMe()
  }

  function handleDelete() {
    setLocalError(null)

    const confirmation = locale === 'fr' ? 'SUPPRIMER' : 'DELETE'
    if (deleteConfirmation !== confirmation) {
      setLocalError(t(TEXT.deleteConfirmationRequired))
      return
    }

    actions.deleteMyData(includeAccount)
  }

  function handleUnsubscribe() {
    setLocalError(null)

    if (!token.trim()) {
      setLocalError(t(TEXT.unsubscribeTokenRequired))
      return
    }

    actions.unsubscribe(token.trim())
  }

  const rows = quotaRows(quota, locale, t)
  const usageData = usage.data
  const usageRows = rowsFrom(usageData, USAGE_LABELS, locale, t)
  const limitRows = rowsFrom(usageData?.limits, LIMIT_LABELS, locale, t)
  const aiRows = rowsFrom(usageData?.ai, AI_LABELS, locale, t)
  const enabledTools = usageData?.tools_enabled && typeof usageData.tools_enabled === 'object'
    ? Object.values(usageData.tools_enabled).filter(Boolean).length
    : null
  const enabledToolsTotal = usageData?.tools_enabled && typeof usageData.tools_enabled === 'object'
    ? Object.keys(usageData.tools_enabled).length
    : null
  const identity = isGuest ? t(TEXT.guest) : user?.email ?? user?.name ?? t(TEXT.signedInAccount)
  const toolsLabel = enabledTools !== null ? `${enabledTools} / ${enabledToolsTotal}` : '—'

  const stats = [
    { key: 'plan', label: t(TEXT.planStat), value: rowValue(rows, 'plan'), hint: t(TEXT.currentOffer) },
    { key: 'credits', label: t(TEXT.creditsStat), value: rowValue(rows, 'credits'), hint: t(TEXT.availableBalance) },
    { key: 'trials', label: t(TEXT.trialsStat), value: rowValue(rows, 'free_uses_left'), hint: t(TEXT.freeQuota) },
    { key: 'tools', label: t(TEXT.toolsStat), value: toolsLabel, hint: t(TEXT.catalogueAccess) },
  ]

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{t(TEXT.userSpace)}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t(TEXT.myAccount)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            {t(TEXT.accountIntro)}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-400/20 text-sm font-semibold text-sky-200">
                {meLoading ? '…' : initials(identity)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{t(TEXT.currentAccount)}</p>
                <p className="mt-1 truncate text-base font-semibold">{meLoading ? t(TEXT.loading) : identity}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isGuest ? 'bg-amber-400/15 text-amber-200' : 'bg-emerald-400/15 text-emerald-200'
              }`}>
                {t(isGuest ? TEXT.guest : TEXT.signedIn)}
              </span>
              {!meLoading && !isGuest && (
                <Link
                  to="/profile"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t(TEXT.editProfile)}
                </Link>
              )}
              {!meLoading && isGuest && (
                <Link
                  to="/login"
                  className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  {t(TEXT.signIn)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside>
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t(TEXT.navigation)}</p>
          <AccountTabs active={activeTab} onChange={setActiveTab} />
        </aside>

        <div className="min-w-0">
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            hidden={activeTab !== 'overview'}
            className={activeTab === 'overview' ? 'space-y-6' : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => <StatCard key={stat.key} {...stat} />)}
            </div>

            <SectionCard
              title={t(TEXT.detailsTitle)}
              description={t(TEXT.detailsDescription)}
              action={(
                <button
                  type="button"
                  onClick={getUsage}
                  disabled={usage.loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {t(usage.loading ? TEXT.loading : TEXT.refresh)}
                </button>
              )}
            >
              {usage.error && (
                <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {usage.error.message}
                </p>
              )}

              <OverviewTabs active={overviewTab} onChange={setOverviewTab} />

              <div id="overview-panel-quota" role="tabpanel" aria-labelledby="overview-tab-quota" hidden={overviewTab !== 'quota'}>
                <ValueList rows={rows} />
              </div>

              <div id="overview-panel-access" role="tabpanel" aria-labelledby="overview-tab-access" hidden={overviewTab !== 'access'}>
                <ValueList rows={usageData ? [{ key: 'identity', label: t(TEXT.identity), value: usageIdentity(usageData, t) }, ...usageRows] : []} />
              </div>

              <div id="overview-panel-limits" role="tabpanel" aria-labelledby="overview-tab-limits" hidden={overviewTab !== 'limits'}>
                <ValueList rows={limitRows} />
              </div>

              <div id="overview-panel-ai" role="tabpanel" aria-labelledby="overview-tab-ai" hidden={overviewTab !== 'ai'}>
                <ValueList rows={aiRows} />
              </div>

              <div id="overview-panel-tools" role="tabpanel" aria-labelledby="overview-tab-tools" hidden={overviewTab !== 'tools'}>
                <ValueList rows={enabledTools !== null ? [{ key: 'enabled', label: t(TEXT.availableTools), value: toolsLabel }] : []} />
              </div>
            </SectionCard>
          </div>

          <div
            id="panel-data"
            role="tabpanel"
            aria-labelledby="tab-data"
            hidden={activeTab !== 'data'}
            className={activeTab === 'data' ? 'space-y-6' : undefined}
          >
            <SectionCard
              title={t(TEXT.exportTitle)}
              description={t(TEXT.exportDescription)}
              action={(
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={actions.loading}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                >
                  {t(TEXT.requestExport)}
                </button>
              )}
            >
              {actions.exportedData && <JsonBlock value={actions.exportedData} />}
              {actions.data && !actions.exportedData && <JsonBlock value={actions.data} />}
            </SectionCard>

            <SectionCard
              title={t(TEXT.deleteTitle)}
              description={t(TEXT.deleteDescription)}
              tone="danger"
            >
              <div className="mt-5 space-y-4">
                <label className="flex items-start gap-3 text-sm text-red-800">
                  <input
                    type="checkbox"
                    checked={includeAccount}
                    onChange={(event) => setIncludeAccount(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-red-300 bg-white"
                  />
                  <span>{t(TEXT.deleteAccountToo)}</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder={locale === 'fr' ? 'Saisir SUPPRIMER' : 'Type DELETE'}
                  className="w-full rounded-lg border border-red-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={actions.loading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                >
                  {t(TEXT.confirmDelete)}
                </button>
              </div>
              {actions.deleted && (
                <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  {t(TEXT.dataDeleted)}
                </p>
              )}
            </SectionCard>
          </div>

          <div
            id="panel-communication"
            role="tabpanel"
            aria-labelledby="tab-communication"
            hidden={activeTab !== 'communication'}
          >
            <SectionCard
              title={t(TEXT.unsubscribeTitle)}
              description={t(TEXT.unsubscribeDescription)}
            >
              <div className="mt-5 max-w-xl space-y-4">
                <label htmlFor="unsubscribe-token" className="block text-sm font-medium text-slate-700">
                  {t(TEXT.unsubscribeToken)}
                </label>
                <input
                  id="unsubscribe-token"
                  type="text"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder={t(TEXT.pasteToken)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                />
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={actions.loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {t(TEXT.unsubscribe)}
                </button>
              </div>
              {actions.unsubscribed && (
                <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  {t(TEXT.unsubscribed)}
                </p>
              )}
            </SectionCard>
          </div>

          {(localError || actions.error) && (
            <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {localError ?? actions.error.message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
