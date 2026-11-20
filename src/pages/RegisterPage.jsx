import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/useRegister.js'

// Page d'inscription avec cases à cocher explicites et non pré-cochées.
export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    terms_accepted: false,
    marketing_opt_in: false,
  })
  const [localError, setLocalError] = useState(null)
  const { register, data, loading, error } = useRegister()

  function handleSubmit(event) {
    event.preventDefault()
    setLocalError(null)

    if (form.password !== form.password_confirmation) {
      setLocalError('Les mots de passe ne correspondent pas.')
      return
    }
    if (!form.terms_accepted) {
      setLocalError('Vous devez accepter les conditions d’utilisation.')
      return
    }

    register({
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      name: form.name,
      terms_accepted: form.terms_accepted,
      marketing_opt_in: form.marketing_opt_in,
    })
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
        <p className="mt-2 text-sm text-slate-600">Un email de vérification vous sera envoyé.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">
              Nom affiché
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="register-password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="register-confirmation" className="block text-sm font-medium text-slate-700">
              Confirmation du mot de passe
            </label>
            <input
              id="register-confirmation"
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

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.terms_accepted}
              onChange={(event) => setForm({ ...form, terms_accepted: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 bg-white"
            />
            <span>J’accepte les conditions d’utilisation.</span>
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.marketing_opt_in}
              onChange={(event) => setForm({ ...form, marketing_opt_in: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 bg-white"
            />
            <span>Je souhaite recevoir les actualités par email.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        {(localError || error) && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {localError ?? error.message}
          </p>
        )}

        {data && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Compte créé. Vérifiez votre email avant de vous connecter.
          </p>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          Déjà inscrit ? Se connecter
        </Link>
      </div>
    </section>
  )
}
