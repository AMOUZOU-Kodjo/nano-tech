import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'

export default function LocaleToggle({ showLabel = false }) {
  const { locale, toggleLocale, t } = useLocale()
  const nextLocale = locale === 'fr' ? 'en' : 'fr'
  const label = t(
    nextLocale === 'en' ? MESSAGES.locale.switchToEnglish : MESSAGES.locale.switchToFrench,
  )

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
        showLabel ? 'w-full px-3 text-sm font-medium' : 'w-10'
      }`}
    >
      <span aria-hidden="true" className="text-xs font-bold uppercase">
        {locale}
      </span>
      {showLabel && <span>{t(MESSAGES.locale.current)}</span>}
    </button>
  )
}
