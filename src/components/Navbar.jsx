import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiActivity,
  FiChevronDown,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogIn,
  FiMenu,
  FiMinimize2,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
  FiX,
  FiZap,
} from 'react-icons/fi'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'
import { TOOLS } from '@/config/tools.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Regroupement des outils affiché dans le menu de la navbar.
const TOOL_MENU_GROUPS = [
  {
    id: 'optimize',
    title: 'Optimiser',
    description: 'Réduire la taille des fichiers.',
    categories: ['optimize'],
    icon: FiMinimize2,
  },
  {
    id: 'convert',
    title: 'Convertir',
    description: 'Changer le format des documents.',
    categories: ['convert'],
    icon: FiRefreshCw,
  },
  {
    id: 'organize',
    title: 'Organiser',
    description: 'Assembler, scinder ou classer.',
    categories: ['organize'],
    icon: FiLayers,
  },
  {
    id: 'security-photo',
    title: 'Sécurité & Photo',
    description: 'Protéger et préparer les fichiers.',
    categories: ['security', 'photo'],
    icon: FiShield,
  },
].map((group) => ({
  ...group,
  tools: TOOLS.filter((tool) => group.categories.includes(tool.category)),
}))

// Groupes d’outils affichés dans le menu mobile.
const MOBILE_TOOL_GROUPS = TOOL_MENU_GROUPS.map((group) => ({
  id: group.id,
  title: group.title,
  icon: group.icon,
  links: group.tools.map((tool) => ({
    to: `/tools/${tool.tool}`,
    label: tool.name,
  })),
}))

// Raccourcis mis en avant dans le menu mobile.
const MOBILE_SHORTCUTS = [
  { to: '/tools/compress', label: 'Compresser', hint: 'Images, PDF, vidéos', icon: FiMinimize2 },
  { to: '/catalogue', label: 'Catalogue', hint: 'Tous les outils', icon: FiGrid },
  { to: '/studio', label: 'Studio', hint: 'Génération de CV', icon: FiFileText },
]

// Liens principaux affichés dans la barre de navigation.
const MAIN_LINKS = [
  { to: '/', label: 'Accueil', icon: FiHome },
  { to: '/dashboard', label: 'Espace', icon: FiGrid },
  { to: '/studio', label: 'Studio', icon: FiZap },
  { to: '/documents', label: 'Documents', icon: FiFileText },
  { to: '/jobs', label: 'Jobs', icon: FiActivity },
]

// Liens de gestion de compte affichés pour un utilisateur connecté.
const ACCOUNT_LINKS = [
  { to: '/profile', label: 'Profil', icon: FiUser },
  { to: '/account', label: 'Compte', icon: FiSettings },
  { to: '/billing', label: 'Facturation', icon: FiCreditCard },
]

function isActiveLink(path, currentPath) {
  const cleanPath = path.split('?')[0]
  return cleanPath === '/' ? currentPath === '/' : currentPath.startsWith(cleanPath)
}

// Calcule une classe d'activation sans surligner toutes les routes imbriquées.
function linkClass(path, currentPath) {
  const active = isActiveLink(path, currentPath)
  return `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

// Met en avant l’inscription avec un fond coloré dans la navbar desktop.
function desktopAuthLinkClass(link, currentPath) {
  if (link.to === '/register') {
    return 'inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700'
  }
  return linkClass(link.to, currentPath)
}

function mobileLinkClass(path, currentPath) {
  const active = isActiveLink(path, currentPath)
  return `flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    active
      ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
  }`
}

// Retrouve le groupe d’outils correspondant à la route courante.
function findCurrentToolGroupId(pathname) {
  return (
    MOBILE_TOOL_GROUPS.find((group) => group.links.some((link) => pathname.startsWith(link.to)))?.id ?? ''
  )
}

// Lien du menu mobile avec indication visuelle de la route active.
function MobileNavLink({ link, pathname, onClick }) {
  const active = isActiveLink(link.to, pathname)
  const Icon = link.icon
  return (
    <Link
      to={link.to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={mobileLinkClass(link.to, pathname)}
    >
      <span className="flex items-center gap-3">
        {Icon ? (
          <Icon aria-hidden="true" className={`h-4 w-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
        ) : (
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-sky-500' : 'bg-slate-300'}`}
          />
        )}
        {link.label}
      </span>
      {active && <span className="text-xs font-semibold text-sky-600">Actif</span>}
    </Link>
  )
}

// Barre de navigation globale : une seule instance pour toutes les pages.
export default function Navbar() {
  const location = useLocation()
  const { isGuest, loading } = useMeContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(() => ({
    [findCurrentToolGroupId(location.pathname)]: true,
  }))
  const toolsRef = useRef(null)
  const menuButtonRef = useRef(null)
  const menuContainerRef = useRef(null)
  const menuSearchRef = useRef(null)
  const toolsActive = location.pathname.startsWith('/tools')
  const currentGroupId = findCurrentToolGroupId(location.pathname)
  const normalizedSearch = menuSearch.trim().toLocaleLowerCase('fr')
  const searchActive = normalizedSearch.length > 0

  const authLinks = loading
    ? []
    : isGuest
      ? [
          { to: '/login', label: 'Connexion', icon: FiLogIn },
          { to: '/register', label: 'Inscription', icon: FiUserPlus },
        ]
      : ACCOUNT_LINKS

  const filteredToolGroups = MOBILE_TOOL_GROUPS.map((group) => ({
    ...group,
    links: group.links.filter((link) =>
      `${group.title} ${link.label}`.toLocaleLowerCase('fr').includes(normalizedSearch),
    ),
  })).filter((group) => group.links.length > 0)

  // Ouvre le menu en réinitialisant la recherche et en dépliant le groupe courant.
  function openMenu() {
    setMenuSearch('')
    setExpandedGroups({ [currentGroupId]: true })
    setMenuOpen(true)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleGroup(id) {
    setExpandedGroups((current) => ({
      ...current,
      [id]: !(current[id] ?? id === currentGroupId),
    }))
  }

  function isGroupOpen(group) {
    return expandedGroups[group.id] ?? group.id === currentGroupId
  }

  useEffect(() => {
    if (!toolsOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!toolsRef.current?.contains(event.target)) {
        setToolsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setToolsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [toolsOpen])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const menuButton = menuButtonRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

    // Garde le focus dans le menu et le restitue au bouton hamburger à la fermeture.
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !menuContainerRef.current) {
        return
      }

      const focusable = Array.from(menuContainerRef.current.querySelectorAll(focusableSelector))
      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    menuSearchRef.current?.focus()
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      menuButton?.focus()
    }
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
          <Link to="/" className={linkClass('/', location.pathname)}>
            <FiHome aria-hidden="true" className="h-4 w-4" />
            Accueil
          </Link>

          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((open) => !open)}
              aria-expanded={toolsOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                toolsActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FiGrid aria-hidden="true" className="h-4 w-4" />
              Outils
              <FiChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition ${toolsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {toolsOpen && (
              <div
                role="menu"
                aria-label="Catégories d’outils"
                className="absolute left-0 top-full z-50 mt-2 w-[640px] max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
              >
                <div className="grid grid-cols-2 gap-2">
                  {TOOL_MENU_GROUPS.map((group) => {
                    const GroupIcon = group.icon
                    return (
                      <div key={group.id} className="rounded-xl border border-transparent p-3 hover:border-slate-200 hover:bg-slate-50">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                          <GroupIcon aria-hidden="true" className="h-4 w-4" />
                          {group.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{group.description}</p>
                        <div className="mt-2 grid gap-0.5">
                          {group.tools.map((tool) => (
                            <Link
                              key={tool.tool}
                              to={`/tools/${tool.tool}`}
                              onClick={() => setToolsOpen(false)}
                              className="rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-800"
                            >
                              {tool.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {MAIN_LINKS.filter((link) => link.to !== '/').map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.to} to={link.to} className={linkClass(link.to, location.pathname)}>
                <Icon aria-hidden="true" className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
          {authLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.to} to={link.to} className={desktopAuthLinkClass(link, location.pathname)}>
                {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 lg:hidden"
        >
          {menuOpen ? (
            <FiX aria-hidden="true" className="h-5 w-5" />
          ) : (
            <FiMenu aria-hidden="true" className="h-5 w-5" />
          )}
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
          ref={menuContainerRef}
          id="mobile-navigation"
          aria-label="Navigation mobile"
          aria-modal="true"
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
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500 transition hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Recherche
                </h2>
                <label className="mt-2 block">
                  <span className="sr-only">Rechercher un outil</span>
                  <input
                    ref={menuSearchRef}
                    type="search"
                    value={menuSearch}
                    onChange={(event) => setMenuSearch(event.target.value)}
                    placeholder="Rechercher un outil…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  />
                </label>
              </section>

              <section>
                <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Accès rapide
                </h2>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {MOBILE_SHORTCUTS.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMenu}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 transition hover:border-sky-300 hover:bg-sky-50"
                      >
                        <Icon aria-hidden="true" className="h-5 w-5 text-sky-600" />
                        <span className="mt-2 block text-sm font-semibold text-slate-900">{item.label}</span>
                        <span className="mt-1 block text-xs text-slate-500">{item.hint}</span>
                      </Link>
                    )
                  })}
                </div>
                {isGuest && !loading && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      <FiLogIn aria-hidden="true" className="h-4 w-4" />
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <FiUserPlus aria-hidden="true" className="h-4 w-4" />
                      Inscription
                    </Link>
                  </div>
                )}
              </section>

              <section>
                <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Navigation
                </h2>
                <div className="mt-2 space-y-1">
                  {MAIN_LINKS.map((link) => (
                    <MobileNavLink key={link.to} link={link} pathname={location.pathname} onClick={closeMenu} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Outils
                </h2>
                {searchActive ? (
                  filteredToolGroups.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {filteredToolGroups.flatMap((group) =>
                        group.links.map((link) => (
                          <MobileNavLink key={link.to} link={link} pathname={location.pathname} onClick={closeMenu} />
                        )),
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 px-4 py-3 text-sm text-slate-500">
                      Aucun outil trouvé pour « {menuSearch.trim()} ».
                    </p>
                  )
                ) : (
                  <div className="mt-2 space-y-2">
                    {MOBILE_TOOL_GROUPS.map((group) => {
                      const open = isGroupOpen(group)
                      const GroupIcon = group.icon
                      return (
                        <div key={group.id} className="overflow-hidden rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.id)}
                            aria-expanded={open}
                            aria-controls={`mobile-group-${group.id}`}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                          >
                            <span className="flex items-center gap-2">
                              <GroupIcon aria-hidden="true" className="h-4 w-4 text-sky-600" />
                              <span className="text-sm font-semibold text-slate-800">{group.title}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                {group.links.length}
                              </span>
                            </span>
                            <FiChevronDown
                              aria-hidden="true"
                              className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {open && (
                            <div id={`mobile-group-${group.id}`} className="border-t border-slate-100 bg-slate-50/60 px-2 py-2">
                              {group.links.map((link) => (
                                <MobileNavLink key={link.to} link={link} pathname={location.pathname} onClick={closeMenu} />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {!isGuest && authLinks.length > 0 && (
                <section>
                  <h2 className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Mon compte
                  </h2>
                  <div className="mt-2 space-y-1">
                    {authLinks.map((link) => (
                      <MobileNavLink key={link.to} link={link} pathname={location.pathname} onClick={closeMenu} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
