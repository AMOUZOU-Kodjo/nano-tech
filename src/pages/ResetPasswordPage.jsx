import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import { useResetPassword } from '@/hooks/useResetPassword.js'

const TEXT = {
  missingToken: {
    fr: 'Ce lien ne contient pas de jeton de réinitialisation.',
    en: 'This link does not contain a reset token.',
  },
  passwordMismatch: { fr: 'Les mots de passe ne correspondent pas.', en: 'Passwords do not match.' },
  title: { fr: 'Nouveau mot de passe', en: 'New password' },
  password: { fr: 'Mot de passe', en: 'Password' },
  confirmation: { fr: 'Confirmation du mot de passe', en: 'Password confirmation' },
  saving: { fr: 'Enregistrement…', en: 'Saving…' },
  savePassword: { fr: 'Enregistrer le mot de passe', en: 'Save the password' },
  success: {
    fr: 'Mot de passe modifié. Vous pouvez vous connecter.',
    en: 'Password changed. You can now sign in.',
  },
  backToLogin: { fr: 'Retour à la connexion', en: 'Back to sign in' },
}

// Page de réinitialisation avec le token reçu dans le lien email.
export default function ResetPasswordPage() {
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [localError, setLocalError] = useState(null)
  const { resetPassword, data, loading, error } = useResetPassword()

  function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (!token) {
      setLocalError(t(TEXT.missingToken))
      return
    }
    if (form.password !== form.password_confirmation) {
      setLocalError(t(TEXT.passwordMismatch))
      return
    }

    resetPassword({
      token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">{t(TEXT.title)}</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-slate-700">
              {t(TEXT.password)}
            </label>
            <input
              id="reset-password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="reset-confirmation" className="block text-sm font-medium text-slate-700">
              {t(TEXT.confirmation)}
            </label>
            <input
              id="reset-confirmation"
              type="password"
              required
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={(event) =>
                setForm({ ...form, password_confirmation: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {t(loading ? TEXT.saving : TEXT.savePassword)}
          </button>
        </form>

        {(localError || error) && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {localError ?? error.message}
          </p>
        )}

        {data && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            {t(TEXT.success)}
          </p>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          {t(TEXT.backToLogin)}
        </Link>
      </div>
    </section>
  )
}
