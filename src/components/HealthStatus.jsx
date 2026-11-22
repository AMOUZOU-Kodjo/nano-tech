import { useLocale } from '@/hooks/useLocale.js'
import { useHealth } from '@/hooks/useHealth.js'

const TEXT = {
  checking: { fr: 'Vérification de l’API…', en: 'Checking the API…' },
  unavailable: { fr: 'API indisponible.', en: 'API unavailable.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  degraded: { fr: 'API dégradée', en: 'API degraded' },
  available: { fr: 'API disponible', en: 'API available' },
  degradedMessage: {
    fr: 'Le service répond mais signale un problème.',
    en: 'The service responds but reports a problem.',
  },
  availableMessage: { fr: 'Le service répond correctement.', en: 'The service responds correctly.' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  yes: { fr: 'oui', en: 'yes' },
  no: { fr: 'non', en: 'no' },
}

// Composant de santé : affiche la disponibilité de l'API, ses capacités et permet de relancer le contrôle.
export default function HealthStatus() {
  const { t } = useLocale()
  const { ok, capabilities, loading, error, reload } = useHealth()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t(TEXT.checking)}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="font-medium text-red-700">{t(TEXT.unavailable)}</p>
        <p className="mt-1 text-sm text-red-700">{error.message}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t(TEXT.retry)}
        </button>
      </section>
    )
  }

  const degraded = ok === false

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${degraded ? 'bg-amber-500' : 'bg-emerald-500'}`}
            aria-hidden="true"
          />
          <div>
            <h2 className="font-semibold text-slate-900">
              {t(degraded ? TEXT.degraded : TEXT.available)}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t(degraded ? TEXT.degradedMessage : TEXT.availableMessage)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reload}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t(TEXT.refresh)}
        </button>
      </div>

      {capabilities && (
        <dl className="mt-5 grid gap-2 sm:grid-cols-3">
          {Object.entries(capabilities).map(([name, enabled]) => (
            <div key={name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{name}</dt>
              <dd className={`mt-1 text-sm font-medium ${enabled ? 'text-emerald-700' : 'text-red-700'}`}>
                {t(enabled ? TEXT.yes : TEXT.no)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
