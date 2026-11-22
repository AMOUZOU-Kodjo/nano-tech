import { useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { useChangePassword } from '@/hooks/useChangePassword.js'

const TEXT = {
  title: { fr: 'Modifier le mot de passe', en: 'Change password' },
  currentPassword: { fr: 'Mot de passe actuel', en: 'Current password' },
  newPassword: { fr: 'Nouveau mot de passe', en: 'New password' },
  confirmNewPassword: { fr: 'Confirmer le nouveau mot de passe', en: 'Confirm the new password' },
  sending: { fr: 'Envoi…', en: 'Sending…' },
  success: { fr: 'Mot de passe modifié.', en: 'Password changed.' },
}

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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t(TEXT.title)}</h2>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-700">
          {t(TEXT.currentPassword)}
          <input
            type="password"
            name="current_password"
            autoComplete="current-password"
            value={form.current_password}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          {t(TEXT.newPassword)}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          {t(TEXT.confirmNewPassword)}
          <input
            type="password"
            name="password_confirmation"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
        >
          {t(loading ? TEXT.sending : TEXT.title)}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error.message}
        </p>
      )}

      {data !== null && !error && !loading && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
          {t(TEXT.success)}
        </p>
      )}
    </section>
  )
}
