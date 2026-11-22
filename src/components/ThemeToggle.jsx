import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi'
import { useLocale } from '@/hooks/useLocale.js'
import { useTheme } from '@/hooks/useTheme.js'

const THEME_ICONS = {
  system: FiMonitor,
  light: FiSun,
  dark: FiMoon,
}

const THEME_LABELS = {
  system: { fr: 'système', en: 'system' },
  light: { fr: 'clair', en: 'light' },
  dark: { fr: 'sombre', en: 'dark' },
}

const NEXT_THEME = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

export default function ThemeToggle({ showLabel = false }) {
  const { theme, cycleTheme } = useTheme()
  const { locale, t } = useLocale()
  const Icon = THEME_ICONS[theme] ?? FiMonitor
  const label =
    locale === 'fr'
      ? `Thème ${t(THEME_LABELS[theme])}. Passer en mode ${t(THEME_LABELS[NEXT_THEME[theme]])}.`
      : `Theme ${t(THEME_LABELS[theme])}. Switch to ${t(THEME_LABELS[NEXT_THEME[theme]])} mode.`

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
        showLabel ? 'w-full px-3 text-sm font-medium' : 'w-10'
      }`}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
      {showLabel && <span>{locale === 'fr' ? 'Thème' : 'Theme'} : {t(THEME_LABELS[theme])}</span>}
    </button>
  )
}
