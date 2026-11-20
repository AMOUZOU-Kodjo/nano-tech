import { Link } from 'react-router-dom'
import logoUrl from '../../Logo NanoFile bleu et cyan.png'

// Pied de page commun : navigation secondaire et liens légaux exigés côté frontend.
export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />
              <span className="text-lg font-bold text-slate-900">NanoFile</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Une interface claire pour utiliser les outils fichiers exposés par l’API NanoFile.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Découvrir</h2>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/" className="hover:text-sky-700">Accueil</Link>
              <Link to="/catalogue" className="hover:text-sky-700">Catalogue</Link>
              <Link to="/studio" className="hover:text-sky-700">Studio</Link>
              <Link to="/documents" className="hover:text-sky-700">Documents</Link>
              <Link to="/jobs" className="hover:text-sky-700">Historique des jobs</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Espace utilisateur</h2>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/dashboard" className="hover:text-sky-700">État du service et du compte</Link>
              <Link to="/profile" className="hover:text-sky-700">Profil</Link>
              <Link to="/account" className="hover:text-sky-700">Compte et RGPD</Link>
              <Link to="/billing" className="hover:text-sky-700">Facturation</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Informations</h2>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/terms" className="hover:text-sky-700">CGU 2026-11</Link>
              <Link to="/privacy" className="hover:text-sky-700">Confidentialité</Link>
              <Link to="/cookies" className="hover:text-sky-700">Cookies</Link>
              <Link to="/legal" className="hover:text-sky-700">Mentions légales</Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <span>NanoFile — outils pour vos fichiers.</span>
          <span>Conditions générales : version 2026-11.</span>
        </div>
      </div>
    </footer>
  )
}
