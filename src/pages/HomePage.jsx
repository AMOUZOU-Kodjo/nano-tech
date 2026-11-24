import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiCheck, FiShield, FiX } from 'react-icons/fi'
import heroIllustration from '@/assets/auth-illustration.svg'
import { Link, useSearchParams } from 'react-router-dom'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  tryCompress: { fr: 'Essayer la compression', en: 'Try compression' },
  seeHow: { fr: 'Voir comment ça marche', en: 'See how it works' },
  googleFailed: {
    fr: 'La connexion avec Google a échoué. Veuillez réessayer.',
    en: 'Google sign-in failed. Please try again.',
  },
  retrySignIn: { fr: 'Aller à la connexion', en: 'Go to sign in' },
  dismiss: { fr: 'Fermer le message', en: 'Dismiss message' },
}

function Reveal({ as: Element = 'div', children, className = '', delay = 0, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (visible || !ref.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <Element
      ref={ref}
      {...props}
      className={`${className} transition-[opacity,transform] duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Element>
  )
}

function DocumentBadge({ label, color, tint }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path d="M6 2h8l4 4v16H6z" fill={tint} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 2v4h4" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  )
}

// Vue d'accueil : présentation concise et accès directs aux espaces principaux.
export default function HomePage() {
  const { t } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const googleFailed = searchParams.get('auth_error') === 'google_failed'

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      {googleFailed && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{t(TEXT.googleFailed)}</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-900">
              {t(TEXT.retrySignIn)}
            </Link>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              aria-label={t(TEXT.dismiss)}
              className="grid h-7 w-7 place-items-center rounded-lg text-red-500 transition hover:bg-red-100 hover:text-red-800"
            >
              <FiX aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="relative overflow-hidden py-2 sm:py-4 lg:py-6">
        <img
          src={heroIllustration}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/2 select-none object-contain object-left opacity-[0.26] dark:opacity-[0.26]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface/25 via-surface/50 to-surface" />

        <div className="relative flex flex-wrap items-center justify-center gap-2">
          <DocumentBadge label="PDF" color="#ef4444" tint="#fee2e2" />
          <DocumentBadge label="XLS" color="#16a34a" tint="#dcfce7" />
          <DocumentBadge label="TXT" color="#0284c7" tint="#e0f2fe" />
          <DocumentBadge label="DOC" color="#2563eb" tint="#dbeafe" />
          <DocumentBadge label="JPG" color="#8b5cf6" tint="#ede9fe" />
          <DocumentBadge label="PNG" color="#0ea5e9" tint="#cffafe" />
          <DocumentBadge label="CSV" color="#059669" tint="#d1fae5" />
          <DocumentBadge label="PPT" color="#ea580c" tint="#ffedd5" />
          <DocumentBadge label="ZIP" color="#64748b" tint="#e2e8f0" />
        </div>

        <div className="relative mt-6 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h1 className="text-2xl text-left font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
              {t(MESSAGES.home.heroTitle)}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {t(MESSAGES.home.heroTextOne)} {t(MESSAGES.home.heroTextTwo)}
            </p>

            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-brand/20 bg-brand-surface px-3 py-2 text-xs font-semibold text-brand">
              <FiShield aria-hidden="true" className="h-4 w-4 shrink-0" />
              {t(MESSAGES.home.benefitAnalytics)}
            </div>

            <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
              {[
                MESSAGES.home.benefitDownload,
                MESSAGES.home.benefitFormats,
              ].map((message) => (
                <li key={message.fr} className="flex gap-3">
                  <FiCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{t(message)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalogue"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-brand-soft dark:text-canvas"
              >
                {t(MESSAGES.home.discoverTools)}
                <FiArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/tools/compress"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {t(TEXT.tryCompress)}
              </Link>
            </div>

            <a
              href="#comment-ca-marche"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t(TEXT.seeHow)}
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Reveal>

          <Reveal className="relative mx-auto w-full max-w-md rounded-xl border border-slate-100 bg-white p-5 shadow-sm" delay={90}>
            <div className="flex flex-col gap-4 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.processingZone)}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{t(MESSAGES.home.compress)}</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{t(MESSAGES.home.compressFormats)}</p>
              </div>
              <Link
                to="/tools/compress"
                className="self-center rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t(MESSAGES.home.openTool)}
              </Link>
            </div>

            <Link
              to="/tools/compress"
              className="mt-5 flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-brand-surface/60 p-5 text-center transition hover:border-sky-400 hover:bg-brand-surface sm:mt-6 sm:min-h-48 sm:p-8"
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">{t(MESSAGES.home.dropFiles)}</span>
              <span className="mt-2 text-xs text-slate-500 sm:text-sm">{t(MESSAGES.home.or)}</span>
              <span className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white">
                {t(MESSAGES.home.chooseFiles)}
              </span>
              <span className="mt-4 text-[11px] leading-relaxed text-slate-500 sm:mt-5 sm:text-xs">
                {t(MESSAGES.home.acceptedFormats)}
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <Link
          to="/catalogue"
          className="h-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.common.catalogue)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.chooseTool)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.chooseToolText)}</p>
        </Link>

        <Link
          to="/studio"
          className="h-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.common.studio)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.generateCv)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.studioText)}</p>
        </Link>

        <Link
          to="/dashboard"
          className="h-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.userSpace)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.trackActivity)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.trackActivityText)}</p>
        </Link>
      </div>

      <Reveal id="comment-ca-marche" className="mt-12 scroll-mt-24 rounded-3xl p-6 text-center sm:mt-16 sm:p-10 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.howItWorks)}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t(MESSAGES.home.threeSteps)}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">{t(MESSAGES.home.howIntro)}</p>

        <ol className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">
          <Reveal as="li" className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left" delay={0}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepOneTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepOneText)}</p>
          </Reveal>

          <Reveal as="li" className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left" delay={90}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepTwoTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepTwoText)}</p>
          </Reveal>

          <Reveal as="li" className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left" delay={180}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              3
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepThreeTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepThreeText)}</p>
          </Reveal>
        </ol>
      </Reveal>

      <Reveal className="mt-12 text-center sm:mt-16 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.faq)}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t(MESSAGES.home.faqTitle)}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">{t(MESSAGES.home.faqIntro)}</p>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-2 md:items-start">
          {/* <details className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" open>
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Sur quoi repose l’interface ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              L’interface est construite avec React et Vite, stylée avec Tailwind CSS. Les appels HTTP sont centralisés pour garder un comportement identique sur tous les outils.
            </p>
          </details> */}

          <Reveal className="h-full" delay={0}>
            <details className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                {t(MESSAGES.home.faqOneQuestion)}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqOneAnswer)}</p>
            </details>
          </Reveal>

          <Reveal className="h-full" delay={80}>
            <details className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                {t(MESSAGES.home.faqTwoQuestion)}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqTwoAnswer)}</p>
            </details>
          </Reveal>

          <Reveal className="h-full" delay={160}>
            <details className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                {t(MESSAGES.home.faqThreeQuestion)}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqThreeAnswer)}</p>
            </details>
          </Reveal>

          <Reveal className="h-full" delay={240}>
            <details className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                {t(MESSAGES.home.faqFourQuestion)}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqFourAnswer)}</p>
            </details>
          </Reveal>
        </div>
      </Reveal>
    </section>
  )
}
