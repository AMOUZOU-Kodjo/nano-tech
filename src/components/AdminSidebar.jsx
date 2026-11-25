import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCamera,
  FiFileText,
  FiGlobe,
  FiHome,
  FiSettings,
  FiUsers,
} from 'react-icons/fi'
import LogoutButton from '@/components/LogoutButton.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  controlRoom: { fr: 'Centre de contrôle', en: 'Control room' },
  home: { fr: 'Accueil du site', en: 'Back to site' },
  navigation: { fr: 'Navigation', en: 'Navigation' },
  account: { fr: 'Compte', en: 'Account' },
}

const ADMIN_TABS = [
  { id: 'overview', label: { fr: 'Vue d’ensemble', en: 'Overview' }, Icon: FiBarChart2 },
  { id: 'users', label: { fr: 'Utilisateurs', en: 'Users' }, Icon: FiUsers },
  { id: 'runs', label: { fr: 'Exécutions d’outils', en: 'Tool runs' }, Icon: FiFileText },
  { id: 'events', label: { fr: 'Événements', en: 'Events' }, Icon: FiActivity },
  { id: 'errors', label: { fr: 'Erreurs d’événements', en: 'Event errors' }, Icon: FiAlertCircle },
  { id: 'anonymous', label: { fr: 'Utilisation anonyme', en: 'Anonymous usage' }, Icon: FiGlobe },
  { id: 'photo', label: { fr: 'Photo d’identité', en: 'ID photo' }, Icon: FiCamera },
  { id: 'settings', label: { fr: 'Paramètres', en: 'Settings' }, Icon: FiSettings },
]

// Sidebar administrative partagée : rendue dans le body pour rester fixe malgré les animations de page.
export default function AdminSidebar({ activeTab, onSelect, tabs = ADMIN_TABS }) {
  const { t } = useLocale()
  const { reload } = useMeContext()

  return createPortal(
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-xl lg:flex">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-violet-400 to-cyan-500" />

      <div className="px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600">{t(TEXT.controlRoom)}</p>
        <p className="mt-1 text-sm font-bold text-slate-900">NanoFile</p>
      </div>

      <div className="px-2">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {t(TEXT.navigation)}
        </p>
        <nav role="tablist" aria-label={t(TEXT.controlRoom)} className="flex flex-col gap-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => onSelect?.(id)}
              className={`inline-flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                activeTab === id
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>{t(label)}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-100 px-4 py-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{t(TEXT.account)}</p>
        <Link
          to="/"
          className="mb-3 inline-flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <FiHome aria-hidden="true" className="h-4 w-4 shrink-0" />
          {t(TEXT.home)}
        </Link>
        <div className="[&_button]:w-full [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-slate-50 [&_button]:py-2 [&_button]:text-xs [&_p]:text-[11px]">
          <LogoutButton onSuccess={reload} />
        </div>
      </div>
    </aside>,
    document.body,
  )
}
