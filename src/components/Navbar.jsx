import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMeContext } from '@/hooks/useMeContext.js'

// Liens principaux affichés dans la barre de navigation.
const MAIN_LINKS = [
  { to: '/', label: 'Outils' },
  { to: '/studio', label: 'Studio' },
  { to: '/documents', label: 'Documents' },
  { to: '/jobs', label: 'Jobs' },
]

// Liens de gestion de compte affichés pour un utilisateur connecté.
const ACCOUNT_LINKS = [
  { to: '/profile', label: 'Profil' },
  { to: '/account', label: 'Compte' },
  { to: '/billing', label: 'Facturation' },
]

// Liens légaux hébergés par le front.
const INFO_LINKS = [
  { to: '/terms', label: 'CGU 2026-11' },
  { to: '/privacy', label: 'Confidentialité' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/legal', label: 'Mentions légales' },
]

// Calcule une classe d'activation sans surligner toutes les routes imbriquées.
function linkClass(path, currentPath) {
  const active = path === '/' ? currentPath === '/' : currentPath.startsWith(path)
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

// Barre de navigation globale : une seule instance pour toutes les pages.
export default function Navbar() {
  const location = useLocation()
  const { isGuest, loading } = useMeContext()
  const [menuOpen, setMenuOpen] = useState(false)

  const authLinks = !loading && isGuest
    ? [
        { to: '/login', label: 'Connexion' },
        { to: '/register', label: 'Inscription' },
      ]
    : ACCOUNT_LINKS

  const allLinks = [...MAIN_LINKS, ...authLinks, ...INFO_LINKS]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500 text-lg font-bold text-white"
          >
            N
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">NanoFile</span>
            <span className="block text-xs text-slate-500">Outils pour vos fichiers</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {MAIN_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to, location.pathname)}>
              {link.label}
            </Link>
          ))}
          {authLinks.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to, location.pathname)}>
              {link.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Informations
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {INFO_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
        >
          {menuOpen ? 'Fermer' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden" aria-label="Navigation mobile">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={linkClass(link.to, location.pathname)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
