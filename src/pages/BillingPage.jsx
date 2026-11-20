import { useEffect } from 'react'
import { useBilling } from '@/hooks/useBilling.js'

// Affiche une réponse API non typée sous forme JSON, sans invention de champs.
function JsonBlock({ value }) {
  return <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// N'autorise qu'une URL http(s) avant d'afficher un lien de paiement externe.
function safeCheckoutUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value) ? value : ''
}

// Page facturation : état du paywall et lancement du checkout documenté.
export default function BillingPage() {
  const billing = useBilling()
  const {
    status,
    checkoutUrl,
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

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Facturation</h1>
      <p className="mt-2 text-sm text-slate-600">État des crédits, du paywall et session de paiement.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">État de facturation</h2>
          <button
            type="button"
            onClick={fetchBillingStatus}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
          >
            {loading ? 'Chargement…' : 'Actualiser'}
          </button>
        </div>
        {status && <JsonBlock value={status} />}
        {!status && !loading && <p className="mt-4 text-sm text-slate-600">Aucun état disponible.</p>}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Démarrer un paiement</h2>
        <p className="mt-2 text-sm text-slate-600">La session est créée par l’API, sans choix de plan inventé.</p>
        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          Créer une session
        </button>
        {checkoutLink && (
          <a
            href={checkoutLink}
            className="mt-4 inline-block text-sm text-sky-600 hover:text-sky-700"
          >
            Ouvrir la session de paiement
          </a>
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
