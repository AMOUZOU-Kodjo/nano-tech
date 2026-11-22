import { Link } from 'react-router-dom'

// Contenus statiques : le backend ne fournit pas leur texte, seule la version CGU est documentée.
const PROVISIONAL_NOTICE =
  'Version provisoire : ces textes servent de base de travail et doivent être validés juridiquement avant publication définitive.'

const CONTENT = {
  terms: {
    title: 'Conditions générales d’utilisation',
    subtitle: 'Version 2026-11',
    intro:
      'Les présentes conditions régissent l’utilisation du site et des outils NanoFile. Elles s’appliquent à tous les visiteurs, qu’ils utilisent le service en invité ou avec un compte.',
    sections: [
      {
        title: 'Objet du service',
        paragraphs: [
          'NanoFile permet de compresser, convertir, organiser et protéger des fichiers depuis un navigateur. Le service est accessible en ligne sans installation préalable.',
          'L’utilisation est libre dans la limite du quota invité. Un compte permet notamment de retrouver ses documents, son historique de traitements et ses informations de facturation.',
        ],
      },
      {
        title: 'Accès et création de compte',
        paragraphs: [
          'La création de compte nécessite une adresse email valide. L’acceptation des présentes conditions est explicite et la case correspondante n’est jamais pré-cochée.',
          'L’option d’abonnement aux actualités est séparée et facultative. Vous êtes responsable de la confidentialité de vos identifiants et des activités réalisées depuis votre compte.',
        ],
      },
      {
        title: 'Fichiers et traitements',
        paragraphs: [
          'Vous conservez la propriété de vos fichiers. Vous garantissez disposer des droits nécessaires pour les traiter et vous engagez à ne pas transmettre de contenus illicites ou dangereux.',
          'Les fichiers sont envoyés à l’API NanoFile pour le traitement demandé. Les résultats restent disponibles temporairement selon les durées définies par le service.',
        ],
      },
      {
        title: 'Quotas et facturation',
        paragraphs: [
          'Le quota invité est limité. Les offres payantes, lorsqu’elles sont souscrites, sont facturées via Stripe selon les conditions affichées au moment du paiement.',
          'NanoFile peut ajuster les limites techniques afin de préserver la disponibilité et la sécurité du service.',
        ],
      },
      {
        title: 'Utilisations interdites',
        items: [
          'Tenter de contourner les quotas, les limitations techniques ou les mécanismes d’authentification.',
          'Transmettre des fichiers contenant des logiciels malveillants ou des contenus illicites.',
          'Surcharger volontairement le service ou perturber son fonctionnement.',
          'Usurper l’identité d’un tiers ou utiliser un compte qui ne vous appartient pas.',
        ],
      },
      {
        title: 'Disponibilité et responsabilité',
        paragraphs: [
          'Le service est fourni dans le cadre des moyens techniques disponibles. Il est recommandé de conserver une copie de vos fichiers originaux.',
          'NanoFile ne peut être tenue responsable d’une perte de données résultant d’une suppression effectuée par l’utilisateur ou d’une utilisation contraire aux présentes conditions.',
        ],
      },
      {
        title: 'Évolution des conditions',
        paragraphs: [
          'La présente version est datée de 2026-11. Une nouvelle version sera publiée en cas de modification des conditions applicables.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    subtitle: 'Données personnelles',
    intro:
      'Cette politique explique quelles données sont traitées lorsque vous utilisez NanoFile, pourquoi elles le sont et quels droits vous pouvez exercer.',
    sections: [
      {
        title: 'Responsable du traitement',
        paragraphs: [
          'Responsable du traitement : [À compléter — dénomination, forme juridique, adresse et email de contact].',
          'Pour toute question relative à vos données personnelles : [À compléter].',
        ],
      },
      {
        title: 'Données traitées',
        items: [
          'Données de compte : adresse email, nom, prénom, profession et préférences renseignées.',
          'Données de traitement : fichiers transmis, options choisies, statut des jobs et résultats obtenus.',
          'Données techniques : identifiant anonyme, événements d’utilisation et journaux nécessaires à la sécurité.',
          'Données de facturation : informations nécessaires à la commande, traitées avec Stripe.',
        ],
      },
      {
        title: 'Finalités des traitements',
        paragraphs: [
          'Les données sont utilisées pour fournir les traitements demandés, authentifier les comptes, appliquer les quotas, conserver l’historique et assurer le support.',
          'Certaines données techniques servent à mesurer l’usage du service et à prévenir les abus.',
          'Les communications marketing ne sont envoyées qu’aux comptes ayant coché l’option marketing_opt_in.',
        ],
      },
      {
        title: 'Bases légales',
        items: [
          'Exécution du contrat pour les traitements de fichiers, les comptes et la facturation.',
          'Intérêt légitime pour la sécurité du service et la prévention des abus.',
          'Consentement pour les communications marketing et les stockages non essentiels.',
        ],
      },
      {
        title: 'Durées de conservation',
        paragraphs: [
          'Les données sont conservées tant que le compte est actif, puis pendant les durées imposées par les obligations légales et les délais techniques de suppression.',
          'Les fichiers et résultats sont conservés le temps nécessaire au traitement et au téléchargement. Les durées exactes doivent être confirmées avec la configuration de l’API : [À compléter].',
          'Les journaux techniques sont conservés pour une durée limitée, à préciser : [À compléter].',
        ],
      },
      {
        title: 'Destinataires des données',
        paragraphs: [
          'Les prestataires techniques participant à l’hébergement, à la base de données et au paiement peuvent traiter certaines données pour le compte de NanoFile.',
          'Stripe intervient pour les paiements. Google intervient uniquement si vous choisissez la connexion avec un compte Google.',
        ],
      },
      {
        title: 'Vos droits',
        paragraphs: [
          'Vous pouvez consulter, corriger, supprimer ou exporter vos données depuis la page /account, ou en adressant une demande à [À compléter].',
          'Vous pouvez vous désinscrire des communications marketing depuis votre compte ou via le lien présent dans chaque message.',
          'Vous pouvez introduire une réclamation auprès de l’autorité de protection des données compétente.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Politique cookies',
    subtitle: 'Cookies et stockage local',
    intro:
      'NanoFile utilise principalement des éléments nécessaires au fonctionnement du service. Les informations ci-dessous décrivent les cookies et données stockées dans votre navigateur.',
    sections: [
      {
        title: 'Cookie de session',
        paragraphs: [
          'Le cookie nf_session est déposé après connexion. Il permet d’authentifier les requêtes et d’accéder aux données liées au compte.',
          'Il est utilisé uniquement à des fins d’authentification, avec les attributs HttpOnly et SameSite=Lax.',
        ],
      },
      {
        title: 'Stockage local',
        paragraphs: [
          'La clé nanofile.anon_id identifie un visiteur anonyme afin de lui appliquer un quota et de retrouver ses traitements en cours.',
          'La clé nanofile.theme mémorise votre préférence d’affichage : clair, sombre ou système.',
        ],
      },
      {
        title: 'Services tiers',
        paragraphs: [
          'Stripe peut déposer des cookies nécessaires à la sécurité du paiement sur son propre domaine lors d’un achat.',
          'NanoFile ne dépose pas de cookie publicitaire et n’utilise pas ces données à des fins de publicité ciblée.',
        ],
      },
      {
        title: 'Gestion de vos préférences',
        paragraphs: [
          'Vous pouvez supprimer ces données depuis les paramètres de votre navigateur.',
          'Supprimer nanofile.anon_id réinitialise l’historique et le quota associés à la session invité.',
        ],
      },
    ],
  },
  legal: {
    title: 'Mentions légales',
    subtitle: 'Informations éditoriales',
    intro:
      'Les informations ci-dessous doivent être complétées avec les données officielles de l’éditeur avant publication définitive.',
    sections: [
      {
        title: 'Éditeur du site',
        paragraphs: [
          'Dénomination : [À compléter].',
          'Forme juridique : [À compléter].',
          'Adresse : [À compléter].',
          'Email de contact : [À compléter].',
        ],
      },
      {
        title: 'Direction de la publication',
        paragraphs: ['Directeur de la publication : [À compléter].'],
      },
      {
        title: 'Hébergement et infrastructure',
        paragraphs: [
          'Hébergement du site et de l’API : [À compléter].',
          'Base de données : Supabase PostgreSQL, selon la configuration documentée du service.',
        ],
      },
      {
        title: 'Données personnelles',
        paragraphs: [
          'Les informations relatives à la collecte et au traitement des données sont décrites dans la politique de confidentialité.',
          'Délégué à la protection des données : [À compléter — ou « non désigné », à valider].',
        ],
      },
      {
        title: 'Propriété intellectuelle',
        paragraphs: [
          'Le nom NanoFile, son logo, son interface et ses contenus sont protégés. Toute reproduction ou utilisation non autorisée est interdite.',
        ],
      },
      {
        title: 'Contact et litiges',
        paragraphs: [
          'Pour toute demande ou réclamation : [À compléter].',
          'Les règles applicables en cas de litige sont à compléter selon le droit et le lieu de juridiction de l’éditeur.',
        ],
      },
    ],
  },
}

function LegalSection({ title, paragraphs = [], items = [] }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {items.length > 0 && (
          <ul className="list-disc space-y-2 pl-5">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

// Page générique pour les textes légaux et statiques hébergés par le front.
export default function LegalPage({ kind }) {
  const content = CONTENT[kind] ?? CONTENT.legal

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-medium text-brand">{content.subtitle}</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">{content.title}</h1>
      <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100">
        {PROVISIONAL_NOTICE}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-ink-soft">{content.intro}</p>

      <div className="mt-8 space-y-5">
        {content.sections.map((section) => (
          <LegalSection key={section.title} {...section} />
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-faint">Dernière mise à jour : 22 novembre 2026.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-brand hover:text-brand-soft">
        Retour à l’accueil
      </Link>
    </section>
  )
}
