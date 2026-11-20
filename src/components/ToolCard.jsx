import { Link } from 'react-router-dom'

// Carte d'outil : lien vers la page générique correspondant à l'outil documenté.
export default function ToolCard({ tool }) {
  const initials = tool.name.slice(0, 2).toUpperCase()

  return (
    <Link
      to={`/tools/${tool.tool}`}
      className="block rounded-2xl border border-slate-700 bg-slate-800/60 p-5 shadow-lg transition hover:border-sky-400/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/10 text-xs font-bold text-sky-300 ring-1 ring-sky-400/30"
        >
          {initials}
        </span>
        <div>
          <h3 className="font-semibold text-slate-100">{tool.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{tool.description}</p>
        </div>
      </div>
    </Link>
  )
}
