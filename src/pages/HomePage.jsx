import { Link } from 'react-router-dom'

// Vue d'accueil : présentation concise et accès directs aux espaces principaux.
export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br     p-8 text-center sm:p-16 sm:text-left">

        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full " />
        <div className="relative mx-auto max-w-3xl">
          {/* <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            NanoFile
          </span> */}
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-slate-900 sm:mt-5 sm:text-5xl">
            Vos fichiers, traités simplement.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:mt-5 sm:text-xl">
            Compressez, convertissez, organisez et sécurisez vos fichiers en quelques clics.
            Une interface claire, sans option superflue.
          </p>

          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-medium  text-slate-600  sm:text-sm">

            <li>Aucun nom ni contenu transmis aux analytics.</li>
            <li>Résultat téléchargeable dès la fin.</li>
            <li>JPG, JPEG, PNG, WEBP, BMP, TIF, TIFF, vidéos, PDF, Word, Excel, PowerPoint, ODF.</li>
          </ul>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              to="/catalogue"
              className="rounded-lg bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Découvrir les outils
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Espace utilisateur
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Zone de traitement</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Compresser</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">images, vidéos, PDF, Word, Excel, PowerPoint, ODF</p>
          </div>
          <Link
            to="/tools/compress"
            className="self-center rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto"
          >
            Ouvrir l’outil
          </Link>
        </div>

        <Link
          to="/tools/compress"
          className="mt-5 flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-brand-surface/60 p-5 text-center transition hover:border-sky-400 hover:bg-brand-surface sm:mt-6 sm:min-h-48 sm:p-8"
        >
          <span className="text-sm font-semibold text-slate-900 sm:text-base">Déposez vos fichiers ici</span>
          <span className="mt-2 text-xs text-slate-500 sm:text-sm">ou</span>
          <span className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white">
            Choisir des fichiers
          </span>
          <span className="mt-4 text-[11px] leading-relaxed text-slate-500 sm:mt-5 sm:text-xs">
            Formats acceptés : images, vidéos, PDF, Word, Excel, PowerPoint, ODF
          </span>
        </Link>

        <div className="mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">Aucun fichier choisi</p>
          <a href="#comment-ca-marche" className="text-xs font-semibold text-sky-700 hover:underline">
            01 / Comment ça marche
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <Link
          to="/catalogue"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Catalogue</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Choisir un outil</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Parcourez les outils par catégorie et lancez le traitement adapté à votre fichier.
          </p>
        </Link>

        <Link
          to="/studio"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Studio</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Générer un CV ou une lettre</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Utilisez les modèles, le rendu et la réécriture assistée documentés par l’API.
          </p>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-6 sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Espace utilisateur</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Suivre son activité</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Consultez l’état du service, votre quota, vos documents et l’historique des jobs.
          </p>
        </Link>
      </div>

      <div id="comment-ca-marche" className="mt-12 scroll-mt-24 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center sm:mt-16 sm:p-10 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Comment ça marche</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Trois étapes, sans complication.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">
          Du dépôt au téléchargement, chaque traitement suit le même parcours clair.
        </p>

        <ol className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Déposez vos fichiers</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Sélectionnez vos images, vidéos ou documents depuis votre appareil.
            </p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Choisissez le traitement</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Compressez, convertissez, organisez ou sécurisez le fichier voulu.
            </p>
          </li>

          <li className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 sm:text-left">
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

      <div className="mt-12 text-center sm:mt-16 sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Questions fréquentes</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Vos questions, nos réponses.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0">
          Les points essentiels avant de lancer un traitement sur NanoFile.
        </p>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-2 md:items-start">
          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" open>
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Sur quoi repose l’interface ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              L’interface est construite avec React et Vite, stylée avec Tailwind CSS. Les appels HTTP sont centralisés pour garder un comportement identique sur tous les outils.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Comment se déroule un traitement ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Le front crée un job, suit son statut à intervalles réguliers, puis télécharge le résultat dès que le traitement est terminé.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Mes fichiers sont-ils conservés dans le navigateur ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Non. Le navigateur conserve seulement un identifiant anonyme pour le suivi. Les fichiers sont envoyés au service de traitement et le résultat est récupéré sous forme de fichier téléchargeable.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Comment sont gérés les quotas et les erreurs ?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Le quota est affiché dans l’espace utilisateur. Les erreurs de validation, de quota ou de résultat expiré sont traduites en messages lisibles directement dans l’interface.
            </p>
          </details>

          <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
