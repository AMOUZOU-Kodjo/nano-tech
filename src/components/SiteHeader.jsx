import { Link } from 'react-router-dom'
import { useMeContext } from '@/hooks/useMeContext.js'

// En-tête commun : identité NanoFile, retour à l'accueil et accès au compte.
export default function SiteHeader() {
  const { isGuest, loading } = useMeContext()

  return (
    <header className="border-b border-slate-800 bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500 text-lg font-bold text-slate-950"
          >
            N
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-100">NanoFile</span>
            <span className="block text-xs text-slate-400">Outils pour vos fichiers</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {!loading && isGuest && (
            <>
              <Link to="/login" className="text-slate-300 hover:text-sky-300">
                Connexion
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-sky-500 px-3 py-2 font-semibold text-slate-950 hover:bg-sky-400"
              >
                Inscription
              </Link>
            </>
          )}
          {!loading && !isGuest && (
            <>
              <Link to="/profile" className="text-slate-300 hover:text-sky-300">
                Profil
              </Link>
              <Link to="/studio" className="text-slate-300 hover:text-sky-300">
                Studio
              </Link>
              <Link to="/jobs" className="text-slate-300 hover:text-sky-300">
                Jobs
              </Link>
              <Link to="/billing" className="text-slate-300 hover:text-sky-300">
                Facturation
              </Link>
              <Link to="/documents" className="text-slate-300 hover:text-sky-300">
                Documents
              </Link>
              <Link to="/account" className="text-slate-300 hover:text-sky-300">
                Compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
