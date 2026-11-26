import { useLocale } from '@/hooks/useLocale.js'
import { useLogout } from '@/hooks/useLogout.js'

const TEXT = {
  title: { fr: 'Terminer la session', en: 'End the session' },
  hint: { fr: 'Vous pourrez vous reconnecter à tout moment.', en: 'You can sign back in at any time.' },
  loading: { fr: 'Déconnexion…', en: 'Signing out…' },
  action: { fr: 'Se déconnecter', en: 'Sign out' },
  error: {
    fr: 'Une erreur est survenue. Réessayez dans quelques instants.',
    en: 'Something went wrong. Please try again shortly.',
  },
}

const CARD_CLASS = 'h-full rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'
const BUTTON_CLASS =
  'rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand disabled:opacity-50'

// Bouton de déconnexion : délègue le rafraîchissement du profil à la prop onSuccess.
export default function LogoutButton({ onSuccess }) {
  const { t } = useLocale()
  const { loading, error, logout } = useLogout({ onSuccess })

  return (
    <section className={CARD_CLASS}>
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.title)}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.hint)}</p>

      <button type="button" onClick={logout} disabled={loading} className={`${BUTTON_CLASS} mt-6`}>
        {t(loading ? TEXT.loading : TEXT.action)}
      </button>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {t(TEXT.error)}
        </p>
      )}
    </section>
  )
}
