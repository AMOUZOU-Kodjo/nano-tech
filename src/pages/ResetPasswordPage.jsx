import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPassword } from '@/hooks/useResetPassword.js'

// Page de réinitialisation avec le token reçu dans le lien email.
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [localError, setLocalError] = useState(null)
  const { resetPassword, data, loading, error } = useResetPassword()

  function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (!token) {
      setLocalError('Ce lien ne contient pas de jeton de réinitialisation.')
      return
    }
    if (form.password !== form.password_confirmation) {
      setLocalError('Les mots de passe ne correspondent pas.')
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
        <h1 className="text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-slate-700">
              Mot de passe
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
              Confirmation du mot de passe
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
            {loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
          </button>
        </form>

        {(localError || error) && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {localError ?? error.message}
          </p>
        )}

        {data && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Mot de passe modifié. Vous pouvez vous connecter.
          </p>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          Retour à la connexion
        </Link>
      </div>
    </section>
  )
}
