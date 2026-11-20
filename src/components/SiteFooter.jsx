import { Link } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'

const FOOTER_SECTIONS = [
  {
    title: 'Découvrir',
    links: [
      { to: '/', label: 'Accueil' },
      { to: '/catalogue', label: 'Catalogue' },
    ],
  },
  {
    title: 'Outils',
    links: [
      { to: '/studio', label: 'Studio' },
      { to: '/documents', label: 'Documents' },
      { to: '/jobs', label: 'Historique des jobs' },
    ],
  },
  {
    title: 'Espace utilisateur',
    links: [
      { to: '/dashboard', label: 'État du service et du compte' },
      { to: '/profile', label: 'Profil' },
      { to: '/account', label: 'Compte et RGPD' },
      { to: '/billing', label: 'Facturation' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { to: '/terms', label: 'CGU 2026-11' },
      { to: '/privacy', label: 'Confidentialité' },
      { to: '/cookies', label: 'Cookies' },
      { to: '/legal', label: 'Mentions légales' },
    ],
  },
]

function FooterSection({ title, links }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-900">{title}</h2>
      <nav aria-label={title} className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="leading-snug hover:text-sky-700">
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  )
}

// Pied de page commun : navigation secondaire et liens légaux exigés côté frontend.
export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 sm:mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-x-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="" className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12" />
              <span className="text-lg font-bold text-slate-900">NanoFile</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Une interface claire pour utiliser les outils fichiers exposés par l’API NanoFile.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-4">
            {FOOTER_SECTIONS.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>NanoFile — outils pour vos fichiers.</span>
          <span>Conditions générales : version 2026-11.</span>
        </div>
      </div>
    </footer>
  )
}
