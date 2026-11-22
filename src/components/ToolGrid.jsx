import ToolCard from './ToolCard.jsx'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  empty: {
    fr: 'Aucun outil n’est disponible dans cette catégorie.',
    en: 'No tool is available in this category.',
  },
}

// Grille des outils documentés, filtrée selon la catégorie active.
export default function ToolGrid({ tools, category }) {
  const { t } = useLocale()
  const visibleTools = category === 'all' ? tools : tools.filter((tool) => tool.category === category)

  return (
    <div id="tools-grid" role="tabpanel" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleTools.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
          {t(TEXT.empty)}
        </p>
      ) : (
        visibleTools.map((tool) => <ToolCard key={tool.tool} tool={tool} />)
      )}
    </div>
  )
}
