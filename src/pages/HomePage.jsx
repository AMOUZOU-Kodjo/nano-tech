import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiCheck, FiFileText, FiImage, FiLayers, FiShield, FiZap } from 'react-icons/fi'
import heroLogo from '../../Logo NanoFile bleu et cyan.png'
import { Link } from 'react-router-dom'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  badge: { fr: 'Traitement en ligne', en: 'Online processing' },
  badgeDetail: { fr: 'Simple · clair · prévisible', en: 'Simple · clear · predictable' },
  tryCompress: { fr: 'Essayer la compression', en: 'Try compression' },
  seeHow: { fr: 'Voir comment ça marche', en: 'See how it works' },
  previewTitle: { fr: 'Aperçu du traitement', en: 'Processing preview' },
  previewSimulation: { fr: 'Simulation', en: 'Demo' },
  previewFile: { fr: 'presentation.pdf', en: 'presentation.pdf' },
  previewFileMeta: { fr: 'Document PDF', en: 'PDF document' },
  previewStep: { fr: 'Compression en cours', en: 'Compression in progress' },
  previewDone: { fr: 'Prêt à télécharger', en: 'Ready to download' },
  toolCompress: { fr: 'Compression', en: 'Compression' },
  toolConvert: { fr: 'Conversion', en: 'Conversion' },
  toolSecure: { fr: 'Sécurisation', en: 'Security' },
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

// Vue d'accueil : présentation concise et accès directs aux espaces principaux.
export default function HomePage() {
  const { locale, t } = useLocale()
  const [progress, setProgress] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 68 : 8,
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frame
    const start = performance.now()
    const animate = (time) => {
      const cycle = ((time - start) % 3200) / 3200
      const ratio = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2
      const next = 8 + Math.round(ratio * 60)
      setProgress((current) => (current === next ? current : next))
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const progressLabel = locale === 'fr' ? `${progress} %` : `${progress}%`

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-line p-6 sm:p-10 lg:p-12">
        <img
          src={heroLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.6] select-none object-contain opacity-[0.06] dark:opacity-[0.12]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t(TEXT.badge)}
              <span className="text-ink-faint">·</span>
              {t(TEXT.badgeDetail)}
            </span>

            <h1 className="mt-5 text-2xl text-left font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
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

          <Reveal className="relative mx-auto w-full max-w-md" delay={90}>
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-brand/10 blur-2xl" />
            <div className="relative rounded-2xl border border-line bg-surface/95 p-5  backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-surface text-brand">
                    <FiLayers aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{t(TEXT.previewTitle)}</p>
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                        {t(TEXT.previewSimulation)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">{t(TEXT.previewFileMeta)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-brand">{progressLabel}</span>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-surface-muted p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-surface text-brand">
                  <FiFileText aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{t(TEXT.previewFile)}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{t(TEXT.previewFileMeta)}</p>
                </div>
                <FiCheck aria-hidden="true" className="h-4 w-4 text-brand" />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
                  <span>{t(TEXT.previewStep)}</span>
                  <span>{progressLabel}</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={t(TEXT.previewStep)}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-strong"
                >
                  <div className="h-full rounded-full bg-brand transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { Icon: FiZap, label: TEXT.toolCompress },
                  { Icon: FiImage, label: TEXT.toolConvert },
                  { Icon: FiShield, label: TEXT.toolSecure },
                ].map(({ Icon, label }) => (
                  <div key={label.fr} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-3 text-center">
                    <Icon aria-hidden="true" className="h-4 w-4 text-brand" />
                    <span className="text-[11px] font-semibold text-ink-soft">{t(label)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
                  <FiCheck aria-hidden="true" className="h-4 w-4" />
                  {t(TEXT.previewDone)}
                </span>
                <span className="text-[11px] text-ink-faint">{t(TEXT.badge)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.processingZone)}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{t(MESSAGES.home.compress)}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{t(MESSAGES.home.compressFormats)}</p>
          </div>
          <Link
            to="/tools/compress"
            className="self-center rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto"
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

        <div className="mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* <p className="text-xs text-slate-500">Aucun fichier choisi</p>
          <a href="#comment-ca-marche" className="text-xs font-semibold text-sky-700 hover:underline">
            01 / Comment ça marche
          </a> */}
        </div>
      </Reveal>

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
