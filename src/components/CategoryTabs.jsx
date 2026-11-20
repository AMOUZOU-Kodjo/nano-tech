// Onglets de filtrage du catalogue ; chaque bouton contrôle la grille des outils.
export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div role="tablist" aria-label="Catégories d’outils" className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeCategory

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="tools-grid"
            onClick={() => onChange(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              isActive
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
