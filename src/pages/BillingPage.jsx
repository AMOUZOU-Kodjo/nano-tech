import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { useBilling } from '@/hooks/useBilling.js'

const BILLING_LABELS = {
  billing_enabled: { fr: 'Facturation active', en: 'Billing enabled' },
  paywall_enabled: { fr: 'Paywall actif', en: 'Paywall enabled' },
  credits: { fr: 'Crédits', en: 'Credits' },
  plan: { fr: 'Formule actuelle', en: 'Current plan' },
  plans: { fr: 'Formules disponibles', en: 'Available plans' },
  price_id: { fr: 'Identifiant du tarif', en: 'Price ID' },
}

const CHECKOUT_LABELS = {
  session_id: { fr: 'Identifiant de session', en: 'Session ID' },
}

const TEXT = {
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
  noInformation: { fr: 'Aucune information disponible.', en: 'No information available.' },
  paywallActive: { fr: 'Paywall actif', en: 'Paywall enabled' },
  paywallDisabled: { fr: 'Paywall désactivé', en: 'Paywall disabled' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  title: { fr: 'Facturation', en: 'Billing' },
  subtitle: {
    fr: 'État des crédits, du paywall et session de paiement.',
    en: 'Credits status, paywall status and payment session.',
  },
  statusTitle: { fr: 'État de facturation', en: 'Billing status' },
  freePeriod: {
    fr: 'Le paywall est désactivé pendant la période gratuite.',
    en: 'The paywall is disabled during the free period.',
  },
  noStatus: { fr: 'Aucun état disponible.', en: 'No status available.' },
  startPayment: { fr: 'Démarrer un paiement', en: 'Start a payment' },
  checkoutIntro: {
    fr: 'La session est créée par l’API, sans choix de plan inventé.',
    en: 'The session is created by the API, without any invented plan choice.',
  },
  creating: { fr: 'Création…', en: 'Creating…' },
  createSession: { fr: 'Créer une session', en: 'Create a session' },
  checkoutUnavailable: {
    fr: 'La création de session sera disponible quand la facturation sera activée côté API.',
    en: 'Session creation will be available once billing is enabled on the API side.',
  },
  openSession: { fr: 'Ouvrir la session de paiement', en: 'Open the payment session' },
  noCheckoutLink: {
    fr: 'La session a été créée mais aucun lien de paiement n’a été renvoyé.',
    en: 'The session was created but no payment link was returned.',
  },
}

function formatValue(value, t) {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return t(value ? TEXT.yes : TEXT.no)
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

function rowsFrom(values, labels, excluded, t) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return []
  }

  return Object.entries(values)
    .filter(([key, value]) => !excluded.includes(key) && value !== null && value !== undefined)
    .map(([key, value]) => ({
      key,
      label: t(labels[key] ?? key),
      value: formatValue(value, t),
    }))
}

function ValueList({ rows }) {
  const { t } = useLocale()

  if (!rows.length) {
    return <p className="mt-4 text-sm text-slate-600">{t(TEXT.noInformation)}</p>
  }

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.key} className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
          <dd className="mt-1 break-all text-sm text-slate-700">{row.value}</dd>
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
  const { t } = useLocale()
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
  const checkoutInFlight = useRef(false)
  const [checkoutPending, setCheckoutPending] = useState(false)

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
  const statusRows = rowsFrom(status, BILLING_LABELS, ['checkout_url', 'session_id'], t)
  const checkoutRows = rowsFrom(checkout, CHECKOUT_LABELS, ['checkout_url'], t)
  const paywallLabel = typeof status?.paywall_enabled === 'boolean'
    ? t(status.paywall_enabled ? TEXT.paywallActive : TEXT.paywallDisabled)
    : null
  const proPlan = Array.isArray(status?.plans)
    ? status.plans.find((plan) => plan?.id === 'pro')
    : null
  const checkoutAvailable = status?.billing_enabled === true && proPlan?.checkout_available !== false

  async function handleCheckout() {
    if (checkoutInFlight.current) {
      return
    }

    checkoutInFlight.current = true
    setCheckoutPending(true)

    try {
      await startCheckout()
    } finally {
      checkoutInFlight.current = false
      setCheckoutPending(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{t(TEXT.title)}</h1>
      <p className="mt-2 text-sm text-slate-600">{t(TEXT.subtitle)}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">{t(TEXT.statusTitle)}</h2>
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
              {t(loading ? TEXT.loading : TEXT.refresh)}
            </button>
          </div>
        </div>

        {status?.paywall_enabled === false && (
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            {t(TEXT.freePeriod)}
          </p>
        )}

        {status && <ValueList rows={statusRows} />}
        {!status && !loading && <p className="mt-4 text-sm text-slate-600">{t(TEXT.noStatus)}</p>}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">{t(TEXT.startPayment)}</h2>
        <p className="mt-2 text-sm text-slate-600">{t(TEXT.checkoutIntro)}</p>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || checkoutPending || !checkoutAvailable}
          className="mt-4 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
        >
          {t(checkoutPending ? TEXT.creating : TEXT.createSession)}
        </button>

        {status && !checkoutAvailable && (
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            {t(TEXT.checkoutUnavailable)}
          </p>
        )}

        {checkoutLink && (
          <a
            href={checkoutLink}
            className="mt-4 ml-3 inline-block rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t(TEXT.openSession)}
          </a>
        )}

        {checkout && (
          <div className="mt-5">
            {checkoutLink || sessionId ? (
              <ValueList rows={checkoutRows} />
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                {t(TEXT.noCheckoutLink)}
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
