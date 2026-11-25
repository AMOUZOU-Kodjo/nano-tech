import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useLocale } from '@/hooks/useLocale.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const TEXT = {
  title: { fr: 'Pages du PDF', en: 'PDF pages' },
  loading: { fr: 'Préparation des pages…', en: 'Preparing pages…' },
  error: { fr: 'Impossible de lire les pages de ce PDF.', en: 'Unable to read the pages of this PDF.' },
  page: { fr: 'Page', en: 'Page' },
  selectAll: { fr: 'Tout sélectionner', en: 'Select all' },
  clearAll: { fr: 'Tout désélectionner', en: 'Clear selection' },
  hint: {
    fr: 'Cliquez sur les pages à convertir. Sans sélection, toutes les pages seront traitées.',
    en: 'Click the pages to convert. With no selection, all pages will be processed.',
  },
}

// Génère les miniatures d'un PDF et renvoie les pages cochées sous forme de numéros.
export default function PdfPageSelector({ file, selectedPages, onChange, maxPages }) {
  const { t } = useLocale()
  const [thumbnails, setThumbnails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!file) return undefined

    let cancelled = false
    let document = null

    async function prepareThumbnails() {
      setLoading(true)
      setError(null)
      setThumbnails([])

      try {
        const data = await file.arrayBuffer()
        document = await pdfjsLib.getDocument({ data }).promise
        const count = Math.min(document.numPages, maxPages ?? document.numPages)
        const pages = []

        for (let number = 1; number <= count; number += 1) {
          const page = await document.getPage(number)
          const base = page.getViewport({ scale: 1 })
          const scale = Math.min(0.4, 180 / base.width)
          const viewport = page.getViewport({ scale })
          const canvas = window.document.createElement('canvas')
          canvas.width = Math.max(1, Math.floor(viewport.width))
          canvas.height = Math.max(1, Math.floor(viewport.height))

          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
          pages.push({ number, image: canvas.toDataURL('image/jpeg', 0.7) })
          if (cancelled) break
        }

        if (!cancelled) setThumbnails(pages)
      } catch {
        if (!cancelled) setError(t(TEXT.error))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    prepareThumbnails()

    return () => {
      cancelled = true
      document?.destroy()
    }
  }, [file, maxPages, t])

  if (!file) return null

  function togglePage(number) {
    const next = selectedPages.includes(number)
      ? selectedPages.filter((page) => page !== number)
      : [...selectedPages, number].sort((a, b) => a - b)
    onChange(next)
  }

  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900">{t(TEXT.title)}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(thumbnails.map((item) => item.number))}
            disabled={loading || thumbnails.length === 0}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {t(TEXT.selectAll)}
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={selectedPages.length === 0}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {t(TEXT.clearAll)}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">{t(TEXT.hint)}</p>
      {loading && <p className="mt-3 text-xs text-slate-500">{t(TEXT.loading)}</p>}
      {error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-3 flex flex-nowrap gap-3 overflow-x-auto pb-2">
          {thumbnails.map(({ number, image }) => {
            const selected = selectedPages.includes(number)
            return (
              <button
                key={number}
                type="button"
                onClick={() => togglePage(number)}
                aria-pressed={selected}
                className={`w-28 shrink-0 rounded-lg border p-2 text-left transition ${
                  selected
                    ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200'
                    : 'border-slate-200 bg-white hover:border-sky-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${t(TEXT.page)} ${number}`}
                  className="mx-auto block h-28 w-full rounded border border-slate-100 bg-white object-contain"
                />
                <span className={`mt-2 block text-center text-[11px] font-semibold ${selected ? 'text-sky-700' : 'text-slate-500'}`}>
                  {t(TEXT.page)} {number}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
