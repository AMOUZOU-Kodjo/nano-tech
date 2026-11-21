import { Link } from 'react-router-dom'
import {
  FiArchive,
  FiCamera,
  FiDroplet,
  FiFilePlus,
  FiFileText,
  FiImage,
  FiLayers,
  FiLock,
  FiMinimize2,
  FiPenTool,
  FiRefreshCw,
} from 'react-icons/fi'

// Icône associée à chaque outil documenté, avec un repli générique.
const TOOL_ICONS = {
  compress: FiMinimize2,
  pdf_to_word: FiFileText,
  pdf_to_images: FiImage,
  images_to_pdf: FiFilePlus,
  zip: FiArchive,
  pdf_merge: FiLayers,
  pdf_split: FiFileText,
  pdf_reorder: FiRefreshCw,
  pdf_sign: FiPenTool,
  pdf_protect: FiLock,
  pdf_watermark: FiDroplet,
  photo_id: FiCamera,
}

// Carte d'outil : lien vers la page générique correspondant à l'outil documenté.
export default function ToolCard({ tool }) {
  const Icon = TOOL_ICONS[tool.tool] ?? FiFileText

  return (
    <Link
      to={`/tools/${tool.tool}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-sky-600 ring-1 ring-slate-200"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">{tool.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
        </div>
      </div>
    </Link>
  )
}
