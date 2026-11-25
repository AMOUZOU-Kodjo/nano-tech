import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { TOOLS } from '@/config/tools.js'
import { MESSAGES } from '@/i18n/messages.js'
import { useEnabledTools } from '@/hooks/useEnabledTools.js'
import { useLocale } from '@/hooks/useLocale.js'

// Définition des groupes d’outils ; les liens visibles suivent les paramètres admin.
const FOOTER_TOOL_DEFINITIONS = [
  { id: 'optimize', title: MESSAGES.nav.groups.optimize, categories: ['optimize'] },
  { id: 'convert', title: MESSAGES.nav.groups.convert, categories: ['convert'] },
  { id: 'organize', title: MESSAGES.nav.groups.organize, categories: ['organize'] },
  { id: 'security-photo', title: MESSAGES.nav.groups.securityPhoto, categories: ['security', 'photo'] },
]

const FOOTER_SECTIONS = [
  {
    id: 'discover',
    title: MESSAGES.footer.discover,
    links: [
      { to: '/', label: MESSAGES.common.home },
      { to: '/catalogue', label: MESSAGES.common.catalogue },
    ],
  },
  {
    id: 'more-tools',
    title: MESSAGES.footer.complementaryTools,
    links: [
      { to: '/studio', label: MESSAGES.common.studio },
      { to: '/documents', label: MESSAGES.common.documents },
      { to: '/jobs', label: MESSAGES.footer.jobs },
    ],
  },
  {
    id: 'user-space',
    title: MESSAGES.footer.userSpace,
    links: [
      { to: '/dashboard', label: MESSAGES.footer.dashboard },
      { to: '/profile', label: MESSAGES.common.profile },
      { to: '/account', label: MESSAGES.common.account },
      { to: '/billing', label: MESSAGES.common.billing },
    ],
  },
  {
    id: 'information',
    title: MESSAGES.footer.information,
    links: [
      { to: '/terms', label: MESSAGES.footer.terms },
      { to: '/privacy', label: MESSAGES.footer.privacy },
      { to: '/cookies', label: MESSAGES.footer.cookies },
      { to: '/legal', label: MESSAGES.footer.legal },
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
  const { t } = useLocale()
  const { isEnabled } = useEnabledTools()

  // Insère les groupes d’outils actifs juste après la section « Découvrir ».
  const toolSections = useMemo(
    () =>
      FOOTER_TOOL_DEFINITIONS.map((group) => ({
        ...group,
        links: TOOLS.filter(
          (tool) => group.categories.includes(tool.category) && isEnabled(tool.tool),
        ).map((tool) => ({
          to: `/tools/${tool.tool}`,
          label: MESSAGES.tools[tool.tool] ?? { fr: tool.name, en: tool.name },
        })),
      })).filter((group) => group.links.length > 0),
    [isEnabled],
  )
  const sections = [FOOTER_SECTIONS[0], ...toolSections, ...FOOTER_SECTIONS.slice(1)]

  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 sm:mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-x-10">
          <div className="text-center sm:text-left lg:flex lg:flex-col lg:justify-center lg:text-center">
            <div className="flex items-center justify-center gap-3 sm:justify-start lg:justify-center">
              <img src={logoUrl} alt="" className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />
              <span className="sr-only">NanoFile</span>
            </div>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-600 sm:mx-0 lg:mx-auto">
              {t(MESSAGES.footer.tagline)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-4">
            {sections.map((section) => (
              <FooterSection
                key={section.id}
                title={t(section.title)}
                links={section.links.map((link) => ({ ...link, label: t(link.label) }))}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span className="font-bold">{t(MESSAGES.footer.copyright)}</span>
          <Link to="/terms" className="rounded font-bold text-sky-700 hover:text-sky-800 hover:underline">
            {t(MESSAGES.footer.termsLink)}
          </Link>
        </div>
      </div>
    </footer>
  )
}
