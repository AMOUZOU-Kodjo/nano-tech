import { useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { useChangePassword } from '@/hooks/useChangePassword.js'

const TEXT = {
  title: { fr: 'Changer mon mot de passe', en: 'Change my password' },
  hint: {
    fr: 'Choisissez un mot de passe que vous n’utilisez nulle part ailleurs.',
    en: 'Choose a password you do not use anywhere else.',
  },
  currentPassword: { fr: 'Mot de passe actuel', en: 'Current password' },
  newPassword: { fr: 'Nouveau mot de passe', en: 'New password' },
  confirmNewPassword: { fr: 'Confirmer le nouveau mot de passe', en: 'Confirm the new password' },
  sending: { fr: 'Envoi…', en: 'Sending…' },
  action: { fr: 'Changer le mot de passe', en: 'Change password' },
  success: { fr: 'Votre mot de passe a été modifié.', en: 'Your password has been changed.' },
  error: {
    fr: 'Une erreur est survenue. Vérifiez votre mot de passe actuel et réessayez.',
    en: 'Something went wrong. Check your current password and try again.',
  },
}

const CARD_CLASS = 'h-full rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'
const FIELD_CLASS =
  'mt-2 w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40'
const BUTTON_CLASS =
  'rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50'

// Formulaire de changement de mot de passe : envoie uniquement les trois champs validés.
export default function ChangePasswordForm() {
  const { t } = useLocale()
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const { data, loading, error, changePassword } = useChangePassword()

  // Met à jour le champ concerné sans toucher aux deux autres.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  // Soumet le formulaire et vide les champs uniquement si l'API a répondu positivement.
  async function handleSubmit(event) {
    event.preventDefault()
    const result = await changePassword(form)

    if (result !== null) {
      setForm({ current_password: '', password: '', password_confirmation: '' })
    }
  }

  return (
    <section className={CARD_CLASS}>
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.title)}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.hint)}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="block text-sm font-medium text-ink-muted">
          {t(TEXT.currentPassword)}
          <input
            type="password"
            name="current_password"
            autoComplete="current-password"
            value={form.current_password}
            onChange={handleChange}
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className="block text-sm font-medium text-ink-muted">
          {t(TEXT.newPassword)}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className="block text-sm font-medium text-ink-muted">
          {t(TEXT.confirmNewPassword)}
          <input
            type="password"
            name="password_confirmation"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className={FIELD_CLASS}
          />
        </label>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className={BUTTON_CLASS}>
            {t(loading ? TEXT.sending : TEXT.action)}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {t(TEXT.error)}
        </p>
      )}

      {data !== null && !error && !loading && (
        <p role="status" className="mt-5 rounded-xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {t(TEXT.success)}
        </p>
      )}
    </section>
  )
}
