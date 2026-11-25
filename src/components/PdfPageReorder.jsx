import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useLocale } from '@/hooks/useLocale.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const TEXT = {
  title: { fr: 'Ordre des pages du PDF', en: 'PDF page order' },
  loading: { fr: 'Préparation des pages…', en: 'Preparing pages…' },
  error: { fr: 'Impossible de lire les pages de ce PDF.', en: 'Unable to read the pages of this PDF.' },
  page: { fr: 'Page', en: 'Page' },
  hint: {
    fr: 'Glissez les vignettes ou utilisez les flèches pour réorganiser les pages.',
    en: 'Drag thumbnails or use the arrows to reorder pages.',
  },
  moveLeft: { fr: 'Déplacer la page avant', en: 'Move page earlier' },
  moveRight: { fr: 'Déplacer la page après', en: 'Move page later' },
}

export default function PdfPageReorder({ file, onChange }) {
  const { t } = useLocale()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [draggedPage, setDraggedPage] = useState(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!file) return undefined

    let cancelled = false
    let document = null

    async function prepareThumbnails() {
      setLoading(true)
      setError(null)
      setPages([])

      try {
        const data = await file.arrayBuffer()
        document = await pdfjsLib.getDocument({ data }).promise
        const nextPages = []

        for (let number = 1; number <= document.numPages; number += 1) {
          const page = await document.getPage(number)
          const base = page.getViewport({ scale: 1 })
          const scale = Math.min(0.4, 180 / base.width)
          const viewport = page.getViewport({ scale })
          const canvas = window.document.createElement('canvas')
          canvas.width = Math.max(1, Math.floor(viewport.width))
          canvas.height = Math.max(1, Math.floor(viewport.height))

          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
          nextPages.push({ number, image: canvas.toDataURL('image/jpeg', 0.7) })
          if (cancelled) break
        }

        if (!cancelled) {
          setPages(nextPages)
          onChangeRef.current(nextPages.map((item) => item.number))
        }
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
  }, [file, t])

  if (!file) return null

  function commit(nextPages) {
    setPages(nextPages)
    onChangeRef.current(nextPages.map((item) => item.number))
  }

  function movePage(index, direction) {
    const target = index + direction
    if (target < 0 || target >= pages.length) return
    const nextPages = [...pages]
    ;[nextPages[index], nextPages[target]] = [nextPages[target], nextPages[index]]
    commit(nextPages)
  }

  function dropPage(targetNumber) {
    if (draggedPage === null || draggedPage === targetNumber) return
    const dragged = pages.find((item) => item.number === draggedPage)
    const nextPages = pages.filter((item) => item.number !== draggedPage)
    nextPages.splice(nextPages.findIndex((item) => item.number === targetNumber), 0, dragged)
    setDraggedPage(null)
    commit(nextPages)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-800">{t(TEXT.title)}</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{t(TEXT.hint)}</p>
      {loading && <p className="mt-3 text-xs text-slate-500">{t(TEXT.loading)}</p>}
      {error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-3 grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-2">
          {pages.map(({ number, image }, index) => (
            <div
              key={number}
              draggable
              onDragStart={() => setDraggedPage(number)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                dropPage(number)
              }}
              className={`w-28 shrink-0 rounded-lg border p-2 transition ${
                draggedPage === number
                  ? 'border-sky-500 bg-sky-50 opacity-60'
                  : 'border-slate-200 bg-white hover:border-sky-300'
              }`}
            >
              <img
                src={image}
                alt={`${t(TEXT.page)} ${number}`}
                className="mx-auto block h-24 w-full rounded border border-slate-100 bg-white object-contain"
              />
              <span className="mt-2 block text-center text-[11px] font-semibold text-slate-600">
                {t(TEXT.page)} {number}
              </span>
              <div className="mt-2 flex justify-center gap-1">
                <button
                  type="button"
                  onClick={() => movePage(index, -1)}
                  disabled={index === 0}
                  aria-label={t(TEXT.moveLeft)}
                  className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => movePage(index, 1)}
                  disabled={index === pages.length - 1}
                  aria-label={t(TEXT.moveRight)}
                  className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
