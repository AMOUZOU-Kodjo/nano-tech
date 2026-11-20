import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPassword } from '@/hooks/useForgotPassword.js'

// Page de demande de lien de réinitialisation du mot de passe.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const { forgotPassword, loading, error, sent } = useForgotPassword()

  function handleSubmit(event) {
    event.preventDefault()
    forgotPassword(email)
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-slate-600">Un lien de réinitialisation vous sera envoyé.</p>

        {sent ? (
          <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Si ce compte existe, un email a été envoyé.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error.message}
          </p>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          Retour à la connexion
        </Link>
      </div>
    </section>
  )
}
