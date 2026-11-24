import { useState } from 'react'
import { FiArrowRight, FiCheck, FiFileText, FiShield } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import authIllustration from '@/assets/auth-illustration.svg'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useLogin } from '@/hooks/useLogin.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  hidePassword: { fr: 'Masquer le mot de passe', en: 'Hide password' },
  showPassword: { fr: 'Afficher le mot de passe', en: 'Show password' },
  title: { fr: 'Connexion', en: 'Sign in' },
  subtitle: { fr: 'Retrouvez vos outils et vos documents.', en: 'Find your tools and documents again.' },
  googleSignIn: { fr: 'Continuer avec Google', en: 'Continue with Google' },
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

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.34-.18-1.97H12v3.73h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.28Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.96-3.39.96a5.94 5.94 0 0 1-5.59-4.11H3.07v2.58A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.5H3.07a10 10 0 0 0 0 9l3.34-2.58Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.58A5.94 5.94 0 0 1 12 5.98Z" />
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

// Page de connexion en deux colonnes : présentation de la marque et formulaire.
export default function LoginPage() {
  const { t } = useLocale()
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
    <section className="min-h-[calc(100dvh-4.5rem)] bg-white lg:h-[calc(100dvh-4.5rem)] lg:overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-7xl lg:h-full lg:min-h-0 lg:grid-cols-2">
        <aside
          style={{ backgroundImage: `url(${authIllustration})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="relative overflow-hidden border-b border-line bg-brand-surface bg-no-repeat p-5 sm:p-8 lg:min-h-0 lg:border-b-0 lg:border-r lg:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-surface/75 via-brand-surface/55 to-brand-surface/30" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-soft/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:h-full lg:min-h-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">NanoFile</p>
              <h2 className="mt-2 max-w-md text-xl font-bold tracking-tight text-ink sm:text-2xl lg:text-3xl">
                {t(MESSAGES.home.heroTitle)}
              </h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
                {t(MESSAGES.home.heroTextOne)}
              </p>

              <ul className="mt-4 grid gap-2">
                {[
                  { Icon: FiShield, message: MESSAGES.home.benefitAnalytics },
                  { Icon: FiCheck, message: MESSAGES.home.benefitDownload },
                  { Icon: FiFileText, message: MESSAGES.home.benefitFormats },
                ].map(({ Icon, message }) => (
                  <li key={message.fr} className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-muted sm:text-xs">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-surface/80 text-brand">
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                    <span>{t(message)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/catalogue"
              className="group inline-flex w-fit shrink-0 items-center gap-2 text-xs font-semibold text-brand transition hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t(MESSAGES.home.discoverTools)}
              <FiArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-6 sm:px-8 lg:min-h-0 lg:px-10 lg:py-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 lg:max-h-full lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t(TEXT.title)}</h1>
            <p className="mt-1 text-sm text-slate-600">{t(TEXT.subtitle)}</p>
          </div>
          <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
        </div>

        <div className="mt-3">
          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google/login`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            <GoogleIcon />
            {t(TEXT.googleSignIn)}
          </a>
        </div>

        <div className="my-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          {t(TEXT.orByEmail)}
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
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

          <div className="flex items-center justify-between pt-0.5 text-xs">
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
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {t(loading ? TEXT.signingIn : TEXT.signIn)}
          </button>
        </form>

            {error && (
              <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
                {error.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
