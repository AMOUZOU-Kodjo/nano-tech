import { useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryTabs from '@/components/CategoryTabs.jsx'
import ToolGrid from '@/components/ToolGrid.jsx'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'
import { useEnabledTools } from '@/hooks/useEnabledTools.js'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  catalog: { fr: 'Catalogue', en: 'Catalog' },
  title: { fr: 'Tous les outils NanoFile', en: 'All NanoFile tools' },
  subtitle: {
    fr: 'Sélectionnez une catégorie, puis ouvrez un outil pour lancer le traitement avec les options par défaut documentées par l’API.',
    en: 'Select a category, then open a tool to start processing with the default options documented by the API.',
  },
  dashboard: { fr: 'Voir l’espace utilisateur →', en: 'Go to user space →' },
  noTools: { fr: 'Aucun outil n’est actuellement disponible.', en: 'No tools are currently available.' },
}

// Page catalogue : filtre les outils documentés par famille d'usage.
export default function CataloguePage() {
  const { t } = useLocale()
  const { isEnabled } = useEnabledTools()
  const [activeCategory, setActiveCategory] = useState('all')

  // Les outils explicitement désactivés dans l'admin ne sont plus proposés au catalogue.
  const visibleTools = TOOLS.filter((tool) => isEnabled(tool.tool))
  const visibleCategories = TOOL_CATEGORIES.filter(
    (category) => category.id === 'all' || visibleTools.some((tool) => tool.category === category.id),
  )
  const effectiveCategory = visibleCategories.some((category) => category.id === activeCategory)
    ? activeCategory
    : 'all'

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-700">{t(TEXT.catalog)}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{t(TEXT.title)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            {t(TEXT.subtitle)}
          </p>
        </div>
        <Link to="/dashboard" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          {t(TEXT.dashboard)}
        </Link>
      </div>

      {visibleTools.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          {t(TEXT.noTools)}
        </p>
      ) : (
        <>
          <div className="mt-8">
            <CategoryTabs
              categories={visibleCategories}
              activeCategory={effectiveCategory}
              onChange={setActiveCategory}
            />
          </div>

          <ToolGrid tools={visibleTools} category={effectiveCategory} />
        </>
      )}
    </section>
  )
}
