import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  loading: { fr: 'Préparation de votre espace…', en: 'Preparing your space…' },
  loadError: { fr: 'Impossible d’afficher votre compte.', en: 'Unable to display your account.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  accountTitle: { fr: 'Votre compte', en: 'Your account' },
  guestPill: { fr: 'Sans compte', en: 'No account' },
  signedInPill: { fr: 'Connecté', en: 'Signed in' },
  guestMessage: {
    fr: 'Vous utilisez NanoFile sans créer de compte.',
    en: 'You are using NanoFile without an account.',
  },
  planTitle: { fr: 'Votre formule', en: 'Your plan' },
  freePlan: { fr: 'Gratuite', en: 'Free' },
  proPlan: { fr: 'Pro', en: 'Pro' },
  unknownPlan: { fr: 'Non définie', en: 'Not set' },
  creditsTitle: { fr: 'Crédits disponibles', en: 'Available credits' },
  dailyTitle: { fr: 'Vos possibilités aujourd’hui', en: 'What you can do today' },
  trialsLabel: { fr: 'Essais gratuits', en: 'Free trials' },
  processingLabel: { fr: 'Traitements de fichiers', en: 'File processing' },
  documentsLabel: { fr: 'Documents générés', en: 'Generated documents' },
  assistantLabel: { fr: 'Améliorations IA', en: 'AI improvements' },
  quotaUsed: { fr: 'Utilisation du jour', en: 'Today’s usage' },
  trialsRemaining: { fr: 'Essais gratuits restants', en: 'Free trials remaining' },
  remaining: { fr: 'restants', en: 'remaining' },
}

const CARD_CLASS = 'h-full rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'
const BUTTON_CLASS =
  'rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand'

function planLabel(plan, t) {
  if (plan === 'free') {
    return t(TEXT.freePlan)
  }
  if (plan === 'pro') {
    return t(TEXT.proPlan)
  }
  if (plan === null || plan === undefined || plan === '') {
    return t(TEXT.unknownPlan)
  }
  return String(plan)
}

function Stat({ label, value }) {
  const { t } = useLocale()

  return (
    <div className="rounded-2xl bg-surface px-4 py-4 ring-1 ring-line/50">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t(label)}</dt>
      <dd className="mt-2 text-lg font-semibold text-ink">{value ?? '—'}</dd>
    </div>
  )
}

// Composant principal : statut du compte et possibilités restantes, avec états de chargement et d'erreur.
export default function MeStatus() {
  const { t } = useLocale()
  const { user, quota, loading, error, isGuest, reload } = useMeContext()

  if (loading) {
    return (
      <section className={CARD_CLASS} role="status">
        <p className="text-sm text-ink-muted">{t(TEXT.loading)}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={CARD_CLASS} role="alert">
        <h2 className="text-xl font-semibold text-ink">{t(TEXT.loadError)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.retry)}</p>
        <button type="button" onClick={reload} className={`${BUTTON_CLASS} mt-6`}>
          {t(TEXT.retry)}
        </button>
      </section>
    )
  }

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    t(TEXT.accountTitle)
  const limit = quota?.limit
  const used = quota?.used
  const remaining = quota?.remaining
  const freeTrialsLeft =
    isGuest && typeof quota?.free_uses_left === 'number' ? quota.free_uses_left : null
  const hasGuestQuota =
    freeTrialsLeft === null && isGuest && typeof limit === 'number' && typeof used === 'number'
  const percent =
    freeTrialsLeft !== null && typeof limit === 'number' && limit > 0
      ? Math.min(100, Math.round((freeTrialsLeft / limit) * 100))
      : hasGuestQuota && limit > 0
        ? Math.min(100, Math.round((used / limit) * 100))
        : 0

  return (
    <section className={CARD_CLASS}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">{t(TEXT.accountTitle)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {isGuest ? t(TEXT.guestMessage) : displayName}
          </p>
        </div>
        <span
          className={`self-start rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isGuest
              ? 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900'
          }`}
        >
          {t(isGuest ? TEXT.guestPill : TEXT.signedInPill)}
        </span>
      </header>

      {freeTrialsLeft !== null || hasGuestQuota ? (
        <div className="mt-7 border-t border-line/60 pt-6">
          <div className="flex items-center justify-between gap-4 text-sm text-ink-muted">
            <span>{t(freeTrialsLeft !== null ? TEXT.trialsRemaining : TEXT.quotaUsed)}</span>
            <span className="font-semibold text-ink">
              {freeTrialsLeft !== null
                ? `${freeTrialsLeft}${typeof limit === 'number' ? ` / ${limit}` : ''}`
                : `${used} / ${limit}`}
            </span>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-strong"
            role="progressbar"
            aria-label={t(freeTrialsLeft !== null ? TEXT.trialsRemaining : TEXT.quotaUsed)}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
          </div>
          {freeTrialsLeft === null && typeof remaining === 'number' && (
            <p className="mt-3 text-xs text-ink-faint">
              {remaining} {t(TEXT.remaining)}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-7 space-y-6 border-t border-line/60 pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface px-4 py-4 ring-1 ring-line/50">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t(TEXT.planTitle)}</p>
              <p className="mt-2 text-xl font-semibold text-ink">{planLabel(quota?.plan, t)}</p>
            </div>
            <div className="rounded-2xl bg-brand/10 px-4 py-4 ring-1 ring-brand/20">
              <p className="text-xs font-medium uppercase tracking-wide text-brand">{t(TEXT.creditsTitle)}</p>
              <p className="mt-2 text-2xl font-bold text-brand">{quota?.credits ?? '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">{t(TEXT.dailyTitle)}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label={TEXT.trialsLabel} value={quota?.free_uses_left} />
              <Stat label={TEXT.processingLabel} value={quota?.daily_jobs_left} />
              <Stat label={TEXT.documentsLabel} value={quota?.daily_renders_left} />
              <Stat label={TEXT.assistantLabel} value={quota?.ai_uses_left_today} />
            </dl>
          </div>
        </div>
      )}
    </section>
  )
}
