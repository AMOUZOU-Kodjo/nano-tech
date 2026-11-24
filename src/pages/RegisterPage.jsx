import { useState } from 'react'
import { FiArrowRight, FiCheck, FiClock, FiShield } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import authIllustration from '@/assets/auth-illustration.svg'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useRegister } from '@/hooks/useRegister.js'

const TEXT = {
  hidePassword: { fr: 'Masquer le mot de passe', en: 'Hide password' },
  showPassword: { fr: 'Afficher le mot de passe', en: 'Show password' },
  passwordMismatch: { fr: 'Les mots de passe ne correspondent pas.', en: 'Passwords do not match.' },
  termsRequired: {
    fr: 'Vous devez accepter les conditions d’utilisation.',
    en: 'You must accept the terms of use.',
  },
  accountCreated: { fr: 'Compte créé', en: 'Account created' },
  registrationSaved: { fr: 'Votre inscription est enregistrée.', en: 'Your registration has been saved.' },
  verificationIntro: {
    fr: 'Un email de vérification a été envoyé à',
    en: 'A verification email was sent to',
  },
  verificationOutro: {
    fr: '. Ouvrez ce lien puis connectez-vous pour activer votre espace.',
    en: '. Open the link, then sign in to activate your space.',
  },
  checkSpam: {
    fr: 'Pensez à vérifier vos courriers indésirables si le message n’apparaît pas.',
    en: 'Check your spam folder if the message does not appear.',
  },
  goToLogin: { fr: 'Aller à la connexion', en: 'Go to sign in' },
  title: { fr: 'Créer un compte', en: 'Create an account' },
  subtitle: { fr: 'Un email de vérification vous sera envoyé.', en: 'A verification email will be sent to you.' },
  panelTitle: { fr: 'Créez votre espace NanoFile.', en: 'Create your NanoFile space.' },
  panelText: {
    fr: 'Compressez, convertissez, organisez et sécurisez vos fichiers depuis un espace unique.',
    en: 'Compress, convert, organize and secure your files from one place.',
  },
  googleTermsRequired: {
    fr: 'Cochez les conditions d’utilisation pour continuer avec Google.',
    en: 'Accept the terms of use to continue with Google.',
  },
  orByEmail: { fr: 'ou par email', en: 'or by email' },
  displayName: { fr: 'Nom affiché', en: 'Display name' },
  email: { fr: 'Email', en: 'Email' },
  password: { fr: 'Mot de passe', en: 'Password' },
  confirmation: { fr: 'Confirmation', en: 'Confirmation' },
  acceptTerms: { fr: 'J’accepte les conditions d’utilisation.', en: 'I accept the terms of use.' },
  receiveNews: { fr: 'Recevoir les actualités par email.', en: 'Receive news by email.' },
  creating: { fr: 'Création…', en: 'Creating…' },
  createAccount: { fr: 'Créer le compte', en: 'Create the account' },
  createdCheckEmail: {
    fr: 'Compte créé. Vérifiez votre email avant de vous connecter.',
    en: 'Account created. Verify your email before signing in.',
  },
  alreadyRegistered: { fr: 'Déjà inscrit ?', en: 'Already registered?' },
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

// Page d'inscription en deux colonnes, avec cases à cocher explicites et non pré-cochées.
export default function RegisterPage() {
  const { t } = useLocale()
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
      setLocalError(t(TEXT.passwordMismatch))
      return
    }
    if (!form.terms_accepted) {
      setLocalError(t(TEXT.termsRequired))
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
      <section className="flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-6 lg:h-[calc(100dvh-4.5rem)] lg:overflow-hidden lg:py-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 lg:max-h-full lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">NanoFile</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t(TEXT.accountCreated)}</h1>
            </div>
            <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
          </div>

          <div role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-semibold">{t(TEXT.registrationSaved)}</p>
            <p className="mt-2">
              {t(TEXT.verificationIntro)} <strong className="break-all">{form.email.trim()}</strong>{t(TEXT.verificationOutro)}
            </p>
            <p className="mt-2 text-xs text-emerald-700">
              {t(TEXT.checkSpam)}
            </p>
          </div>

          <Link
            to="/login"
            className="mt-4 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            {t(TEXT.goToLogin)}
          </Link>
        </div>
      </section>
    )
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
                {t(TEXT.panelTitle)}
              </h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
                {t(TEXT.panelText)}
              </p>

              <ul className="mt-4 grid gap-2">
                {[
                  { Icon: FiShield, message: MESSAGES.home.benefitAnalytics },
                  { Icon: FiCheck, message: MESSAGES.home.benefitDownload },
                  { Icon: FiClock, message: MESSAGES.home.trackActivityText },
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
          <img
            src={logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 object-contain"
          />
        </div>

        <div className="mt-3 flex justify-center">
          {form.terms_accepted ? (
            <GoogleAuthButton
              termsAccepted={form.terms_accepted}
              marketingOptIn={form.marketing_opt_in}
              onSuccess={() => navigate('/dashboard')}
            />
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
              {t(TEXT.googleTermsRequired)}
            </p>
          )}
        </div>

        <div className="my-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          {t(TEXT.orByEmail)}
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700">
                {t(TEXT.displayName)}
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
                {t(TEXT.email)}
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

          <div className="grid gap-2.5 sm:grid-cols-2">
            <PasswordField
              id="register-password"
              label={t(TEXT.password)}
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />

            <PasswordField
              id="register-confirmation"
              label={t(TEXT.confirmation)}
              name="password_confirmation"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-0.5 text-xs text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={form.terms_accepted}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 bg-white"
              />
              {t(TEXT.acceptTerms)}
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="marketing_opt_in"
                checked={form.marketing_opt_in}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 bg-white"
              />
              {t(TEXT.receiveNews)}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {t(loading ? TEXT.creating : TEXT.createAccount)}
          </button>
        </form>

        {(localError || error) && (
          <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
            {localError ?? error.message}
          </p>
        )}

        {data && (
          <p role="status" className="mt-2 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">
            {t(TEXT.createdCheckEmail)}
          </p>
        )}

            <p className="mt-3 text-center text-xs text-slate-500">
              {t(TEXT.alreadyRegistered)}{' '}
              <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
                {t(TEXT.signIn)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
