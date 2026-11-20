import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { useRegister } from '@/hooks/useRegister.js'

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_URL ?? 'https://api.nanofile.tech/api'}/auth/google/login`

// Page d'inscription compacte, avec cases à cocher explicites et non pré-cochées.
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

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

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
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-6">
      <style>{'main > footer { display: none; }'}</style>

      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Créer un compte</h1>
            <p className="mt-1 text-sm text-slate-600">Un email de vérification vous sera envoyé.</p>
          </div>
          <img
            src={logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 object-contain"
          />
        </div>

        <a
          href={GOOGLE_LOGIN_URL}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-sky-600">G</span>
          Continuer avec Google
        </a>

        <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          ou par email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700">
                Nom affiché
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700">
                Mot de passe
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              />
            </div>

            <div>
              <label htmlFor="register-confirmation" className="block text-xs font-semibold text-slate-700">
                Confirmation
              </label>
              <input
                id="register-confirmation"
                name="password_confirmation"
                type="password"
                required
                autoComplete="new-password"
                value={form.password_confirmation}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={form.terms_accepted}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 bg-white"
              />
              J’accepte les conditions d’utilisation.
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="marketing_opt_in"
                checked={form.marketing_opt_in}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 bg-white"
              />
              Recevoir les actualités par email.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        {(localError || error) && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
            {localError ?? error.message}
          </p>
        )}

        {data && (
          <p role="status" className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700">
            Compte créé. Vérifiez votre email avant de vous connecter.
          </p>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  )
}
