import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { useBilling } from '@/hooks/useBilling.js'

const TEXT = {
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
  paywallActive: { fr: 'Abonnement requis', en: 'Subscription required' },
  paywallDisabled: { fr: 'Accès gratuit', en: 'Free access' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  title: { fr: 'Facturation', en: 'Billing' },
  subtitle: {
    fr: 'Consultez votre formule, vos crédits et vos paiements.',
    en: 'View your plan, credits and payments.',
  },
  statusTitle: { fr: 'Votre formule', en: 'Your plan' },
  freePeriod: {
    fr: 'Vous profitez actuellement de la période gratuite. Aucun paiement n’est nécessaire.',
    en: 'You are currently in the free period. No payment is required.',
  },
  noStatus: {
    fr: 'Les informations de facturation ne sont pas encore disponibles.',
    en: 'Billing information is not available yet.',
  },
  currentPlan: { fr: 'Formule actuelle', en: 'Current plan' },
  availableCredits: { fr: 'Crédits disponibles', en: 'Available credits' },
  freePlan: { fr: 'Gratuit', en: 'Free' },
  proPlan: { fr: 'Pro', en: 'Pro' },
  startPayment: { fr: 'Passer à la formule Pro', en: 'Upgrade to Pro' },
  checkoutIntro: {
    fr: 'Vous serez redirigé vers une page de paiement sécurisée.',
    en: 'You will be redirected to a secure payment page.',
  },
  creating: { fr: 'Préparation du paiement…', en: 'Preparing payment…' },
  createSession: { fr: 'Continuer vers le paiement', en: 'Continue to payment' },
  checkoutUnavailable: {
    fr: 'Le paiement en ligne sera bientôt disponible. Vous pouvez continuer à utiliser la formule gratuite.',
    en: 'Online payment will be available soon. You can keep using the free plan.',
  },
  openSession: { fr: 'Reprendre le paiement', en: 'Resume payment' },
  noCheckoutLink: {
    fr: 'Le lien de paiement n’est pas disponible pour le moment. Réessayez dans quelques instants.',
    en: 'The payment link is not available right now. Please try again shortly.',
  },
  error: {
    fr: 'Une erreur est survenue. Réessayez dans quelques instants.',
    en: 'Something went wrong. Please try again shortly.',
  },
}

function planLabel(value, t) {
  if (value === 'free') {
    return t(TEXT.freePlan)
  }
  if (value === 'pro') {
    return t(TEXT.proPlan)
  }
  return null
}

// N'autorise qu'une URL http(s) avant d'afficher un lien de paiement externe.
function safeCheckoutUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : ''
}

// Page facturation : formule, crédits et accès au paiement.
export default function BillingPage() {
  const { t } = useLocale()
  const billing = useBilling()
  const {
    status,
    checkout,
    checkoutUrl,
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
  const paywallLabel = typeof status?.paywall_enabled === 'boolean'
    ? t(status.paywall_enabled ? TEXT.paywallActive : TEXT.paywallDisabled)
    : null
  const proPlan = Array.isArray(status?.plans)
    ? status.plans.find((plan) => plan?.id === 'pro')
    : null
  const checkoutAvailable = status?.billing_enabled === true && proPlan?.checkout_available !== false
  const currentPlan = planLabel(status?.plan, t)
    ?? (typeof status?.paywall_enabled === 'boolean'
      ? t(status.paywall_enabled ? TEXT.proPlan : TEXT.freePlan)
      : '—')
  const credits = status?.credits ?? '—'

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

        {status && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t(TEXT.currentPlan)}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{currentPlan}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t(TEXT.availableCredits)}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{credits}</p>
            </div>
          </div>
        )}
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

        {status && !checkoutAvailable && !checkoutLink && (
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

        {checkout && !checkoutLink && (
          <p className="mt-3 text-sm text-slate-600">
            {t(TEXT.noCheckoutLink)}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {t(TEXT.error)}
        </p>
      )}
    </section>
  )
}
