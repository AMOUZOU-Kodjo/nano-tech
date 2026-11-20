import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { useMeContext } from '@/hooks/useMeContext.js'

// Liens principaux affichés dans la barre de navigation.
const MAIN_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/dashboard', label: 'Espace' },
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

function isActiveLink(path, currentPath) {
  return path === '/' ? currentPath === '/' : currentPath.startsWith(path)
}

// Calcule une classe d'activation sans surligner toutes les routes imbriquées.
function linkClass(path, currentPath) {
  const active = isActiveLink(path, currentPath)
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

function mobileLinkClass(path, currentPath) {
  const active = isActiveLink(path, currentPath)
  return `flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    active
      ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
  }`
}

// Barre de navigation globale : une seule instance pour toutes les pages.
export default function Navbar() {
  const location = useLocation()
  const { isGuest, loading } = useMeContext()
  const [menuOpen, setMenuOpen] = useState(false)

  const authLinks = loading
    ? []
    : isGuest
      ? [
          { to: '/login', label: 'Connexion' },
          { to: '/register', label: 'Inscription' },
        ]
      : ACCOUNT_LINKS

  const navGroups = [
    { title: 'Navigation', links: MAIN_LINKS },
    ...(authLinks.length ? [{ title: isGuest ? 'Accès au compte' : 'Mon compte', links: authLinks }] : []),
  ]

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          <img
            src={logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-contain sm:h-14 sm:w-14"
          />
          <span>
            <span className="block text-base font-bold text-slate-900 sm:text-lg">NanoFile</span>
            <span className="hidden text-xs text-slate-500 sm:block">Outils pour vos fichiers</span>
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
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-all ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigation mobile"
          className="absolute inset-x-0 top-full z-50 border-t border-slate-200 bg-white shadow-2xl lg:hidden"
        >
          <div className="mx-auto max-h-[calc(100vh-5.5rem)] max-w-6xl overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Menu NanoFile</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {loading ? 'Chargement du compte…' : isGuest ? 'Vous consultez en invité.' : 'Vous êtes connecté.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500 transition hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {navGroups.map((group) => (
                <section key={group.title}>
                  <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {group.title}
                  </h2>
                  <div className="mt-2 space-y-1">
                    {group.links.map((link) => {
                      const active = isActiveLink(link.to, location.pathname)
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMenuOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={mobileLinkClass(link.to, location.pathname)}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-sky-500' : 'bg-slate-300'}`}
                            />
                            {link.label}
                          </span>
                          {active && <span className="text-xs font-semibold text-sky-600">Actif</span>}
                        </Link>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
