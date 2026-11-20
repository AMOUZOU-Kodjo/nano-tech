import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '@/hooks/useLogin.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Page de connexion par email et mot de passe.
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

  function handleSubmit(event) {
    event.preventDefault()
    login(form)
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
        <p className="mt-2 text-sm text-slate-600">Retrouvez vos outils et vos documents.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error.message}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="text-sky-600 hover:text-sky-700">
            Mot de passe oublié ?
          </Link>
          <Link to="/register" className="text-sky-600 hover:text-sky-700">
            Créer un compte
          </Link>
        </div>
      </div>
    </section>
  )
}
