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

function ValueList({ rows }) {
  if (!rows.length) {
    return <p className="mt-4 text-sm text-slate-600">Aucune donnée disponible.</p>
  }

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.key} className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
          <dd className="mt-1 text-sm text-slate-700">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  return <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// Page compte : quota courant, consommation détaillée et actions RGPD documentées.
export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const { quota, reload, isGuest, loading: meLoading } = useMeContext()
  const usage = useUsage()
  const { getUsage } = usage
  const actions = useMeActions({ onSuccess: reload })
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

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Mon compte</h1>
      <p className="mt-2 text-sm text-slate-600">Quota, consommation et données personnelles.</p>

      {meLoading && <p className="mt-6 text-sm text-slate-600">Chargement du profil…</p>}

      {!meLoading && isGuest && (
        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          Vous consultez en invité. <Link to="/login" className="text-sky-600 hover:text-sky-700">Connectez-vous</Link> pour gérer votre compte.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Quota courant</h2>
        {rows.length ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.key} className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
                <dd className="mt-1 text-sm text-slate-700">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-600">Aucun compteur disponible.</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Consommation détaillée</h2>
          <button
            type="button"
            onClick={getUsage}
            disabled={usage.loading}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
          >
            {usage.loading ? 'Chargement…' : 'Actualiser'}
          </button>
        </div>
        {usage.error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {usage.error.message}
          </p>
        )}
        {usageData && (
          <div className="mt-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Accès et compteurs</h3>
              <ValueList rows={[{ key: 'identity', label: 'Identité', value: usageIdentity(usageData) }, ...usageRows]} />
            </div>

            {limitRows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Limites du compte</h3>
                <ValueList rows={limitRows} />
              </div>
            )}

            {aiRows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Rendus IA</h3>
                <ValueList rows={aiRows} />
              </div>
            )}

            {enabledTools !== null && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Outils activés</h3>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Outils disponibles</dt>
                    <dd className="mt-1 text-sm text-slate-700">{enabledTools} / {enabledToolsTotal}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Exporter mes données</h2>
          <p className="mt-2 text-sm text-slate-600">Récupère l’export RGPD prévu par l’API.</p>
          <button
            type="button"
            onClick={handleExport}
            disabled={actions.loading}
            className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
          >
            Demander l’export
          </button>
          {actions.exportedData && <JsonBlock value={actions.exportedData} />}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Désinscription marketing</h2>
          <p className="mt-2 text-sm text-slate-600">Utilisez le jeton reçu dans l’email.</p>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Jeton de désinscription"
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={actions.loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
            >
              Se désinscrire
            </button>
          </div>
          {actions.unsubscribed && (
            <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              Désinscription effectuée.
            </p>
          )}
          {actions.data && !actions.exportedData && <JsonBlock value={actions.data} />}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-800">Supprimer mes données</h2>
        <p className="mt-2 text-sm text-red-700">Action irréversible. La suppression du compte est optionnelle.</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={includeAccount}
              onChange={(event) => setIncludeAccount(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 bg-white"
            />
            <span>Supprimer également le compte.</span>
          </label>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            placeholder="Saisir SUPPRIMER"
            className="w-full rounded-lg border border-red-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={actions.loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          >
            Confirmer la suppression
          </button>
        </div>
        {actions.deleted && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Données supprimées.
          </p>
        )}
      </div>

      {(localError || actions.error) && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {localError ?? actions.error.message}
        </p>
      )}
    </section>
  )
}
