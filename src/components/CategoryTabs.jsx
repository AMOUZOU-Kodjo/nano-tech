import { FiCamera, FiGrid, FiLayers, FiMinimize2, FiRefreshCw, FiShield } from 'react-icons/fi'
import { useLocale } from '@/hooks/useLocale.js'

// Icône associée à chaque catégorie affichée dans le catalogue.
const CATEGORY_ICONS = {
  all: FiGrid,
  optimize: FiMinimize2,
  convert: FiRefreshCw,
  organize: FiLayers,
  security: FiShield,
  photo: FiCamera,
}

const TEXT = {
  label: { fr: 'Catégories d’outils', en: 'Tool categories' },
}

// Onglets de filtrage du catalogue ; chaque bouton contrôle la grille des outils.
export default function CategoryTabs({ categories, activeCategory, onChange }) {
  const { locale, t } = useLocale()

  return (
    <div role="tablist" aria-label={t(TEXT.label)} className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeCategory
        const Icon = CATEGORY_ICONS[category.id] ?? FiGrid

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="tools-grid"
            onClick={() => onChange(category.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              isActive
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {locale === 'en' ? category.labelEn : category.label}
          </button>
        )
      })}
    </div>
  )
}
