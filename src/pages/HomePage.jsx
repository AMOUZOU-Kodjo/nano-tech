import { useState } from 'react'
import CategoryTabs from '@/components/CategoryTabs.jsx'
import HealthStatus from '@/components/HealthStatus.jsx'
import MeStatus from '@/components/MeStatus.jsx'
import ToolGrid from '@/components/ToolGrid.jsx'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'

// Vue d'accueil : catalogue des outils documentés, puis statut API et compte.
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (

    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-medium text-sky-600">Outils NanoFile</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Tous les outils pour vos fichiers, au même endroit.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Compressez, convertissez, organisez et sécurisez vos fichiers avec les traitements
          disponibles dans l’API NanoFile.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Explorer les outils</h2>
        <div className="mt-4">
          <CategoryTabs
            categories={TOOL_CATEGORIES}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
        <ToolGrid tools={TOOLS} category={activeCategory} />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <HealthStatus />
        <MeStatus />
      </div>
    </section>
  )
}
