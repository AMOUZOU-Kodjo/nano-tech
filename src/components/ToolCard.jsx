import { Link } from 'react-router-dom'

// Carte d'outil : lien vers la page générique correspondant à l'outil documenté.
export default function ToolCard({ tool }) {
  const initials = tool.name.slice(0, 2).toUpperCase()

  return (
    <Link
      to={`/tools/${tool.tool}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-xs font-bold text-sky-600 ring-1 ring-slate-200"
        >
          {initials}
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">{tool.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
        </div>
      </div>
    </Link>
  )
}
