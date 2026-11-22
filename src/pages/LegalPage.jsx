import { Link } from 'react-router-dom'
import { MESSAGES } from '@/i18n/messages.js'
import { useLocale } from '@/hooks/useLocale.js'

// Contenus statiques : le backend ne fournit pas leur texte, seule la version CGU est documentée.
const CONTENT = {
  terms: {
    title: MESSAGES.legal.termsTitle,
    subtitle: MESSAGES.legal.termsSubtitle,
    intro: MESSAGES.legal.termsIntro,
    sections: [
      {
        title: { fr: 'Objet du service', en: 'Purpose of the service' },
        paragraphs: [
          {
            fr: 'NanoFile permet de compresser, convertir, organiser et protéger des fichiers depuis un navigateur. Le service est accessible en ligne sans installation préalable.',
            en: 'NanoFile lets you compress, convert, organize and protect files from a browser. The service is available online without any prior installation.',
          },
          {
            fr: 'L’utilisation est libre dans la limite du quota invité. Un compte permet notamment de retrouver ses documents, son historique de traitements et ses informations de facturation.',
            en: 'Use is free within the guest quota. An account lets you find your documents, processing history and billing information.',
          },
        ],
      },
      {
        title: { fr: 'Accès et création de compte', en: 'Access and account creation' },
        paragraphs: [
          {
            fr: 'La création de compte nécessite une adresse email valide. L’acceptation des présentes conditions est explicite et la case correspondante n’est jamais pré-cochée.',
            en: 'Creating an account requires a valid email address. Acceptance of these terms is explicit and the corresponding checkbox is never pre-checked.',
          },
          {
            fr: 'L’option d’abonnement aux actualités est séparée et facultative. Vous êtes responsable de la confidentialité de vos identifiants et des activités réalisées depuis votre compte.',
            en: 'The newsletter option is separate and optional. You are responsible for the confidentiality of your credentials and for activities carried out from your account.',
          },
        ],
      },
      {
        title: { fr: 'Fichiers et traitements', en: 'Files and processing' },
        paragraphs: [
          {
            fr: 'Vous conservez la propriété de vos fichiers. Vous garantissez disposer des droits nécessaires pour les traiter et vous engagez à ne pas transmettre de contenus illicites ou dangereux.',
            en: 'You retain ownership of your files. You guarantee that you have the rights needed to process them and agree not to transmit unlawful or dangerous content.',
          },
          {
            fr: 'Les fichiers sont envoyés à l’API NanoFile pour le traitement demandé. Les résultats restent disponibles temporairement selon les durées définies par le service.',
            en: 'Files are sent to the NanoFile API for the requested processing. Results remain available temporarily according to the periods defined by the service.',
          },
        ],
      },
      {
        title: { fr: 'Quotas et facturation', en: 'Quotas and billing' },
        paragraphs: [
          {
            fr: 'Le quota invité est limité. Les offres payantes, lorsqu’elles sont souscrites, sont facturées via Stripe selon les conditions affichées au moment du paiement.',
            en: 'The guest quota is limited. Paid plans, when purchased, are billed through Stripe according to the terms shown at checkout.',
          },
          {
            fr: 'NanoFile peut ajuster les limites techniques afin de préserver la disponibilité et la sécurité du service.',
            en: 'NanoFile may adjust technical limits to preserve service availability and security.',
          },
        ],
      },
      {
        title: { fr: 'Utilisations interdites', en: 'Prohibited uses' },
        items: [
          {
            fr: 'Tenter de contourner les quotas, les limitations techniques ou les mécanismes d’authentification.',
            en: 'Attempting to bypass quotas, technical limits or authentication mechanisms.',
          },
          {
            fr: 'Transmettre des fichiers contenant des logiciels malveillants ou des contenus illicites.',
            en: 'Uploading files containing malware or unlawful content.',
          },
          {
            fr: 'Surcharger volontairement le service ou perturber son fonctionnement.',
            en: 'Deliberately overloading the service or disrupting its operation.',
          },
          {
            fr: 'Usurper l’identité d’un tiers ou utiliser un compte qui ne vous appartient pas.',
            en: 'Impersonating a third party or using an account that does not belong to you.',
          },
        ],
      },
      {
        title: { fr: 'Disponibilité et responsabilité', en: 'Availability and liability' },
        paragraphs: [
          {
            fr: 'Le service est fourni dans le cadre des moyens techniques disponibles. Il est recommandé de conserver une copie de vos fichiers originaux.',
            en: 'The service is provided within the available technical resources. Keeping a copy of your original files is recommended.',
          },
          {
            fr: 'NanoFile ne peut être tenue responsable d’une perte de données résultant d’une suppression effectuée par l’utilisateur ou d’une utilisation contraire aux présentes conditions.',
            en: 'NanoFile cannot be held liable for data loss resulting from a deletion performed by the user or from use contrary to these terms.',
          },
        ],
      },
      {
        title: { fr: 'Évolution des conditions', en: 'Changes to the terms' },
        paragraphs: [
          {
            fr: 'La présente version est datée de 2026-11. Une nouvelle version sera publiée en cas de modification des conditions applicables.',
            en: 'This version is dated 2026-11. A new version will be published if the applicable terms change.',
          },
        ],
      },
    ],
  },
  privacy: {
    title: MESSAGES.legal.privacyTitle,
    subtitle: MESSAGES.legal.privacySubtitle,
    intro: MESSAGES.legal.privacyIntro,
    sections: [
      {
        title: { fr: 'Responsable du traitement', en: 'Data controller' },
        paragraphs: [
          {
            fr: 'Responsable du traitement : [À compléter — dénomination, forme juridique, adresse et email de contact].',
            en: 'Data controller: [To complete — name, legal form, address and contact email].',
          },
          {
            fr: 'Pour toute question relative à vos données personnelles : [À compléter].',
            en: 'For any question about your personal data: [To complete].',
          },
        ],
      },
      {
        title: { fr: 'Données traitées', en: 'Data processed' },
        items: [
          {
            fr: 'Données de compte : adresse email, nom, prénom, profession et préférences renseignées.',
            en: 'Account data: email address, first name, last name, profession and preferences provided.',
          },
          {
            fr: 'Données de traitement : fichiers transmis, options choisies, statut des jobs et résultats obtenus.',
            en: 'Processing data: uploaded files, selected options, job status and results obtained.',
          },
          {
            fr: 'Données techniques : identifiant anonyme, événements d’utilisation et journaux nécessaires à la sécurité.',
            en: 'Technical data: anonymous identifier, usage events and logs required for security.',
          },
          {
            fr: 'Données de facturation : informations nécessaires à la commande, traitées avec Stripe.',
            en: 'Billing data: information needed for the order, processed with Stripe.',
          },
        ],
      },
      {
        title: { fr: 'Finalités des traitements', en: 'Purposes of processing' },
        paragraphs: [
          {
            fr: 'Les données sont utilisées pour fournir les traitements demandés, authentifier les comptes, appliquer les quotas, conserver l’historique et assurer le support.',
            en: 'Data is used to provide requested processing, authenticate accounts, apply quotas, keep history and provide support.',
          },
          {
            fr: 'Certaines données techniques servent à mesurer l’usage du service et à prévenir les abus.',
            en: 'Some technical data is used to measure service usage and prevent abuse.',
          },
          {
            fr: 'Les communications marketing ne sont envoyées qu’aux comptes ayant coché l’option marketing_opt_in.',
            en: 'Marketing communications are only sent to accounts that opted in via marketing_opt_in.',
          },
        ],
      },
      {
        title: { fr: 'Bases légales', en: 'Legal bases' },
        items: [
          {
            fr: 'Exécution du contrat pour les traitements de fichiers, les comptes et la facturation.',
            en: 'Contract performance for file processing, accounts and billing.',
          },
          {
            fr: 'Intérêt légitime pour la sécurité du service et la prévention des abus.',
            en: 'Legitimate interest for service security and abuse prevention.',
          },
          {
            fr: 'Consentement pour les communications marketing et les stockages non essentiels.',
            en: 'Consent for marketing communications and non-essential storage.',
          },
        ],
      },
      {
        title: { fr: 'Durées de conservation', en: 'Retention periods' },
        paragraphs: [
          {
            fr: 'Les données sont conservées tant que le compte est actif, puis pendant les durées imposées par les obligations légales et les délais techniques de suppression.',
            en: 'Data is kept while the account is active, then for periods required by legal obligations and technical deletion delays.',
          },
          {
            fr: 'Les fichiers et résultats sont conservés le temps nécessaire au traitement et au téléchargement. Les durées exactes doivent être confirmées avec la configuration de l’API : [À compléter].',
            en: 'Files and results are kept as long as needed for processing and download. Exact periods must be confirmed with the API configuration: [To complete].',
          },
          {
            fr: 'Les journaux techniques sont conservés pour une durée limitée, à préciser : [À compléter].',
            en: 'Technical logs are kept for a limited period, to be specified: [To complete].',
          },
        ],
      },
      {
        title: { fr: 'Destinataires des données', en: 'Data recipients' },
        paragraphs: [
          {
            fr: 'Les prestataires techniques participant à l’hébergement, à la base de données et au paiement peuvent traiter certaines données pour le compte de NanoFile.',
            en: 'Technical providers involved in hosting, the database and payments may process some data on behalf of NanoFile.',
          },
          {
            fr: 'Stripe intervient pour les paiements. Google intervient uniquement si vous choisissez la connexion avec un compte Google.',
            en: 'Stripe handles payments. Google is involved only if you choose to sign in with a Google account.',
          },
        ],
      },
      {
        title: { fr: 'Vos droits', en: 'Your rights' },
        paragraphs: [
          {
            fr: 'Vous pouvez consulter, corriger, supprimer ou exporter vos données depuis la page /account, ou en adressant une demande à [À compléter].',
            en: 'You can access, correct, delete or export your data from /account, or send a request to [To complete].',
          },
          {
            fr: 'Vous pouvez vous désinscrire des communications marketing depuis votre compte ou via le lien présent dans chaque message.',
            en: 'You can unsubscribe from marketing communications from your account or via the link in each message.',
          },
          {
            fr: 'Vous pouvez introduire une réclamation auprès de l’autorité de protection des données compétente.',
            en: 'You can lodge a complaint with the competent data protection authority.',
          },
        ],
      },
    ],
  },
  cookies: {
    title: MESSAGES.legal.cookiesTitle,
    subtitle: MESSAGES.legal.cookiesSubtitle,
    intro: MESSAGES.legal.cookiesIntro,
    sections: [
      {
        title: { fr: 'Cookie de session', en: 'Session cookie' },
        paragraphs: [
          {
            fr: 'Le cookie nf_session est déposé après connexion. Il permet d’authentifier les requêtes et d’accéder aux données liées au compte.',
            en: 'The nf_session cookie is set after sign-in. It authenticates requests and grants access to account data.',
          },
          {
            fr: 'Il est utilisé uniquement à des fins d’authentification, avec les attributs HttpOnly et SameSite=Lax.',
            en: 'It is used only for authentication, with the HttpOnly and SameSite=Lax attributes.',
          },
        ],
      },
      {
        title: { fr: 'Stockage local', en: 'Local storage' },
        paragraphs: [
          {
            fr: 'La clé nanofile.anon_id identifie un visiteur anonyme afin de lui appliquer un quota et de retrouver ses traitements en cours.',
            en: 'The nanofile.anon_id key identifies a guest visitor so a quota can be applied and ongoing processing retrieved.',
          },
          {
            fr: 'La clé nanofile.theme mémorise votre préférence d’affichage : clair, sombre ou système.',
            en: 'The nanofile.theme key stores your display preference: light, dark or system.',
          },
        ],
      },
      {
        title: { fr: 'Services tiers', en: 'Third-party services' },
        paragraphs: [
          {
            fr: 'Stripe peut déposer des cookies nécessaires à la sécurité du paiement sur son propre domaine lors d’un achat.',
            en: 'Stripe may set cookies required for payment security on its own domain during a purchase.',
          },
          {
            fr: 'NanoFile ne dépose pas de cookie publicitaire et n’utilise pas ces données à des fins de publicité ciblée.',
            en: 'NanoFile does not set advertising cookies and does not use this data for targeted advertising.',
          },
        ],
      },
      {
        title: { fr: 'Gestion de vos préférences', en: 'Managing your preferences' },
        paragraphs: [
          {
            fr: 'Vous pouvez supprimer ces données depuis les paramètres de votre navigateur.',
            en: 'You can delete this data from your browser settings.',
          },
          {
            fr: 'Supprimer nanofile.anon_id réinitialise l’historique et le quota associés à la session invité.',
            en: 'Deleting nanofile.anon_id resets the history and quota associated with the guest session.',
          },
        ],
      },
    ],
  },
  legal: {
    title: MESSAGES.legal.legalTitle,
    subtitle: MESSAGES.legal.legalSubtitle,
    intro: MESSAGES.legal.legalIntro,
    sections: [
      {
        title: { fr: 'Éditeur du site', en: 'Website publisher' },
        paragraphs: [
          { fr: 'Dénomination : [À compléter].', en: 'Name: [To complete].' },
          { fr: 'Forme juridique : [À compléter].', en: 'Legal form: [To complete].' },
          { fr: 'Adresse : [À compléter].', en: 'Address: [To complete].' },
          { fr: 'Email de contact : [À compléter].', en: 'Contact email: [To complete].' },
        ],
      },
      {
        title: { fr: 'Direction de la publication', en: 'Publication director' },
        paragraphs: [
          {
            fr: 'Directeur de la publication : [À compléter].',
            en: 'Publication director: [To complete].',
          },
        ],
      },
      {
        title: { fr: 'Hébergement et infrastructure', en: 'Hosting and infrastructure' },
        paragraphs: [
          {
            fr: 'Hébergement du site et de l’API : [À compléter].',
            en: 'Website and API hosting: [To complete].',
          },
          {
            fr: 'Base de données : Supabase PostgreSQL, selon la configuration documentée du service.',
            en: 'Database: Supabase PostgreSQL, according to the documented service configuration.',
          },
        ],
      },
      {
        title: { fr: 'Données personnelles', en: 'Personal data' },
        paragraphs: [
          {
            fr: 'Les informations relatives à la collecte et au traitement des données sont décrites dans la politique de confidentialité.',
            en: 'Information about data collection and processing is described in the privacy policy.',
          },
          {
            fr: 'Délégué à la protection des données : [À compléter — ou « non désigné », à valider].',
            en: 'Data protection officer: [To complete — or “not appointed”, to be confirmed].',
          },
        ],
      },
      {
        title: { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
        paragraphs: [
          {
            fr: 'Le nom NanoFile, son logo, son interface et ses contenus sont protégés. Toute reproduction ou utilisation non autorisée est interdite.',
            en: 'The NanoFile name, logo, interface and content are protected. Any unauthorized reproduction or use is prohibited.',
          },
        ],
      },
      {
        title: { fr: 'Contact et litiges', en: 'Contact and disputes' },
        paragraphs: [
          {
            fr: 'Pour toute demande ou réclamation : [À compléter].',
            en: 'For any request or complaint: [To complete].',
          },
          {
            fr: 'Les règles applicables en cas de litige sont à compléter selon le droit et le lieu de juridiction de l’éditeur.',
            en: 'The rules applicable to disputes must be completed according to the publisher’s applicable law and jurisdiction.',
          },
        ],
      },
    ],
  },
}

function LegalSection({ title, paragraphs = [], items = [] }) {
  const { t } = useLocale()

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">{t(title)}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{t(paragraph)}</p>
        ))}
        {items.length > 0 && (
          <ul className="list-disc space-y-2 pl-5">
            {items.map((item, index) => (
              <li key={index}>{t(item)}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

// Page générique pour les textes légaux et statiques hébergés par le front.
export default function LegalPage({ kind }) {
  const { t } = useLocale()
  const content = CONTENT[kind] ?? CONTENT.legal

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-medium text-brand">{t(content.subtitle)}</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">{t(content.title)}</h1>
      <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100">
        {t(MESSAGES.legal.notice)}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-ink-soft">{t(content.intro)}</p>

      <div className="mt-8 space-y-5">
        {content.sections.map((section) => (
          <LegalSection key={section.title.fr} {...section} />
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-faint">{t(MESSAGES.legal.lastUpdated)}</p>
      <Link to="/" className="mt-4 inline-block text-sm text-brand hover:text-brand-soft">
        {t(MESSAGES.common.backHome)}
      </Link>
    </section>
  )
}
