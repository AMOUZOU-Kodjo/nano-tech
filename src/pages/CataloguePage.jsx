import { useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryTabs from '@/components/CategoryTabs.jsx'
import ToolGrid from '@/components/ToolGrid.jsx'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'

// Page catalogue : filtre les outils documentés par famille d'usage.
export default function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-700">Catalogue</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Tous les outils NanoFile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Sélectionnez une catégorie, puis ouvrez un outil pour lancer le traitement avec les
            options par défaut documentées par l’API.
          </p>
        </div>
        <Link to="/dashboard" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          Voir l’espace utilisateur →
        </Link>
      </div>

      <div className="mt-8">
        <CategoryTabs
          categories={TOOL_CATEGORIES}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <ToolGrid tools={TOOLS} category={activeCategory} />
    </section>
  )
}
