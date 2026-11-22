import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  loading: { fr: 'Chargement du statut…', en: 'Loading status…' },
  loadError: { fr: 'Impossible de charger le statut.', en: 'Unable to load status.' },
  reload: { fr: 'Recharger le statut du compte', en: 'Reload account status' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  signedInAccount: { fr: 'Compte connecté', en: 'Signed-in account' },
  accountStatus: { fr: 'Statut du compte', en: 'Account status' },
  guest: { fr: 'Invité', en: 'Guest' },
  signedIn: { fr: 'Connecté', en: 'Signed in' },
  guestMessage: { fr: 'Vous utilisez NanoFile sans compte.', en: 'You are using NanoFile without an account.' },
  quotaUsed: { fr: 'Quota utilisé', en: 'Quota used' },
  plan: { fr: 'Formule', en: 'Plan' },
  credits: { fr: 'Crédits', en: 'Credits' },
  freeTrials: { fr: 'Essais gratuits', en: 'Free trials' },
  dailyJobs: { fr: 'Jobs du jour', en: "Today's jobs" },
  dailyRenders: { fr: 'Rendus du jour', en: "Today's renders" },
  dailyAi: { fr: 'IA du jour', en: "Today's AI uses" },
}

// Affiche une paire libellé/valeur pour les compteurs documentés du quota.
function Stat({ label, value }) {
  const { t } = useLocale()

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{t(label)}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

// Composant principal : statut utilisateur et quota, avec états de chargement et d'erreur.
export default function MeStatus() {
  const { locale, t } = useLocale()
  const { user, quota, loading, error, isGuest, reload } = useMeContext()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t(TEXT.loading)}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="font-medium text-red-700">{t(TEXT.loadError)}</p>
        <p className="mt-1 text-sm text-red-700">{error.message}</p>
        <button
          type="button"
          onClick={reload}
          aria-label={t(TEXT.reload)}
          className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t(TEXT.retry)}
        </button>
      </section>
    )
  }

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    t(TEXT.signedInAccount)
  const limit = quota?.limit
  const used = quota?.used
  const remaining = quota?.remaining
  const hasGuestQuota = isGuest && typeof limit === 'number' && typeof used === 'number'
  const percent = hasGuestQuota && limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">{t(TEXT.accountStatus)}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isGuest
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          }`}
        >
          {t(isGuest ? TEXT.guest : TEXT.signedIn)}
        </span>
      </header>

      <p className="mt-2 text-sm text-slate-600">
        {isGuest ? t(TEXT.guestMessage) : displayName}
      </p>

      {hasGuestQuota ? (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{t(TEXT.quotaUsed)}</span>
            <span>
              {used} / {limit}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label={t(TEXT.quotaUsed)}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
          </div>
          {typeof remaining === 'number' && (
            <p className="mt-2 text-xs text-slate-500">
              {remaining} {locale === 'fr' ? 'restants' : 'remaining'}
            </p>
          )}
        </div>
      ) : (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <Stat label={TEXT.plan} value={quota?.plan} />
          <Stat label={TEXT.credits} value={quota?.credits} />
          <Stat label={TEXT.freeTrials} value={quota?.free_uses_left} />
          <Stat label={TEXT.dailyJobs} value={quota?.daily_jobs_left} />
          <Stat label={TEXT.dailyRenders} value={quota?.daily_renders_left} />
          <Stat label={TEXT.dailyAi} value={quota?.ai_uses_left_today} />
        </dl>
      )}
    </section>
  )
}
