import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { useLogin } from '@/hooks/useLogin.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_URL ?? 'https://api.nanofile.tech/api'}/auth/google/login`

// Page de connexion compacte par email et mot de passe, avec accès Google.
export default function LoginPage() {
  const navigate = useNavigate()
  const { reload } = useMeContext()
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading, error } = useLogin({
    onSuccess: () => {
      reload()
      navigate('/')
    },
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    login(form)
  }

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-6">
      <style>{'main > footer { display: none; }'}</style>

      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Connexion</h1>
            <p className="mt-1 text-sm text-slate-600">Retrouvez vos outils et vos documents.</p>
          </div>
          <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
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
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
              Mot de passe
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link to="/forgot-password" className="font-semibold text-sky-600 hover:text-sky-700">
              Mot de passe oublié ?
            </Link>
            <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
              Créer un compte
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
            {error.message}
          </p>
        )}
      </div>
    </section>
  )
}
