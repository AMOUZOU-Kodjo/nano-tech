import { useEffect } from 'react'
import { useBilling } from '@/hooks/useBilling.js'

const BILLING_LABELS = {
  billing_enabled: 'Facturation active',
  paywall_enabled: 'Paywall actif',
  credits: 'Crédits',
  plan: 'Formule actuelle',
  plans: 'Formules disponibles',
  price_id: 'Identifiant du tarif',
}

const CHECKOUT_LABELS = {
  session_id: 'Identifiant de session',
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') {
        return item.name ?? item.title ?? item.id ?? item.code ?? String(item)
      }
      return String(item)
    }).join(', ') || '—'
  }
  if (typeof value === 'object') {
    return Object.keys(value).join(', ') || '—'
  }
  return String(value)
}

function rowsFrom(values, labels, excluded = []) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return []
  }

  return Object.entries(values)
    .filter(([key, value]) => !excluded.includes(key) && value !== null && value !== undefined)
    .map(([key, value]) => ({ key, label: labels[key] ?? key, value: formatValue(value) }))
}

function ValueList({ rows }) {
  if (!rows.length) {
    return <p className="mt-4 text-sm text-slate-600">Aucune information disponible.</p>
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

// N'autorise qu'une URL http(s) avant d'afficher un lien de paiement externe.
function safeCheckoutUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : ''
}

// Page facturation : état du paywall et lancement du checkout documenté.
export default function BillingPage() {
  const billing = useBilling()
  const {
    status,
    checkout,
    checkoutUrl,
    sessionId,
    loading,
    error,
    getBillingStatus: fetchBillingStatus,
    createCheckout: startCheckout,
  } = billing

  // Diffère le chargement pour ne pas modifier l'état pendant l'effet lui-même.
  useEffect(() => {
    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return fetchBillingStatus()
      }
      return null
    })

    return () => {
      active = false
    }
  }, [fetchBillingStatus])

  const checkoutLink = safeCheckoutUrl(checkoutUrl)
  const statusRows = rowsFrom(status, BILLING_LABELS, ['checkout_url', 'session_id'])
  const checkoutRows = rowsFrom(checkout, CHECKOUT_LABELS, ['checkout_url'])
  const paywallLabel = typeof status?.paywall_enabled === 'boolean'
    ? (status.paywall_enabled ? 'Paywall actif' : 'Paywall désactivé')
    : null

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Facturation</h1>
      <p className="mt-2 text-sm text-slate-600">État des crédits, du paywall et session de paiement.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">État de facturation</h2>
          <div className="flex flex-wrap items-center gap-3">
            {paywallLabel && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                status.paywall_enabled
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {paywallLabel}
              </span>
            )}
            <button
              type="button"
              onClick={fetchBillingStatus}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? 'Chargement…' : 'Actualiser'}
            </button>
          </div>
        </div>

        {status?.paywall_enabled === false && (
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Le paywall est désactivé pendant la période gratuite.
          </p>
        )}

        {status && <ValueList rows={statusRows} />}
        {!status && !loading && <p className="mt-4 text-sm text-slate-600">Aucun état disponible.</p>}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Démarrer un paiement</h2>
        <p className="mt-2 text-sm text-slate-600">La session est créée par l’API, sans choix de plan inventé.</p>
        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mt-4 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
        >
          Créer une session
        </button>

        {checkoutLink && (
          <a
            href={checkoutLink}
            className="mt-4 ml-3 inline-block rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ouvrir la session de paiement
          </a>
        )}

        {checkout && (
          <div className="mt-5">
            {checkoutLink || sessionId ? (
              <ValueList rows={checkoutRows} />
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                La session a été créée mais aucun lien de paiement n’a été renvoyé.
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </section>
  )
}
