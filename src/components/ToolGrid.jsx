import ToolCard from './ToolCard.jsx'

// Grille des outils documentés, filtrée selon la catégorie active.
export default function ToolGrid({ tools, category }) {
  const visibleTools = category === 'all' ? tools : tools.filter((tool) => tool.category === category)

  return (
    <div id="tools-grid" role="tabpanel" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleTools.length === 0 ? (
        <p className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-sm text-slate-400 sm:col-span-2 lg:col-span-3">
          Aucun outil n’est disponible dans cette catégorie.
        </p>
      ) : (
        visibleTools.map((tool) => <ToolCard key={tool.tool} tool={tool} />)
      )}
    </div>
  )
}
