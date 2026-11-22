import { Link } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import HealthStatus from '@/components/HealthStatus.jsx'
import MeStatus from '@/components/MeStatus.jsx'

const TEXT = {
  userSpace: { fr: 'Espace utilisateur', en: 'User space' },
  title: { fr: 'État du service et du compte', en: 'Service and account status' },
  intro: {
    fr: 'Consultez la disponibilité de l’API, les capacités détectées et votre quota courant.',
    en: 'Check API availability, detected capabilities and your current quota.',
  },
  manageAccount: { fr: 'Gérer mon compte →', en: 'Manage my account →' },
  seeJobs: { fr: 'Voir mes jobs →', en: 'View my jobs →' },
}

// Page dédiée au statut du service et au compte courant.
export default function DashboardPage() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 sm:py-12 sm:text-left">
      <p className="text-sm font-semibold text-sky-700">{t(TEXT.userSpace)}</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t(TEXT.title)}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">
        {t(TEXT.intro)}
      </p>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
        <HealthStatus />
        <MeStatus />
      </div>

      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-start">
        <Link
          to="/account"
          className="rounded-lg bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          {t(TEXT.manageAccount)}
        </Link>
        <Link
          to="/jobs"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {t(TEXT.seeJobs)}
        </Link>
      </div>
    </section>
  )
}
