import { Link } from 'react-router-dom'

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
            Compressez, convertissez, organisez et sécurisez vos fichiers en quelques clics.
            Une interface claire, sans option superflue.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
            <li>Aucun nom ni contenu transmis aux analytics.</li>
            <li>Résultat téléchargeable dès la fin.</li>
            <li>JPG, JPEG, PNG, WEBP, BMP, TIF, TIFF, vidéos, PDF, Word, Excel, PowerPoint, ODF.</li>
          </ul>

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
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Zone de traitement</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Compresser</h2>
            <p className="mt-2 text-sm text-slate-600">images, vidéos, PDF, Word, Excel, PowerPoint, ODF</p>
          </div>
          <Link
            to="/tools/compress"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ouvrir l’outil
          </Link>
        </div>

        <Link
          to="/tools/compress"
          className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 p-8 text-center transition hover:border-sky-400 hover:bg-sky-50"
        >
          <span className="text-base font-semibold text-slate-900">Déposez vos fichiers ici</span>
          <span className="mt-2 text-sm text-slate-500">ou</span>
          <span className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white">
            Choisir des fichiers
          </span>
          <span className="mt-5 text-xs text-slate-500">
            Formats acceptés : images, vidéos, PDF, Word, Excel, PowerPoint, ODF
          </span>
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Aucun fichier choisi</p>
          <a href="#comment-ca-marche" className="text-xs font-semibold text-sky-700 hover:underline">
            01 / Comment ça marche
          </a>
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

      <div id="comment-ca-marche" className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Comment ça marche</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Trois étapes, sans complication.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Du dépôt au téléchargement, chaque traitement suit le même parcours clair.
        </p>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Déposez vos fichiers</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Sélectionnez vos images, vidéos ou documents depuis votre appareil.
            </p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Choisissez le traitement</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Compressez, convertissez, organisez ou sécurisez le fichier voulu.
            </p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              3
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Téléchargez le résultat</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Suivez l’avancement puis récupérez le fichier dès la fin du traitement.
            </p>
          </li>
        </ol>
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Questions fréquentes</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Vos questions, nos réponses.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Les points essentiels avant de lancer un traitement sur NanoFile.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 md:items-start">
          <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" open>
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Sur quoi repose l’interface ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              L’interface est construite avec React et Vite, stylée avec Tailwind CSS. Les appels HTTP sont centralisés pour garder un comportement identique sur tous les outils.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Comment se déroule un traitement ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Le front crée un job, suit son statut à intervalles réguliers, puis télécharge le résultat dès que le traitement est terminé.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Mes fichiers sont-ils conservés dans le navigateur ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Non. Le navigateur conserve seulement un identifiant anonyme pour le suivi. Les fichiers sont envoyés au service de traitement et le résultat est récupéré sous forme de fichier téléchargeable.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Comment sont gérés les quotas et les erreurs ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Le quota est affiché dans l’espace utilisateur. Les erreurs de validation, de quota ou de résultat expiré sont traduites en messages lisibles directement dans l’interface.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Faut-il créer un compte ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Non. Vous pouvez lancer un traitement sans compte dans la limite du quota invité. Un compte permet ensuite de retrouver vos documents et l’historique de vos jobs.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}
