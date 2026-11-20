import { Link } from 'react-router-dom'

// Pied de page commun : liens légaux exigés côté frontend.
export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500">
        <span>NanoFile</span>
        <nav className="flex flex-wrap gap-4">
          <Link to="/terms" className="hover:text-slate-300">CGU 2026-11</Link>
          <Link to="/privacy" className="hover:text-slate-300">Confidentialité</Link>
          <Link to="/cookies" className="hover:text-slate-300">Cookies</Link>
          <Link to="/legal" className="hover:text-slate-300">Mentions légales</Link>
        </nav>
      </div>
    </footer>
  )
}
