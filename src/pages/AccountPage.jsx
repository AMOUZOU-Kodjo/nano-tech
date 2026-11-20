import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMeActions } from '@/hooks/useMeActions.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { useUsage } from '@/hooks/useUsage.js'

// Libellés des compteurs documentés, affichés seulement quand la réponse les contient.
const QUOTA_LABELS = {
  plan: 'Formule',
  credits: 'Crédits',
  paywall_enabled: 'Paywall actif',
  free_uses_left: 'Essais gratuits restants',
  ai_uses_left_today: 'Rendus IA restants aujourd’hui',
  daily_jobs_left: 'Jobs restants aujourd’hui',
  daily_renders_left: 'Rendus restants aujourd’hui',
  limit: 'Limite',
  used: 'Utilisé',
  remaining: 'Restant',
}

const USAGE_LABELS = {
  authenticated: 'Compte authentifié',
  plan: 'Formule',
  credits: 'Crédits',
  paywall_enabled: 'Paywall actif',
  free_uses_left: 'Essais gratuits restants',
  ai_uses_left_today: 'Rendus IA restants aujourd’hui',
  daily_jobs_left: 'Jobs restants aujourd’hui',
  daily_renders_left: 'Rendus restants aujourd’hui',
}

const LIMIT_LABELS = {
  tier: 'Niveau',
  max_file_mb: 'Taille max. par fichier',
  max_total_mb: 'Total max. par lot',
  max_files: 'Nombre max. de fichiers',
  max_pdf_pages: 'Pages PDF max.',
  max_video_minutes: 'Durée vidéo max.',
  max_documents: 'Documents max.',
  max_document_storage_mb: 'Stockage documents max.',
}

const AI_LABELS = {
  limit: 'Limite quotidienne',
  used: 'Utilisé',
  remaining: 'Restant',
  resets_at: 'Réinitialisation',
}

const TABS = [
  { id: 'overview', label: 'Vue d’ensemble', description: 'Quota et consommation' },
  { id: 'data', label: 'Données personnelles', description: 'Export et suppression' },
  { id: 'communication', label: 'Communication', description: 'Préférences email' },
]

const OVERVIEW_TABS = [
  { id: 'quota', label: 'Quota courant' },
  { id: 'access', label: 'Accès et compteurs' },
  { id: 'limits', label: 'Limites du compte' },
  { id: 'ai', label: 'Rendus IA' },
  { id: 'tools', label: 'Outils activés' },
]

function formatValue(key, value) {
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }
  if (key === 'resets_at' && typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  }
  if (typeof value === 'number' && key.endsWith('_mb')) {
    return `${value} Mo`
  }
  if (typeof value === 'number' && key.endsWith('_minutes')) {
    return `${value} min`
  }
  return String(value)
}

function rowsFrom(values, labels) {
  if (!values || typeof values !== 'object') {
    return []
  }

  return Object.entries(labels)
    .filter(([key]) => key in values && values[key] !== null && values[key] !== undefined)
    .map(([key, label]) => ({ key, label, value: formatValue(key, values[key]) }))
}

function quotaRows(quota) {
  return rowsFrom(quota, QUOTA_LABELS)
}

function usageIdentity(data) {
  if (!data) {
    return null
  }
  if (!data.user) {
    return 'Invité'
  }
  return data.user.email ?? data.user.id ?? 'Compte connecté'
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
  if (!rows.length) {
    return <p className="mt-5 text-sm text-slate-600">Aucune donnée disponible.</p>
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
  return (
    <div
      role="tablist"
      aria-label="Sections du compte"
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
              {tab.label}
            </span>
            <span className="mt-1 block text-xs text-slate-500">{tab.description}</span>
          </button>
        )
      })}
    </div>
  )
}

function OverviewTabs({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Détails de la vue d’ensemble"
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
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Réponse brute</p>
      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}

// Page compte : quota courant, consommation détaillée et actions RGPD documentées.
export default function AccountPage() {
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

    if (deleteConfirmation !== 'SUPPRIMER') {
      setLocalError('Saisissez SUPPRIMER pour confirmer.')
      return
    }

    actions.deleteMyData(includeAccount)
  }

  function handleUnsubscribe() {
    setLocalError(null)

    if (!token.trim()) {
      setLocalError('Saisissez le jeton de désinscription.')
      return
    }

    actions.unsubscribe(token.trim())
  }

  const rows = quotaRows(quota)
  const usageData = usage.data
  const usageRows = rowsFrom(usageData, USAGE_LABELS)
  const limitRows = rowsFrom(usageData?.limits, LIMIT_LABELS)
  const aiRows = rowsFrom(usageData?.ai, AI_LABELS)
  const enabledTools = usageData?.tools_enabled && typeof usageData.tools_enabled === 'object'
    ? Object.values(usageData.tools_enabled).filter(Boolean).length
    : null
  const enabledToolsTotal = usageData?.tools_enabled && typeof usageData.tools_enabled === 'object'
    ? Object.keys(usageData.tools_enabled).length
    : null
  const identity = isGuest ? 'Invité' : user?.email ?? user?.name ?? 'Compte connecté'
  const toolsLabel = enabledTools !== null ? `${enabledTools} / ${enabledToolsTotal}` : '—'

  const stats = [
    { label: 'Formule', value: rowValue(rows, 'plan'), hint: 'Offre actuelle' },
    { label: 'Crédits', value: rowValue(rows, 'credits'), hint: 'Solde disponible' },
    { label: 'Essais restants', value: rowValue(rows, 'free_uses_left'), hint: 'Quota gratuit' },
    { label: 'Outils activés', value: toolsLabel, hint: 'Accès catalogue' },
  ]

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Espace utilisateur</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Mon compte</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Suivez votre quota, consultez votre consommation et gérez vos données personnelles.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-400/20 text-sm font-semibold text-sky-200">
                {meLoading ? '…' : initials(identity)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Compte courant</p>
                <p className="mt-1 truncate text-base font-semibold">{meLoading ? 'Chargement…' : identity}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isGuest ? 'bg-amber-400/15 text-amber-200' : 'bg-emerald-400/15 text-emerald-200'
              }`}>
                {isGuest ? 'Invité' : 'Connecté'}
              </span>
              {!meLoading && !isGuest && (
                <Link
                  to="/profile"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Modifier mon profil
                </Link>
              )}
              {!meLoading && isGuest && (
                <Link
                  to="/login"
                  className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside>
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Navigation</p>
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
              {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            <SectionCard
              title="Détails du compte"
              description="Choisissez une section pour afficher les données correspondantes."
              action={(
                <button
                  type="button"
                  onClick={getUsage}
                  disabled={usage.loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {usage.loading ? 'Chargement…' : 'Actualiser'}
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
                <ValueList rows={usageData ? [{ key: 'identity', label: 'Identité', value: usageIdentity(usageData) }, ...usageRows] : []} />
              </div>

              <div id="overview-panel-limits" role="tabpanel" aria-labelledby="overview-tab-limits" hidden={overviewTab !== 'limits'}>
                <ValueList rows={limitRows} />
              </div>

              <div id="overview-panel-ai" role="tabpanel" aria-labelledby="overview-tab-ai" hidden={overviewTab !== 'ai'}>
                <ValueList rows={aiRows} />
              </div>

              <div id="overview-panel-tools" role="tabpanel" aria-labelledby="overview-tab-tools" hidden={overviewTab !== 'tools'}>
                <ValueList rows={enabledTools !== null ? [{ key: 'enabled', label: 'Outils disponibles', value: toolsLabel }] : []} />
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
              title="Exporter mes données"
              description="Récupère l’export RGPD prévu par l’API."
              action={(
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={actions.loading}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                >
                  Demander l’export
                </button>
              )}
            >
              {actions.exportedData && <JsonBlock value={actions.exportedData} />}
              {actions.data && !actions.exportedData && <JsonBlock value={actions.data} />}
            </SectionCard>

            <SectionCard
              title="Supprimer mes données"
              description="Action irréversible. La suppression du compte est optionnelle."
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
                  <span>Supprimer également le compte.</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="Saisir SUPPRIMER"
                  className="w-full rounded-lg border border-red-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={actions.loading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                >
                  Confirmer la suppression
                </button>
              </div>
              {actions.deleted && (
                <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  Données supprimées.
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
              title="Désinscription marketing"
              description="Utilisez le jeton reçu dans l’email de communication."
            >
              <div className="mt-5 max-w-xl space-y-4">
                <label htmlFor="unsubscribe-token" className="block text-sm font-medium text-slate-700">
                  Jeton de désinscription
                </label>
                <input
                  id="unsubscribe-token"
                  type="text"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Collez votre jeton"
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                />
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={actions.loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Se désinscrire
                </button>
              </div>
              {actions.unsubscribed && (
                <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  Désinscription effectuée.
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
