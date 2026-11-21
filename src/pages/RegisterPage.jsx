import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx'
import { useRegister } from '@/hooks/useRegister.js'

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6 0 9.5 6 9.5 6a16.6 16.6 0 0 1-2.4 3.1" />
      <path d="M6.2 7.5C3.9 9 2.5 12 2.5 12s3.5 6 9.5 6a9.9 9.9 0 0 0 3-.45" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

function PasswordField({ id, label, name, autoComplete, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-11 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-500"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}

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
  const navigate = useNavigate()
  const { register, data, loading, error } = useRegister()

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
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

    const payload = await register({
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
      name: form.name.trim() || undefined,
      terms_accepted: form.terms_accepted,
      marketing_opt_in: form.marketing_opt_in,
    })

    if (payload) {
      setForm((current) => ({ ...current, password: '', password_confirmation: '' }))
    }
  }

  if (data) {
    return (
      <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Compte créé</h1>
            </div>
            <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
          </div>

          <div role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Votre inscription est enregistrée.</p>
            <p className="mt-2">
              Un email de vérification a été envoyé à <strong>{form.email.trim()}</strong>. Ouvrez ce lien puis
              connectez-vous pour activer votre espace.
            </p>
            <p className="mt-2 text-xs text-emerald-700">
              Pensez à vérifier vos courriers indésirables si le message n’apparaît pas.
            </p>
          </div>

          <Link
            to="/login"
            className="mt-5 inline-block rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Aller à la connexion
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-6">
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

        <div className="mt-5 flex justify-center">
          {form.terms_accepted ? (
            <GoogleAuthButton
              termsAccepted={form.terms_accepted}
              marketingOptIn={form.marketing_opt_in}
              onSuccess={() => navigate('/dashboard')}
            />
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
              Cochez les conditions d’utilisation pour continuer avec Google.
            </p>
          )}
        </div>

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
            <PasswordField
              id="register-password"
              label="Mot de passe"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />

            <PasswordField
              id="register-confirmation"
              label="Confirmation"
              name="password_confirmation"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={handleChange}
            />
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
