import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useLogin } from '@/hooks/useLogin.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  hidePassword: { fr: 'Masquer le mot de passe', en: 'Hide password' },
  showPassword: { fr: 'Afficher le mot de passe', en: 'Show password' },
  title: { fr: 'Connexion', en: 'Sign in' },
  subtitle: { fr: 'Retrouvez vos outils et vos documents.', en: 'Find your tools and documents again.' },
  googleTerms: {
    fr: 'J’accepte les conditions d’utilisation pour me connecter ou créer un compte avec Google.',
    en: 'I accept the terms of use to sign in or create an account with Google.',
  },
  googleTermsRequired: {
    fr: 'Cochez les conditions d’utilisation pour continuer avec Google.',
    en: 'Accept the terms of use to continue with Google.',
  },
  orByEmail: { fr: 'ou par email', en: 'or by email' },
  email: { fr: 'Email', en: 'Email' },
  password: { fr: 'Mot de passe', en: 'Password' },
  forgotPassword: { fr: 'Mot de passe oublié ?', en: 'Forgot your password?' },
  createAccount: { fr: 'Créer un compte', en: 'Create an account' },
  signingIn: { fr: 'Connexion…', en: 'Signing in…' },
  signIn: { fr: 'Se connecter', en: 'Sign in' },
}

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
  const { t } = useLocale()
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
          aria-label={t(visible ? TEXT.hidePassword : TEXT.showPassword)}
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

// Page de connexion compacte par email et mot de passe, avec accès Google.
export default function LoginPage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const { reload } = useMeContext()
  const [form, setForm] = useState({ email: '', password: '' })
  const [googleTermsAccepted, setGoogleTermsAccepted] = useState(false)
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
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{t(TEXT.title)}</h1>
            <p className="mt-1 text-sm text-slate-600">{t(TEXT.subtitle)}</p>
          </div>
          <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={googleTermsAccepted}
              onChange={(event) => setGoogleTermsAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 bg-white"
            />
            {t(TEXT.googleTerms)}
          </label>
          <div className="flex justify-center">
            {googleTermsAccepted ? (
              <GoogleAuthButton
                termsAccepted={googleTermsAccepted}
                marketingOptIn={false}
                onSuccess={() => {
                  reload()
                  navigate('/')
                }}
              />
            ) : (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
                {t(TEXT.googleTermsRequired)}
              </p>
            )}
          </div>
        </div>

        <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          {t(TEXT.orByEmail)}
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
              {t(TEXT.email)}
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

          <PasswordField
            id="login-password"
            label={t(TEXT.password)}
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link to="/forgot-password" className="font-semibold text-sky-600 hover:text-sky-700">
              {t(TEXT.forgotPassword)}
            </Link>
            <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
              {t(TEXT.createAccount)}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {t(loading ? TEXT.signingIn : TEXT.signIn)}
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
