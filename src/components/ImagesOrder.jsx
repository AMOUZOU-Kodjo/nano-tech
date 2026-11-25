import { useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  title: { fr: 'Ordre des images', en: 'Image order' },
  hint: {
    fr: 'Glissez les vignettes ou utilisez les flèches pour définir l’ordre du PDF.',
    en: 'Drag thumbnails or use the arrows to set the PDF order.',
  },
  moveLeft: { fr: 'Déplacer l’image avant', en: 'Move image earlier' },
  moveRight: { fr: 'Déplacer l’image après', en: 'Move image later' },
}

export default function ImagesOrder({ files, previews, onChange, disabled }) {
  const { t } = useLocale()
  const [draggedIndex, setDraggedIndex] = useState(null)

  function commit(nextFiles) {
    setDraggedIndex(null)
    onChange(nextFiles)
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= files.length) return
    const nextFiles = [...files]
    ;[nextFiles[index], nextFiles[target]] = [nextFiles[target], nextFiles[index]]
    commit(nextFiles)
  }

  function drop(targetIndex) {
    if (draggedIndex === null || draggedIndex === targetIndex) return
    const nextFiles = [...files]
    const [dragged] = nextFiles.splice(draggedIndex, 1)
    nextFiles.splice(targetIndex, 0, dragged)
    commit(nextFiles)
  }

  if (files.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-4">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-800">{t(TEXT.title)}</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{t(TEXT.hint)}</p>
      <div className="mt-3 grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${file.size}-${file.lastModified}`}
            draggable={!disabled}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              drop(index)
            }}
            className={`w-32 shrink-0 rounded-lg border p-2 transition ${
              draggedIndex === index
                ? 'border-sky-500 bg-sky-50 opacity-60'
                : 'border-slate-200 bg-white hover:border-sky-300'
            }`}
          >
            {previews[index] ? (
              <img
                src={previews[index]}
                alt={file.name}
                className="h-24 w-full rounded border border-slate-100 bg-white object-cover"
              />
            ) : (
              <div className="grid h-24 place-items-center rounded border border-slate-100 bg-slate-50 text-[11px] text-slate-400">
                {file.name.split('.').pop()?.toUpperCase() ?? '—'}
              </div>
            )}
            <p className="mt-2 truncate text-[11px] font-semibold text-slate-600" title={file.name}>
              {file.name}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={disabled || index === 0}
                aria-label={t(TEXT.moveLeft)}
                className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={disabled || index === files.length - 1}
                aria-label={t(TEXT.moveRight)}
                className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
