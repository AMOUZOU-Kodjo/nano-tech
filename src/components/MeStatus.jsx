import { useMeContext } from '@/hooks/useMeContext.js'

// Affiche une paire libellé/valeur pour les compteurs documentés du quota.
function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-100">{value ?? '—'}</dd>
    </div>
  )
}

// Composant principal : statut utilisateur et quota, avec états de chargement et d'erreur.
export default function MeStatus() {
  const { user, quota, loading, error, isGuest, reload } = useMeContext()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
        <p className="text-sm text-slate-300">Chargement du statut…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 shadow-lg">
        <p className="font-medium text-red-200">Impossible de charger le statut.</p>
        <p className="mt-1 text-sm text-red-300">{error.message}</p>
        <button
          type="button"
          onClick={reload}
          aria-label="Recharger le statut du compte"
          className="mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-100 hover:bg-red-500/30"
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
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-100">Statut du compte</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isGuest
              ? 'bg-amber-400/10 text-amber-300 ring-amber-400/30'
              : 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30'
          }`}
        >
          {isGuest ? 'Invité' : 'Connecté'}
        </span>
      </header>

      <p className="mt-2 text-sm text-slate-300">
        {isGuest ? 'Vous utilisez NanoFile sans compte.' : displayName}
      </p>

      {hasGuestQuota ? (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Quota utilisé</span>
            <span>
              {used} / {limit}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-label="Quota utilisé"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-sky-400" style={{ width: `${percent}%` }} />
          </div>
          {typeof remaining === 'number' && (
            <p className="mt-2 text-xs text-slate-400">{remaining} restants</p>
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
