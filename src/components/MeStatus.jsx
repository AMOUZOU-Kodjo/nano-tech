import { useMeContext } from '@/hooks/useMeContext.js'

// Affiche une paire libellé/valeur pour les compteurs documentés du quota.
function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

// Composant principal : statut utilisateur et quota, avec états de chargement et d'erreur.
export default function MeStatus() {
  const { user, quota, loading, error, isGuest, reload } = useMeContext()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Chargement du statut…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="font-medium text-red-700">Impossible de charger le statut.</p>
        <p className="mt-1 text-sm text-red-700">{error.message}</p>
        <button
          type="button"
          onClick={reload}
          aria-label="Recharger le statut du compte"
          className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Réessayer
        </button>
      </section>
    )
  }

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Compte connecté'
  const limit = quota?.limit
  const used = quota?.used
  const remaining = quota?.remaining
  const hasGuestQuota = isGuest && typeof limit === 'number' && typeof used === 'number'
  const percent = hasGuestQuota && limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Statut du compte</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isGuest
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          }`}
        >
          {isGuest ? 'Invité' : 'Connecté'}
        </span>
      </header>

      <p className="mt-2 text-sm text-slate-600">
        {isGuest ? 'Vous utilisez NanoFile sans compte.' : displayName}
      </p>

      {hasGuestQuota ? (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Quota utilisé</span>
            <span>
              {used} / {limit}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label="Quota utilisé"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
          </div>
          {typeof remaining === 'number' && (
            <p className="mt-2 text-xs text-slate-500">{remaining} restants</p>
          )}
        </div>
      ) : (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <Stat label="Formule" value={quota?.plan} />
          <Stat label="Crédits" value={quota?.credits} />
          <Stat label="Essais gratuits" value={quota?.free_uses_left} />
          <Stat label="Jobs du jour" value={quota?.daily_jobs_left} />
          <Stat label="Rendus du jour" value={quota?.daily_renders_left} />
          <Stat label="IA du jour" value={quota?.ai_uses_left_today} />
        </dl>
      )}
    </section>
  )
}
