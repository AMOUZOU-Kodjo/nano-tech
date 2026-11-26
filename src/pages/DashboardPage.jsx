import { Link } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import HealthStatus from '@/components/HealthStatus.jsx'
import MeStatus from '@/components/MeStatus.jsx'

const TEXT = {
  eyebrow: { fr: 'Votre espace', en: 'Your space' },
  title: { fr: 'Bienvenue sur NanoFile', en: 'Welcome to NanoFile' },
  intro: {
    fr: 'Gérez votre compte, créez un document et retrouvez vos traitements en quelques clics.',
    en: 'Manage your account, create a document and find your processed files in a few clicks.',
  },
  actionsTitle: { fr: 'Que souhaitez-vous faire ?', en: 'What would you like to do?' },
  accountAction: {
    title: { fr: 'Modifier mon profil', en: 'Edit my profile' },
    hint: { fr: 'Email, coordonnées et préférences.', en: 'Email, details and preferences.' },
  },
  documentAction: {
    title: { fr: 'Créer un CV ou une lettre', en: 'Create a CV or a letter' },
    hint: { fr: 'Choisissez un modèle et générez votre document.', en: 'Choose a template and generate your document.' },
  },
  jobsAction: {
    title: { fr: 'Voir mes traitements', en: 'View my processed files' },
    hint: { fr: 'Suivez l’avancement de vos fichiers.', en: 'Follow the progress of your files.' },
  },
}

function ActionLink({ to, action }) {
  const { t } = useLocale()

  return (
    <Link
      to={to}
      className="group flex h-full flex-col justify-between gap-5 rounded-2xl bg-surface p-5 ring-1 ring-line/50 transition hover:ring-brand/40"
    >
      <div>
        <p className="text-sm font-semibold text-ink">{t(action.title)}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{t(action.hint)}</p>
      </div>
      <span aria-hidden="true" className="text-lg font-semibold text-brand transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}

// Page d'accueil privée : état des services, compte courant et accès rapides.
export default function DashboardPage() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{t(TEXT.eyebrow)}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">{t(TEXT.intro)}</p>
      </div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <HealthStatus />
        <MeStatus />
      </div>

      <section className="mt-8 rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.actionsTitle)}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ActionLink to="/account" action={TEXT.accountAction} />
          <ActionLink to="/studio" action={TEXT.documentAction} />
          <ActionLink to="/jobs" action={TEXT.jobsAction} />
        </div>
      </section>
    </section>
  )
}
