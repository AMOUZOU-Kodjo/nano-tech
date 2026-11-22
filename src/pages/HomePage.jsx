import { Link } from 'react-router-dom'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'

// Vue d'accueil : présentation concise et accès directs aux espaces principaux.
export default function HomePage() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br   to-canvas p-8 text-center sm:p-16 sm:text-left">

        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full " />
        <div className="relative mx-auto max-w-3xl">
          {/* <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            NanoFile
          </span> */}
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-slate-900 sm:mt-5 sm:text-5xl">
            {t(MESSAGES.home.heroTitle)}
          </h1>
          {/* <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:mt-5 sm:text-xl"> */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:mt-5 sm:text-base">
            {t(MESSAGES.home.heroTextOne)} {t(MESSAGES.home.heroTextTwo)}
          </p>

          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-600 sm:justify-start sm:text-sm">
            <li>{t(MESSAGES.home.benefitAnalytics)}</li>
            <li>{t(MESSAGES.home.benefitDownload)}</li>
            <li>{t(MESSAGES.home.benefitFormats)}</li>
          </ul>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              to="/catalogue"
              className="rounded-lg bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              {t(MESSAGES.home.discoverTools)}
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t(MESSAGES.home.userSpace)}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
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
      </div>

      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <Link
          to="/catalogue"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.common.catalogue)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.chooseTool)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.chooseToolText)}</p>
        </Link>

        <Link
          to="/studio"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.common.studio)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.generateCv)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.studioText)}</p>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.userSpace)}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{t(MESSAGES.home.trackActivity)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.trackActivityText)}</p>
        </Link>
      </div>

      <div id="comment-ca-marche" className="mt-12 scroll-mt-24 rounded-3xl  p-6 text-center sm:mt-16 sm:p-10 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.howItWorks)}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t(MESSAGES.home.threeSteps)}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">{t(MESSAGES.home.howIntro)}</p>

        <ol className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepOneTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepOneText)}</p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepTwoTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepTwoText)}</p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              3
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t(MESSAGES.home.stepThreeTitle)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.stepThreeText)}</p>
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center sm:mt-16 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t(MESSAGES.home.faq)}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t(MESSAGES.home.faqTitle)}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">{t(MESSAGES.home.faqIntro)}</p>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-2 md:items-start">
          {/* <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" open>
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Sur quoi repose l’interface ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              L’interface est construite avec React et Vite, stylée avec Tailwind CSS. Les appels HTTP sont centralisés pour garder un comportement identique sur tous les outils.
            </p>
          </details> */}

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              {t(MESSAGES.home.faqOneQuestion)}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqOneAnswer)}</p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              {t(MESSAGES.home.faqTwoQuestion)}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqTwoAnswer)}</p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              {t(MESSAGES.home.faqThreeQuestion)}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqThreeAnswer)}</p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              {t(MESSAGES.home.faqFourQuestion)}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MESSAGES.home.faqFourAnswer)}</p>
          </details>
        </div>
      </div>
    </section>
  )
}
