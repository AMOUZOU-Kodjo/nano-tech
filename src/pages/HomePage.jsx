import { Link } from 'react-router-dom'
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools.js'

// Calcule le nombre de catégories réelles, sans compter l'onglet "Tous".
const categoryCount = TOOL_CATEGORIES.filter((category) => category.id !== 'all').length

// Vue d'accueil : présentation concise et accès directs aux espaces principaux.
export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-8 shadow-sm sm:p-12">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
            NanoFile
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Vos fichiers, traités simplement.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Compressez, convertissez, organisez et sécurisez vos fichiers avec les traitements
            exposés par l’API NanoFile. Une interface claire, sans option superflue.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalogue"
              className="rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Découvrir les outils
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Espace utilisateur
            </Link>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Outils disponibles</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{TOOLS.length}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Catégories</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{categoryCount}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Service</dt>
              <dd className="mt-1 text-lg font-bold text-slate-900">API NanoFile</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <Link
          to="/catalogue"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Catalogue</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Choisir un outil</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Parcourez les outils par catégorie et lancez le traitement adapté à votre fichier.
          </p>
        </Link>

        <Link
          to="/studio"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Studio</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Générer un CV ou une lettre</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Utilisez les modèles, le rendu et la réécriture assistée documentés par l’API.
          </p>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Espace utilisateur</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Suivre son activité</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Consultez l’état du service, votre quota, vos documents et l’historique des jobs.
          </p>
        </Link>
      </div>
    </section>
  )
}
