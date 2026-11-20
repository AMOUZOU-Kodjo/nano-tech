import { useHealth } from '@/hooks/useHealth.js'

// Composant de santé : affiche la disponibilité de l'API, ses capacités et permet de relancer le contrôle.
export default function HealthStatus() {
  const { ok, capabilities, loading, error, reload } = useHealth()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
        <p className="text-sm text-slate-300">Vérification de l’API…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 shadow-lg">
        <p className="font-medium text-red-200">API indisponible.</p>
        <p className="mt-1 text-sm text-red-300">{error.message}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-100 hover:bg-red-500/30"
        >
          Réessayer
        </button>
      </section>
    )
  }

  const degraded = ok === false

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${degraded ? 'bg-amber-400' : 'bg-emerald-400'}`}
            aria-hidden="true"
          />
          <div>
            <h2 className="font-semibold text-slate-100">
              {degraded ? 'API dégradée' : 'API disponible'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {degraded ? 'Le service répond mais signale un problème.' : 'Le service répond correctement.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reload}
          className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          Actualiser
        </button>
      </div>

      {capabilities && (
        <dl className="mt-5 grid gap-2 sm:grid-cols-3">
          {Object.entries(capabilities).map(([name, enabled]) => (
            <div key={name} className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{name}</dt>
              <dd className={`mt-1 text-sm font-medium ${enabled ? 'text-emerald-300' : 'text-red-300'}`}>
                {enabled ? 'oui' : 'non'}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
