import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMeActions } from '@/hooks/useMeActions.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { useUsage } from '@/hooks/useUsage.js'
import { useLocale } from '@/hooks/useLocale.js'

const QUOTA_LABELS = {
  plan: { fr: 'Votre formule', en: 'Your plan' },
  credits: { fr: 'Crédits disponibles', en: 'Available credits' },
  free_uses_left: { fr: 'Essais gratuits restants', en: 'Free trials remaining' },
  ai_uses_left_today: { fr: 'Améliorations IA restantes', en: 'AI improvements remaining' },
  daily_jobs_left: { fr: 'Traitements restants', en: 'Processing left' },
  daily_renders_left: { fr: 'Documents restants', en: 'Documents left' },
  limit: { fr: 'Limite quotidienne', en: 'Daily limit' },
  used: { fr: 'Utilisé aujourd’hui', en: 'Used today' },
  remaining: { fr: 'Restant aujourd’hui', en: 'Left today' },
}

const USAGE_LABELS = {
  plan: { fr: 'Votre formule', en: 'Your plan' },
  credits: { fr: 'Crédits disponibles', en: 'Available credits' },
  free_uses_left: { fr: 'Essais gratuits restants', en: 'Free trials remaining' },
  ai_uses_left_today: { fr: 'Améliorations IA restantes', en: 'AI improvements remaining' },
  daily_jobs_left: { fr: 'Traitements restants', en: 'Processing left' },
  daily_renders_left: { fr: 'Documents restants', en: 'Documents left' },
}

const LIMIT_LABELS = {
  tier: { fr: 'Niveau', en: 'Tier' },
  max_file_mb: { fr: 'Taille maximale par fichier', en: 'Maximum size per file' },
  max_total_mb: { fr: 'Taille maximale par lot', en: 'Maximum size per batch' },
  max_files: { fr: 'Nombre maximal de fichiers', en: 'Maximum number of files' },
  max_pdf_pages: { fr: 'Nombre maximal de pages PDF', en: 'Maximum PDF pages' },
  max_video_minutes: { fr: 'Durée maximale des vidéos', en: 'Maximum video duration' },
  max_documents: { fr: 'Nombre maximal de documents', en: 'Maximum number of documents' },
  max_document_storage_mb: { fr: 'Espace maximal pour les documents', en: 'Maximum document storage' },
}

const AI_LABELS = {
  limit: { fr: 'Quota quotidien', en: 'Daily allowance' },
  used: { fr: 'Utilisé aujourd’hui', en: 'Used today' },
  remaining: { fr: 'Restant aujourd’hui', en: 'Left today' },
  resets_at: { fr: 'Prochaine réinitialisation', en: 'Next reset' },
}

const TABS = [
  {
    id: 'overview',
    label: { fr: 'Mon activité', en: 'My activity' },
    description: { fr: 'Offre, consommation et limites', en: 'Plan, usage and limits' },
  },
  {
    id: 'data',
    label: { fr: 'Mes données', en: 'My data' },
    description: { fr: 'Exporter ou supprimer', en: 'Export or delete' },
  },
  {
    id: 'communication',
    label: { fr: 'Communications', en: 'Communications' },
    description: { fr: 'Préférences email', en: 'Email preferences' },
  },
]

const TEXT = {
  userSpace: { fr: 'Espace utilisateur', en: 'User space' },
  deleteConfirmationRequired: {
    fr: 'Saisissez SUPPRIMER pour confirmer.',
    en: 'Type DELETE to confirm.',
  },
  unsubscribeTokenRequired: {
    fr: 'Saisissez le code reçu par email.',
    en: 'Enter the code received by email.',
  },
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
  freePlan: { fr: 'Gratuite', en: 'Free' },
  proPlan: { fr: 'Pro', en: 'Pro' },
  guest: { fr: 'Invité', en: 'Guest' },
  signedInAccount: { fr: 'Compte connecté', en: 'Signed-in account' },
  noData: { fr: 'Aucune information disponible.', en: 'No information available.' },
  accountSections: { fr: 'Sections du compte', en: 'Account sections' },
  accountIntro: {
    fr: 'Retrouvez votre offre, votre consommation et vos préférences au même endroit.',
    en: 'Find your plan, usage and preferences in one place.',
  },
  myAccount: { fr: 'Mon compte', en: 'My account' },
  currentAccount: { fr: 'Compte actuel', en: 'Current account' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  signedIn: { fr: 'Connecté', en: 'Signed in' },
  editProfile: { fr: 'Modifier mon profil', en: 'Edit my profile' },
  signIn: { fr: 'Se connecter', en: 'Sign in' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  activityTitle: { fr: 'Votre activité', en: 'Your activity' },
  activityDescription: {
    fr: 'Ce que vous pouvez encore faire aujourd’hui.',
    en: 'What you can still do today.',
  },
  planDetails: { fr: 'Votre offre', en: 'Your plan' },
  usageDetails: { fr: 'Vos possibilités du jour', en: 'What you can do today' },
  limitsDetails: { fr: 'Vos limites', en: 'Your limits' },
  aiDetails: { fr: 'Vos améliorations IA', en: 'Your AI improvements' },
  toolsDetails: { fr: 'Vos outils disponibles', en: 'Your available tools' },
  statPlan: { fr: 'Formule', en: 'Plan' },
  statCredits: { fr: 'Crédits', en: 'Credits' },
  statTrials: { fr: 'Essais gratuits', en: 'Free trials' },
  statTools: { fr: 'Outils activés', en: 'Enabled tools' },
  currentOffer: { fr: 'Offre en cours', en: 'Current offer' },
  availableBalance: { fr: 'Solde disponible', en: 'Available balance' },
  trialsLeft: { fr: 'Restants aujourd’hui', en: 'Left today' },
  catalogueAccess: { fr: 'Accès disponibles', en: 'Available access' },
  exportTitle: { fr: 'Exporter mes données', en: 'Export my data' },
  exportDescription: {
    fr: 'Téléchargez une copie des informations associées à votre compte.',
    en: 'Download a copy of the information linked to your account.',
  },
  requestExport: { fr: 'Préparer l’export', en: 'Prepare export' },
  exportReady: { fr: 'Votre export est prêt.', en: 'Your export is ready.' },
  downloadExport: { fr: 'Télécharger mes données', en: 'Download my data' },
  deleteTitle: { fr: 'Supprimer mes données', en: 'Delete my data' },
  deleteDescription: {
    fr: 'Cette action est irréversible. La suppression du compte est facultative.',
    en: 'This action cannot be undone. Deleting the account is optional.',
  },
  deleteAccountToo: { fr: 'Supprimer également mon compte.', en: 'Delete my account as well.' },
  confirmDelete: { fr: 'Confirmer la suppression', en: 'Confirm deletion' },
  dataDeleted: { fr: 'Vos données ont été supprimées.', en: 'Your data has been deleted.' },
  unsubscribeTitle: { fr: 'Ne plus recevoir d’actualités', en: 'Stop receiving news' },
  unsubscribeDescription: {
    fr: 'Collez le code reçu dans l’email pour vous désinscrire.',
    en: 'Paste the code from the email to unsubscribe.',
  },
  unsubscribeCode: { fr: 'Code reçu par email', en: 'Code received by email' },
  pasteCode: { fr: 'Collez votre code ici', en: 'Paste your code here' },
  unsubscribe: { fr: 'Se désinscrire', en: 'Unsubscribe' },
  unsubscribed: { fr: 'Vous n’êtes plus inscrit aux actualités.', en: 'You are no longer subscribed to news.' },
  usageError: {
    fr: 'Impossible d’actualiser votre activité pour le moment.',
    en: 'Unable to refresh your activity right now.',
  },
  actionError: {
    fr: 'Une erreur est survenue. Réessayez dans quelques instants.',
    en: 'Something went wrong. Please try again shortly.',
  },
}

const CARD_CLASS = 'rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'

function formatValue(key, value, locale, t) {
  if (typeof value === 'boolean') {
    return t(value ? TEXT.yes : TEXT.no)
  }
  if (key === 'plan') {
    if (value === 'free') {
      return t(TEXT.freePlan)
    }
    if (value === 'pro') {
      return t(TEXT.proPlan)
    }
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

function downloadJson(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function ValueList({ rows }) {
  const { t } = useLocale()

  if (!rows.length) {
    return <p className="mt-4 text-sm text-ink-muted">{t(TEXT.noData)}</p>
  }

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.key} className="rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/50">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{row.label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-surface p-5 ring-1 ring-line/50">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{label}</p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{hint}</p>
    </div>
  )
}

function SectionCard({ title, description, action, children, tone = 'default' }) {
  const danger = tone === 'danger'

  return (
    <section className={`${CARD_CLASS} ${danger ? 'bg-red-50/60 ring-red-200 dark:bg-red-950/20' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={`text-lg font-semibold ${danger ? 'text-red-900 dark:text-red-200' : 'text-ink'}`}>{title}</h2>
          {description && (
            <p className={`mt-1 text-sm leading-relaxed ${danger ? 'text-red-800 dark:text-red-300' : 'text-ink-muted'}`}>
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function AccountTabs({ active, onChange }) {
  const { t } = useLocale()

  return (
    <div
      role="tablist"
      aria-label={t(TEXT.accountSections)}
      className="grid gap-2 sm:grid-cols-3"
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
            className={`rounded-2xl px-4 py-4 text-left ring-1 transition focus:outline-none focus:ring-2 focus:ring-brand/40 ${
              isActive ? 'bg-surface ring-brand/40' : 'bg-surface-muted/40 ring-line/50 hover:text-brand'
            }`}
          >
            <span className={`block text-sm font-semibold ${isActive ? 'text-brand' : 'text-ink'}`}>
              {t(tab.label)}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{t(tab.description)}</span>
          </button>
        )
      })}
    </div>
  )
}

function DetailGroup({ title, rows }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ValueList rows={rows} />
    </div>
  )
}

// Page compte : offre, consommation et actions personnelles, présentées sans vocabulaire technique.
export default function AccountPage() {
  const { locale, t } = useLocale()
  const [searchParams] = useSearchParams()
  const { user, quota, reload, isGuest, loading: meLoading } = useMeContext()
  const usage = useUsage()
  const { getUsage } = usage
  const actions = useMeActions({ onSuccess: reload })
  const [activeTab, setActiveTab] = useState('overview')
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
    { key: 'plan', label: t(TEXT.statPlan), value: rowValue(rows, 'plan'), hint: t(TEXT.currentOffer) },
    { key: 'credits', label: t(TEXT.statCredits), value: rowValue(rows, 'credits'), hint: t(TEXT.availableBalance) },
    { key: 'trials', label: t(TEXT.statTrials), value: rowValue(rows, 'free_uses_left'), hint: t(TEXT.trialsLeft) },
    { key: 'tools', label: t(TEXT.statTools), value: toolsLabel, hint: t(TEXT.catalogueAccess) },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{t(TEXT.userSpace)}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.myAccount)}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{t(TEXT.accountIntro)}</p>
        </div>
        {!meLoading && !isGuest && (
          <Link
            to="/profile"
            className="self-start rounded-xl bg-surface-muted/60 px-5 py-3 text-sm font-semibold text-ink ring-1 ring-line/50 transition hover:text-brand"
          >
            {t(TEXT.editProfile)}
          </Link>
        )}
        {!meLoading && isGuest && (
          <Link
            to="/login"
            className="self-start rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft"
          >
            {t(TEXT.signIn)}
          </Link>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-surface-muted/40 p-5 ring-1 ring-line/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-semibold text-brand">
            {meLoading ? '…' : initials(identity)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{t(TEXT.currentAccount)}</p>
            <p className="mt-1 truncate text-base font-semibold text-ink">
              {meLoading ? t(TEXT.loading) : identity}
            </p>
          </div>
        </div>
        <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ring-1 sm:self-auto ${
          isGuest
            ? 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900'
            : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900'
        }`}>
          {t(isGuest ? TEXT.guest : TEXT.signedIn)}
        </span>
      </div>

      <div className="mt-8">
        <AccountTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mt-6">
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
            title={t(TEXT.activityTitle)}
            description={t(TEXT.activityDescription)}
            action={(
              <button
                type="button"
                onClick={getUsage}
                disabled={usage.loading}
                className="rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand disabled:opacity-50"
              >
                {t(usage.loading ? TEXT.loading : TEXT.refresh)}
              </button>
            )}
          >
            {usage.error && (
              <p role="alert" className="mt-5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                {t(TEXT.usageError)}
              </p>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <DetailGroup title={t(TEXT.planDetails)} rows={rows} />
              <DetailGroup
                title={t(TEXT.usageDetails)}
                rows={usageData ? [
                  { key: 'identity', label: t(TEXT.currentAccount), value: usageIdentity(usageData, t) },
                  ...usageRows,
                ] : []}
              />
            </div>

            <div className="mt-6 space-y-2 border-t border-line/60 pt-5">
              <details className="rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/50">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{t(TEXT.limitsDetails)}</summary>
                <ValueList rows={limitRows} />
              </details>
              <details className="rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/50">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{t(TEXT.aiDetails)}</summary>
                <ValueList rows={aiRows} />
              </details>
              <details className="rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/50">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{t(TEXT.toolsDetails)}</summary>
                <ValueList rows={enabledTools !== null ? [{ key: 'enabled', label: t(TEXT.statTools), value: toolsLabel }] : []} />
              </details>
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
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50"
              >
                {t(TEXT.requestExport)}
              </button>
            )}
          >
            {actions.exportedData && (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-surface px-4 py-4 ring-1 ring-line/50 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" className="text-sm font-medium text-ink">{t(TEXT.exportReady)}</p>
                <button
                  type="button"
                  onClick={() => downloadJson(actions.exportedData, 'nanofile-export.json')}
                  className="self-start rounded-xl bg-surface-muted px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand sm:self-auto"
                >
                  {t(TEXT.downloadExport)}
                </button>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={t(TEXT.deleteTitle)}
            description={t(TEXT.deleteDescription)}
            tone="danger"
          >
            <div className="mt-5 space-y-4">
              <label className="flex items-start gap-3 text-sm text-red-800 dark:text-red-200">
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
                className="w-full rounded-xl bg-white p-3 text-sm text-slate-900 ring-1 ring-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
              <button
                type="button"
                onClick={handleDelete}
                disabled={actions.loading}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {t(TEXT.confirmDelete)}
              </button>
            </div>
            {actions.deleted && (
              <p role="status" className="mt-5 rounded-xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
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
              <label htmlFor="unsubscribe-code" className="block text-sm font-medium text-ink-muted">
                {t(TEXT.unsubscribeCode)}
              </label>
              <input
                id="unsubscribe-code"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder={t(TEXT.pasteCode)}
                className="mt-2 w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={actions.loading}
                className="rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand disabled:opacity-50"
              >
                {t(TEXT.unsubscribe)}
              </button>
            </div>
            {actions.unsubscribed && (
              <p role="status" className="mt-5 rounded-xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                {t(TEXT.unsubscribed)}
              </p>
            )}
          </SectionCard>
        </div>

        {(localError || actions.error) && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {t(TEXT.actionError)}
          </p>
        )}
      </div>
    </section>
  )
}
