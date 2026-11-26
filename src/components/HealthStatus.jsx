import { useLocale } from '@/hooks/useLocale.js'
import { useHealth } from '@/hooks/useHealth.js'

const TEXT = {
  checking: { fr: 'Vérification de nos services…', en: 'Checking our services…' },
  unavailable: { fr: 'Nos services sont momentanément indisponibles.', en: 'Our services are temporarily unavailable.' },
  unavailableHint: { fr: 'Réessayez dans quelques instants.', en: 'Please try again shortly.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  degraded: { fr: 'Quelques services ralentissent', en: 'Some services are slowing down' },
  available: { fr: 'Tout fonctionne correctement', en: 'Everything is working' },
  degradedMessage: {
    fr: 'Certains outils peuvent être momentanément indisponibles.',
    en: 'Some tools may be temporarily unavailable.',
  },
  availableMessage: { fr: 'Vos outils sont accessibles.', en: 'Your tools are ready to use.' },
  refresh: { fr: 'Actualiser', en: 'Refresh' },
  capabilitiesTitle: { fr: 'Outils disponibles', en: 'Available tools' },
  availableFeature: { fr: 'Disponible', en: 'Available' },
  unavailableFeature: { fr: 'Indisponible', en: 'Unavailable' },
}

const CAPABILITY_LABELS = {
  ffmpeg: { fr: 'Vidéo et audio', en: 'Video and audio' },
  ghostscript: { fr: 'PDF avancés', en: 'Advanced PDFs' },
  libreoffice: { fr: 'Documents Office', en: 'Office documents' },
}

const CARD_CLASS = 'h-full rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'
const BUTTON_CLASS =
  'rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/60 transition hover:text-brand'

// Composant de santé : affiche la disponibilité des services et les outils activés.
export default function HealthStatus() {
  const { t } = useLocale()
  const { ok, capabilities, loading, error, reload } = useHealth()

  if (loading) {
    return (
      <section className={CARD_CLASS} role="status">
        <p className="text-sm text-ink-muted">{t(TEXT.checking)}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={CARD_CLASS} role="alert">
        <h2 className="text-xl font-semibold text-ink">{t(TEXT.unavailable)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.unavailableHint)}</p>
        <button type="button" onClick={reload} className={`${BUTTON_CLASS} mt-6`}>
          {t(TEXT.retry)}
        </button>
      </section>
    )
  }

  const degraded = ok !== true
  const capabilityEntries =
    capabilities && typeof capabilities === 'object' && !Array.isArray(capabilities)
      ? Object.entries(capabilities)
          .filter(([name]) => CAPABILITY_LABELS[name])
          .map(([name, enabled]) => ({ label: t(CAPABILITY_LABELS[name]), enabled: Boolean(enabled) }))
      : []

  return (
    <section className={CARD_CLASS}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${degraded ? 'bg-amber-500' : 'bg-emerald-500'}`}
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-semibold text-ink">{t(degraded ? TEXT.degraded : TEXT.available)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t(degraded ? TEXT.degradedMessage : TEXT.availableMessage)}
            </p>
          </div>
        </div>
        <button type="button" onClick={reload} className={BUTTON_CLASS}>
          {t(TEXT.refresh)}
        </button>
      </div>

      {capabilityEntries.length > 0 && (
        <div className="mt-7 border-t border-line/60 pt-6">
          <p className="text-sm font-semibold text-ink">{t(TEXT.capabilitiesTitle)}</p>
          <ul className="mt-4 divide-y divide-line/60">
            {capabilityEntries.map(({ label, enabled }) => (
              <li key={label} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-ink-muted">{label}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                    enabled
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900'
                      : 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900'
                  }`}
                >
                  {t(enabled ? TEXT.availableFeature : TEXT.unavailableFeature)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
