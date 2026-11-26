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
    <section className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-14 sm:text-left">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{t(TEXT.userSpace)}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-ink-muted sm:mx-0">
        {t(TEXT.intro)}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <HealthStatus />
        <MeStatus />
      </div>

      <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-start">
        <Link
          to="/account"
          className="rounded-xl bg-brand px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-soft"
        >
          {t(TEXT.manageAccount)}
        </Link>
        <Link
          to="/jobs"
          className="rounded-xl bg-surface-muted/60 px-6 py-3.5 text-center text-sm font-semibold text-ink-soft shadow-sm transition hover:bg-surface-strong"
        >
          {t(TEXT.seeJobs)}
        </Link>
      </div>
    </section>
  )
}
