import { Link } from 'react-router-dom'

// Contenus statiques : le backend ne fournit pas leur texte, seule la version CGU est documentée.
const CONTENT = {
  terms: {
    title: 'Conditions générales d’utilisation',
    subtitle: 'Version 2026-11',
    note: 'Le texte intégral des CGU doit être publié ici avant la mise en production.',
  },
  privacy: {
    title: 'Politique de confidentialité',
    subtitle: 'Données personnelles',
    note: 'Le texte intégral de la politique de confidentialité doit être publié ici.',
  },
  cookies: {
    title: 'Politique cookies',
    subtitle: 'Cookies et stockage local',
    note: 'Le texte intégral de la politique cookies doit être publié ici.',
  },
  legal: {
    title: 'Mentions légales',
    subtitle: 'Informations éditoriales',
    note: 'Les mentions légales complètes doivent être publiées ici.',
  },
}

// Page générique pour les textes légaux et statiques hébergés par le front.
export default function LegalPage({ kind }) {
  const content = CONTENT[kind] ?? CONTENT.legal

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-medium text-sky-600">{content.subtitle}</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{content.title}</h1>
      <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        {content.note}
      </p>
      <Link to="/" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
        Retour à l’accueil
      </Link>
    </section>
  )
}
