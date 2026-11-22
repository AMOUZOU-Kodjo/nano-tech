# Guide de maintenance — fichiers JSX (`.jsx`)

## Périmètre de ce document

Ce guide décrit **tous les fichiers `.jsx` du dépôt**, c’est-à-dire les 38 fichiers React visuels et-structurels du front NanoFile :

- le point d’entrée `src/main.jsx` ;
- la racine `src/App.jsx` ;
- les providers de `src/contexts/` ;
- les composants réutilisables de `src/components/` ;
- les vues principales de `src/pages/`.

Les fichiers `.js` sont volontairement exclus : ils sont décrits dans le guide frère `MAINTENANCE_JS.md`.

État analysé : commit `6f94e22` (`Correction du fil d’Ariane en anglais`), après la bascule bilingue français/anglais.

Ce guide est un outil de maintenance. Il résume le comportement actuel du code, les conventions à respecter et les points à surveiller lors d’une évolution. Il ne remplace pas `FRONTEND.md` ni l’OpenAPI officielle :

- OpenAPI : `https://api.nanofile.tech/openapi.json`
- Interface de l’OpenAPI : `https://api.nanofile.tech/docs#/`
- Complément produit : `FRONTEND.md`

---

## 1. Principes généraux

### 1.1 Rôle des couches

| Couche | Responsabilité | Ne doit pas faire |
|---|---|---|
| `src/api/*.js` | Appels HTTP purs, chemins, en-têtes, sérialisation, erreurs normalisées | Afficher de l’interface ou stocker de l’état React |
| `src/hooks/*.js` | Logique métier, états React, callbacks, chargements et erreurs | Construire directement une requête HTTP ou inventer des champs |
| `src/contexts/*.jsx` | Fournir des états globaux aux composants | Contenir de la logique de présentation complexe |
| `src/components/*.jsx` | Composants visuels réutilisables | Appeler directement `fetch` ou inventer des endpoints |
| `src/pages/*.jsx` | Vues principales et orchestration de composants/hooks | Dupliquer la couche API ou contourner les hooks métier |
| `src/config/` et `src/i18n/` | Données statiques et traductions génériques | Dépendre du contexte React |

### 1.2 Règles de maintenance

- Modifier **un seul fichier par réponse** et demander validation avant de passer au suivant.
- Rédiger commentaires, messages et documentation en français.
- Ne jamais inventer de route, de champ, de paramètre ou d’option API.
- Ne pas déplacer un appel API dans un composant : les appels restent dans `src/api/` et sont pilotés par `src/hooks/`.
- Conserver le préfixe `/api` déjà contenu dans `VITE_API_URL`.
- Utiliser le préfixe relatif `/v1/...` pour les endpoints qui n’existent que dans `FRONTEND.md` ou dans l’OpenAPI `/api/v1`.
- Gérer les réponses `204` sans parsing JSON.
- Considérer un invité comme un état normal, jamais comme une erreur.
- Après modification de code : `npm run lint && npm run build`.
- Ne pas committer sans demande explicite.

### 1.3 Langue

La langue est gérée par `LocaleContext.jsx` :

- clé de persistance : `nanofile.locale` ;
- valeurs acceptées : `fr` et `en` ;
- repli : détection navigateur, puis `fr` ;
- fonction de traduction : `t({ fr, en })` ;
- `document.documentElement.lang` est mis à jour avec la locale active ;
- `src/api/client.js` lit la même clé pour construire `Accept-Language`.

Deux patterns coexistent dans les `.jsx` :

1. `MESSAGES.*` depuis `src/i18n/messages.js` pour les textes génériques ;
2. une table locale `TEXT` bilingue dans le fichier pour les textes propres à une page ou à un composant.

Une chaîne simple passée à `t()` n’est pas traduite : elle est renvoyée telle quelle.

### 1.4 Chargement et erreurs

Les hooks exposent généralement :

- `loading` ;
- `error` ;
- `data` ou des valeurs spécialisées ;
- une fonction d’action manuelle, parfois `reload`.

Les composants doivent continuer à afficher ces états. Beaucoup utilisent :

- `role="alert"` pour les erreurs ;
- `role="status"` pour les succès ;
- des boutons `disabled` pendant `loading` ;
- des libellés « Chargement… » traduits.

Plusieurs composants affichent `error.message` brut : ce message vient de `ApiError` et peut être technique ou en anglais. Ne pas le remplacer par un texte inventé ; eventuellement le traduire côté API/hook si le contrat le prévoit.

### 1.5 Navigation

Les routes sont centralisées dans `src/App.jsx`. Les `.jsx` utilisent :

- `Link` pour les liens internes ;
- `useNavigate()` pour les redirections après authentification ;
- `useParams()` pour `/tools/:tool` et `/d/:token` ;
- `useSearchParams()` pour les tokens de vérification/reset et le retour après vérification.

Le control-room est routé sur `/admin` mais n’est pas proposé dans la navigation publique.

---

## 2. Cartographie rapide

### 2.1 Entrée, racine et contexte

| Fichier | Rôle principal |
|---|---|
| `src/main.jsx` | Monte React, injecte le favicon, applique le CSS global |
| `src/App.jsx` | Providers, routeur, layout global, masquage du footer sur login/register |
| `src/contexts/MeContext.jsx` | Expose une seule instance de `useMe` à l’application |
| `src/contexts/LocaleContext.jsx` | Langue courante, persistance, `<html lang>`, fonction `t()` |

### 2.2 Composants

| Fichier | Rôle principal |
|---|---|
| `src/components/MeStatus.jsx` | Statut du compte et quota |
| `src/components/LogoutButton.jsx` | Bouton de déconnexion |
| `src/components/LocaleToggle.jsx` | Bascule FR/EN |
| `src/components/HealthStatus.jsx` | État de santé de l’API |
| `src/components/GoogleAuthButton.jsx` | Bouton Google Identity Services |
| `src/components/CvDataForm.jsx` | Éditeur contrôlé de données CV |
| `src/components/ChangePasswordForm.jsx` | Formulaire de changement de mot de passe |
| `src/components/CategoryTabs.jsx` | Onglets de catégories du catalogue |
| `src/components/ThemeToggle.jsx` | Cycle thème système/clair/sombre |
| `src/components/SiteHeader.jsx` | En-tête secondaire, actuellement non référencé |
| `src/components/SiteFooter.jsx` | Pied de page global |
| `src/components/Navbar.jsx` | Navigation desktop et mobile |
| `src/components/ToolGrid.jsx` | Grille d’outils filtrée par catégorie |
| `src/components/ToolCard.jsx` | Carte d’outil bilingue |
| `src/components/ToolRunner.jsx` | Lanceur d’outil brut, actuellement non référencé |

### 2.3 Pages

| Fichier | Route principale | Rôle principal |
|---|---|---|
| `src/pages/HomePage.jsx` | `/` | Accueil statique bilingue |
| `src/pages/CataloguePage.jsx` | `/catalogue` | Catalogue filtrable des outils |
| `src/pages/DashboardPage.jsx` | `/dashboard` | Statut API et statut du compte |
| `src/pages/AdminPage.jsx` | `/admin` | Control-room administratif |
| `src/pages/ToolPage.jsx` | `/tools/:tool` | Traitement de fichiers et suivi de job |
| `src/pages/LoginPage.jsx` | `/login` | Connexion email et Google |
| `src/pages/RegisterPage.jsx` | `/register` | Inscription email et Google |
| `src/pages/VerifyEmailPage.jsx` | `/auth/verify` | Vérification d’email depuis un lien |
| `src/pages/ForgotPasswordPage.jsx` | `/forgot-password` | Demande de lien de reset |
| `src/pages/ResetPasswordPage.jsx` | `/reset-password` | Nouveau mot de passe |
| `src/pages/ProfilePage.jsx` | `/profile` | Données personnelles et mot de passe |
| `src/pages/AccountPage.jsx` | `/account` | Quota, usage, RGPD et communication |
| `src/pages/DocumentsPage.jsx` | `/documents` | Gestion des documents |
| `src/pages/DocumentSharePage.jsx` | `/d/:token` | Téléchargement par jeton public |
| `src/pages/StudioPage.jsx` | `/studio` | Modèles, rendu CV/lettres et réécriture |
| `src/pages/JobsPage.jsx` | `/jobs` | Historique des jobs |
| `src/pages/BillingPage.jsx` | `/billing` | État de facturation et checkout |
| `src/pages/BillingReturnPage.jsx` | `/billing/success`, `/billing/cancel` | Retour Stripe |
| `src/pages/LegalPage.jsx` | `/terms`, `/privacy`, `/cookies`, `/legal` | Textes légaux statiques |

---

## 3. Entrée, racine et contexte

### `src/main.jsx`

**Rôle.** Point d’entrée React. Il crée dynamiquement le `<link rel="icon">` à partir du logo importé (`src/main.jsx:7-10`), puis monte `<App />` dans `#root` sous `StrictMode` (`src/main.jsx:12-16`).

**Imports notables.**

- `StrictMode` depuis React ;
- `createRoot` depuis `react-dom/client` ;
- `App` via l’alias `@` ;
- `../Logo NanoFile bleu et cyan.png` ;
- `@/styles/global.css`.

**Props, contexte et hooks.** Aucun. Les providers sont créés dans `App.jsx`.

**API et navigation.** Aucun appel, aucune route.

**À surveiller.**

- `StrictMode` provoque en développement une double exécution des effets des composants descendants.
- Le favicon est ajouté par effet de bord au chargement du module.
- Le chemin du logo contient des espaces et reste relatif à `src/`.
- Si `#root` est absent, `createRoot(document.getElementById('root'))` échouera.

---

### `src/App.jsx`

**Rôle.** Compose l’arbre global `LocaleProvider > MeProvider > BrowserRouter > AppLayout` (`src/App.jsx:78-87`). `AppLayout` affiche `Navbar`, le `<main>` routé et `SiteFooter`, sauf sur `/login` et `/register` (`AUTH_ROUTES`, `src/App.jsx:27`, `src/App.jsx:31`, `src/App.jsx:72`). Il gère aussi le retour en haut de page ou le défilement vers un hash après navigation (`src/App.jsx:33-40`).

**Imports notables.**

- `useEffect` ;
- `BrowserRouter`, `Route`, `Routes`, `useLocation` ;
- `LocaleProvider`, `MeProvider` ;
- `Navbar`, `SiteFooter` ;
- les 19 pages importées explicitement.

**Routes exactes.**

- `/` → `HomePage`
- `/catalogue` → `CataloguePage`
- `/dashboard` → `DashboardPage`
- `/admin` → `AdminPage`
- `/tools/:tool` → `ToolPage`
- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/auth/verify` → `VerifyEmailPage`
- `/profile` → `ProfilePage`
- `/account` → `AccountPage`
- `/documents` → `DocumentsPage`
- `/studio` → `StudioPage`
- `/jobs` → `JobsPage`
- `/billing` → `BillingPage`
- `/billing/success` → `BillingReturnPage success={true}`
- `/billing/cancel` → `BillingReturnPage success={false}`
- `/d/:token` → `DocumentSharePage`
- `/forgot-password` → `ForgotPasswordPage`
- `/reset-password` → `ResetPasswordPage`
- `/terms`, `/privacy`, `/cookies`, `/legal` → `LegalPage` avec `kind`
- `*` → `HomePage`

**Contexte et hooks.** `App` fournit `LocaleContext` et `MeContext`. `AppLayout` utilise seulement `useLocation()`. Il n’y a aucun état local et un seul `useEffect` dépendant de `[location.key, location.hash]`.

**API.** Aucun appel explicite. Indirectement, `MeProvider` déclenche `useMe` → `GET /me`.

**À surveiller.**

- `key={location.pathname}` sur `<main>` remonte la page à chaque changement de chemin et réinitialise les états locaux.
- Le masquage du footer teste uniquement `location.pathname`, donc `/login/` ne serait pas concerné.
- `location.hash.slice(1)` n’est pas décodé.
- `?.scrollIntoView()` évite une erreur si l’id du hash n’existe pas.
- `BrowserRouter` suppose une redirection SPA côté serveur.
- `/admin` est routé mais non accessible depuis la navigation publique.

---

### `src/contexts/MeContext.jsx`

**Rôle.** Définir `MeContext` avec `createContext(null)` (`src/contexts/MeContext.jsx:7`) et fournir une seule instance de `useMe` à tous les descendants via `MeProvider` (`src/contexts/MeContext.jsx:10-13`).

**Imports.** `createContext`, `useMe` depuis `@/hooks/useMe.js`.

**Props.** `children` uniquement.

**Contexte.** Crée `MeContext`, consommé via `useMeContext()`.

**État et API.** Aucun état local. Via `useMe`, le provider déclenche `GET /me` au montage. `reload` refait le même appel.

**Valeur exposée.** `user`, `quota`, `loading`, `error`, `reload`, `isGuest`.

**À surveiller.**

- La valeur `me` n’est pas mémoïsée : tout changement de `useMe` notifie tous les consommateurs.
- `useMe` considère `user: null` comme un invité.
- `eslint-disable-next-line react-refresh/only-export-components` est nécessaire à cause de l’export de contexte mélangé au composant.
- Le provider est placé hors de `BrowserRouter` dans `App.jsx`.
- En `StrictMode`, l’effet initial de `useMe` peut être lancé deux fois en développement.

---

### `src/contexts/LocaleContext.jsx`

**Rôle.** Source unique de vérité de la langue. Détecte la locale initiale, persiste le choix, synchronise `<html lang>`, réagit aux changements d’un autre onglet et fournit `t()` (`src/contexts/LocaleContext.jsx:3-110`).

**Imports.** `createContext`, `useCallback`, `useEffect`, `useMemo`, `useState`.

**Props.** `children`.

**État et hooks.**

- `useState(readInitialLocale)` → `locale` (`:56`).
- `useEffect([locale])` : écrit `document.documentElement.lang` et `localStorage['nanofile.locale']` (`:58-66`).
- `useEffect([])` : écoute `storage` et retire l’écoute au nettoyage (`:68-78`).
- `useCallback` : `setLocale`, `toggleLocale`, `t` (`:80-103`).
- `useMemo` : valeur `{ locale, setLocale, toggleLocale, t }` (`:105-108`).

**Détection.**

- Locales autorisées : `['fr', 'en']`.
- `normalizeLocale()` accepte uniquement `fr` et `en`.
- `detectBrowserLocale()` parcourt `navigator.languages`, puis `navigator.language`, teste les préfixes `fr` et `en`, avec repli `fr`.
- `readInitialLocale()` privilégie `localStorage['nanofile.locale']`.
- `t(value)` renvoie une chaîne telle quelle, `''` pour un non-objet, sinon `value[locale] ?? value.fr ?? Object.values(value)[0] ?? ''`.

**À surveiller.**

- Les accès à `localStorage` sont protégés par `try/catch`.
- `t('texte')` n’est pas traduit.
- Le listener `storage` ne filtre pas `event.key` : n’importe quelle clé stockée avec `'fr'` ou `'en'` peut changer la langue dans les autres onglets.
- `event.newValue === null` ne réinitialise pas la locale.
- La détection est dupliquée avec `src/api/client.js`.
- `'FR'` majuscule est rejeté par `normalizeLocale`.

---

## 4. Composants réutilisables

### `src/components/MeStatus.jsx`

**Rôle.** Afficher le statut du compte (`Invité` / `Connecté`) et soit la jauge de quota invité, soit les compteurs plan/crédits/essais/jobs/rendus/IA (`src/components/MeStatus.jsx:36-129`).

**Imports notables.** `useLocale`, `useMeContext`, table `TEXT` bilingue, composant interne `Stat`.

**Props.** Aucune pour `MeStatus` ; `Stat` reçoit `label` et `value`.

**Contexte.** `useLocale()` → `{ locale, t }` ; `useMeContext()` → `{ user, quota, loading, error, isGuest, reload }`.

**État et API.** Aucun état local. Appel indirect à `GET /me` via le contexte.

**Logique.**

- `loading` → section neutre.
- `error` → section rouge avec `error.message` et bouton « Réessayer ».
- `hasGuestQuota` exige `isGuest` **et** des valeurs numériques `limit`/`used`.
- `percent = 0` si `limit <= 0`.
- Le libellé « restants » / « remaining » est choisi directement avec `locale`.

**Accessibilité.** `role="progressbar"` avec `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` ; bouton de rechargement avec `aria-label` ; structure `<dl>/<dt>/<dd>`.

**À surveiller.**

- `error.message` est affiché brut et n’est pas traduit.
- Les paragraphes de chargement/erreur n’ont pas `role="status"`/`role="alert"`.
- `reload` est passé directement à `onClick`, mais `useMe.reload` ignore les arguments.
- Les libellés sont dupliqués localement au lieu d’utiliser `MESSAGES`.

---

### `src/components/LogoutButton.jsx`

**Rôle.** Bouton de déconnexion avec libellé d’attente et message d’erreur (`src/components/LogoutButton.jsx:10-31`).

**Imports.** `useLocale`, `useLogout`, table `TEXT`.

**Props.** `onSuccess` optionnel, transmis à `useLogout({ onSuccess })`.

**Contexte.** `useLocale()` → `{ t }`. Pas d’accès direct à `MeContext`.

**État et API.** Aucun état local. `useLogout` fournit `loading`, `error`, `logout`. L’action appelle `POST /auth/logout` ; une réponse `204` est renvoyée comme `null` par `apiFetch`.

**Affichage.** Bouton `disabled={loading}`, libellé d’attente, erreur dans un paragraphe `role="alert"`.

**À surveiller.**

- `useLogout` appelle `onSuccess?.()` sans attendre sa promesse.
- L’erreur reste affichée jusqu’à une nouvelle tentative ou un nouveau montage.
- Les textes sont dupliqués au lieu d’utiliser `MESSAGES.common.logout`.

---

### `src/components/LocaleToggle.jsx`

**Rôle.** Bouton FR/EN qui bascule la locale et dont le libellé accessible annonce la langue cible (`src/components/LocaleToggle.jsx:4-26`).

**Imports.** `MESSAGES`, `useLocale`.

**Props.** `showLabel = false`. Quand vrai, le bouton prend `w-full px-3 text-sm font-medium`, sinon `w-10`.

**Contexte.** `useLocale()` → `{ locale, toggleLocale, t }`.

**Logique.**

- `nextLocale = locale === 'fr' ? 'en' : 'fr'`.
- `aria-label` et `title` utilisent `MESSAGES.locale.switchToEnglish` ou `switchToFrench`.
- Le code affiché est `locale`, marqué `aria-hidden`.
- Le libellé visible optionnel vient de `MESSAGES.locale.current`.

**Accessibilité.** `aria-label`, `title`, `focus-visible`, `type="button"`.

**À surveiller.**

- Le libellé accessible décrit l’action alors que le texte visible montre la langue courante.
- Avec `showLabel`, `Français`/`English` peut sembler contredire l’`aria-label`.
- La largeur fixe `w-10` peut devenir insuffisante si le style change.

---

### `src/components/HealthStatus.jsx`

**Rôle.** Carte de santé de l’API avec états chargement/erreur, statut disponible/dégradé, capacités et bouton d’actualisation (`src/components/HealthStatus.jsx:21-90`).

**Imports.** `useLocale`, `useHealth`, table `TEXT`.

**Props.** Aucune.

**Contexte.** `useLocale()` → `{ t }`.

**État et API.** Aucun état local. `useHealth` expose `ok`, `capabilities`, `loading`, `error`, `reload`. L’appel indirect est `GET /health`.

**Logique.**

- chargement → section neutre ;
- erreur → section rouge avec bouton « Réessayer » ;
- `degraded = ok === false` ;
- les capacités sont affichées avec `oui`/`non` traduits.

**Accessibilité.** Pastille `aria-hidden`, structure `<dl>/<dt>/<dd>`, boutons `type="button"`.

**À surveiller.**

- Si `ok` vaut `null` sans erreur, le composant affiche « API disponible ».
- Les clés de `capabilities` ne sont pas traduites et leur ordre dépend de l’API.
- `error.message` est brut.
- `reload` reçoit l’événement de clic mais l’ignore.

---

### `src/components/GoogleAuthButton.jsx`

**Rôle.** Charger Google Identity Services, rendre le bouton Google et envoyer le credential reçu à l’API (`src/components/GoogleAuthButton.jsx:39-115`).

**Imports notables.** `useCallback`, `useEffect`, `useRef`, `useState`, `googleAuth` depuis `@/api/authApi.js`, `useLocale`.

**Props.**

- `termsAccepted = true`
- `marketingOptIn = false`
- `onSuccess`
- `onError`

**Contexte.** `useLocale()` → `{ locale, t }`.

**État.**

- `loading`, `localError`.
- refs `buttonRef`, `callbackRef`.
- `handleCredential` en `useCallback`.
- effet de synchronisation de `callbackRef`.
- effet principal d’initialisation Google.

**API.**

- Charge `https://accounts.google.com/gsi/client`.
- Crée le script avec `id = 'google-identity-services'`.
- Appelle `googleAuth()` → `POST /v1/auth/google` avec `credential`, `terms_accepted`, `marketing_opt_in`.
- Le rendu Google utilise `locale: locale === 'fr' ? 'fr' : 'en'`, `theme: 'outline'`, `size: 'large'`, `shape: 'pill'`, `text: 'continue_with'`, `width: 360`.

**Client ID.**

```js
GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  '223256695224-7vgdsrm6h2rjfhbj1qjku2m0o1j955n6.apps.googleusercontent.com'
```

**Accessibilité.** `aria-busy`, `role="alert"` ou `role="status"`, hauteur minimale `min-h-11`. Le bouton réel est généré par Google.

**À surveiller.**

- Ce composant appelle directement `googleAuth`, sans utiliser `useGoogleAuth`.
- Si le script existe déjà mais est chargé ou en échec, les listeners ajoutés après coup peuvent ne jamais se déclencher.
- Le nettoyage ne retire pas le script ni ses listeners.
- Un changement de locale relance `initialize`/`renderButton` dans le même conteneur.
- Le client ID intégré en repli rend `VITE_GOOGLE_CLIENT_ID` non strictement requis.
- Ne jamais journaliser le credential Google.

---

### `src/components/CvDataForm.jsx`

**Rôle.** Éditeur contrôlé de données CV : identité, résumé, expériences, formations, compétences, langues, projets, certifications et informations complémentaires (`src/components/CvDataForm.jsx:192-375`).

**Imports notables.** `useLocale`, constantes `EMPTY_CV_DATA`, `ARRAY_KEYS`, `TEXT`, composants internes `TextField`, `TextAreaField`, `StringListField`, `CheckboxField`, `ArraySection`.

**Props.**

- `value` : données CV ;
- `onChange` : callback de mise à jour.

**Contexte.** `useLocale()` → `{ t }` dans le composant principal et `ArraySection`.

**État et API.** Aucun `useState`, `useMemo`, `useEffect`, aucun appel API. `normalizeCvData(value)` est recalculée à chaque rendu (`:78-97`).

**Logique.**

- Le composant est entièrement piloté par le parent, notamment `StudioPage`.
- `normalizeCvData` normalise `full_name`, `links` et les clés de tableau.
- `StringListField` supprime les lignes vides et les espaces.
- `photo_data_url` est un champ texte libre, pas un upload.
- Les clés inconnues de `value` sont conservées par le spread.

**Accessibilité.** Champs dans des `<label>` englobants, `<details>/<summary>`, boutons `type="button"`, `focus-visible`, cases à cocher dans un label.

**À surveiller.**

- Les objets contenus dans `links`, `experience`, etc. sont supposés valides ; sinon `renderItem` peut planter.
- Les clés React utilisent l’index, ce qui peut provoquer des réconciliations incorrectes après suppression.
- Ajouter un champ CV exige de mettre à jour les constantes et le formulaire, sans inventer de champ API non validé.

---

### `src/components/ChangePasswordForm.jsx`

**Rôle.** Formulaire de changement de mot de passe avec trois champs, soumission via hook et remise à zéro uniquement après succès (`src/components/ChangePasswordForm.jsx:15-105`).

**Imports.** `useState`, `useLocale`, `useChangePassword`, table `TEXT`.

**Props.** Aucune.

**Contexte.** `useLocale()` → `{ t }`.

**État.**

- `form = { current_password, password, password_confirmation }`.
- `useChangePassword()` → `{ data, loading, error, changePassword }`.

**API.** `changePassword()` → `POST /me/password` avec les trois champs autorisés par `src/api/meApi.js`.

**Affichage.**

- Bouton désactivé pendant `loading`.
- Erreur `role="alert"`.
- Succès `role="status"` uniquement si `data !== null && !error && !loading`.

**Accessibilité.** Labels englobants, `type="password"`, `autoComplete="current-password"` / `"new-password"`, `required`.

**À surveiller.**

- Aucune vérification côté client de `password === password_confirmation`.
- Pas de longueur minimale définie ici.
- Une réponse réussie `204`/`null` ne viderait pas le formulaire.
- `error.message` est affiché tel quel.

---

### `src/components/CategoryTabs.jsx`

**Rôle.** Onglets de filtrage du catalogue avec icône par catégorie (`src/components/CategoryTabs.jsx:19-48`).

**Imports notables.** Six icônes `react-icons/fi`, `useLocale`, `CATEGORY_ICONS`, `TEXT.label`.

**Props.** `categories`, `activeCategory`, `onChange`. Chaque catégorie est supposée avoir `id`, `label`, `labelEn`.

**Contexte.** `useLocale()` → `{ locale, t }`.

**Logique.**

- `aria-label` traduit via `t(TEXT.label)`.
- Libellé affiché : `locale === 'en' ? category.labelEn : category.label`.

**Accessibilité.** `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls="tools-grid"`, icônes `aria-hidden`, `focus-visible`.

**À surveiller.**

- `aria-controls` doit rester identique à l’`id="tools-grid"` de `ToolGrid`.
- Les onglets n’ont pas d’`id` et le panneau n’a pas d’`aria-labelledby`.
- La navigation au clavier par flèches n’est pas implémentée ; les boutons restent accessibles par Tab.
- Toute catégorie non prévue dans `CATEGORY_ICONS` utilise `FiGrid`.

---

### `src/components/ThemeToggle.jsx`

**Rôle.** Faire cycler le thème `system → light → dark → system` avec icône et libellé accessible (`src/components/ThemeToggle.jsx:23-45`).

**Imports notables.** `FiMonitor`, `FiMoon`, `FiSun`, `useLocale`, `useTheme`, tables `THEME_ICONS`, `THEME_LABELS`, `NEXT_THEME`.

**Props.** `showLabel = false`.

**Contexte.** `useLocale()` → `{ locale, t }`. Le thème vient de `useTheme()`, qui gère `localStorage`, `matchMedia` et la classe `dark` sur `<html>`.

**Logique.**

- `NEXT_THEME = { system: 'light', light: 'dark', dark: 'system' }`.
- `aria-label` et `title` décrivent l’état courant et la cible.
- Icône `aria-hidden`.

**À surveiller.**

- Textes FR/EN dupliqués au lieu de `MESSAGES`.
- `THEME_LABELS[theme]` et `NEXT_THEME[theme]` supposent une valeur valide ; une valeur inattendue produit un libellé vide.
- Aucun `aria-pressed` ni annonce dynamique du changement.

---

### `src/components/SiteHeader.jsx`

**Rôle.** En-tête secondaire sombre avec logo textuel `N`, nom NanoFile, tagline et liens de connexion ou d’espace selon l’état du profil (`src/components/SiteHeader.jsx:5-67`).

**Imports notables.** `Link`, `useMeContext`.

**Props.** Aucune.

**Contexte.** `useMeContext()` → `{ isGuest, loading }`. Appel indirect à `GET /me` via le provider.

**Routes.** `/`, `/login`, `/register`, `/profile`, `/studio`, `/jobs`, `/billing`, `/documents`, `/account`.

**Textes codés en dur.** `NanoFile`, `Outils pour vos fichiers`, `Connexion`, `Inscription`, `Profil`, `Studio`, `Jobs`, `Facturation`, `Documents`, `Compte`.

**Accessibilité.** `<header>`, `<nav>`, logo décoratif `aria-hidden`, `focus-visible`.

**À surveiller.**

- Composant non référencé dans `src` ; c’est `Navbar` qui est utilisé par `App.jsx`.
- Intégralement en français malgré `LocaleProvider`.
- Aucun menu mobile ni bascule de thème/langue.
- Pendant `loading`, rien n’est affiché ; en cas d’erreur, les liens invité apparaissent.

---

### `src/components/SiteFooter.jsx`

**Rôle.** Pied de page global avec logo, tagline, groupes d’outils générés depuis `TOOLS`, navigation secondaire, espace utilisateur, liens légaux, copyright et lien CGU (`src/components/SiteFooter.jsx:8-115`).

**Imports notables.** `Link`, logo, `TOOLS`, `MESSAGES`, `useLocale`, composant interne `FooterSection`.

**Props.** Aucune pour `SiteFooter` ; `FooterSection` reçoit `title` et `links`.

**Contexte.** `useLocale()` → `{ t }`.

**Routes générées.**

- `/tools/${tool.tool}` pour les outils de `TOOLS` ;
- `/`, `/catalogue`, `/studio`, `/documents`, `/jobs`, `/dashboard`, `/profile`, `/account`, `/billing`, `/terms`, `/privacy`, `/cookies`, `/legal`.

**Logique FR/EN.** `MESSAGES.tools[tool.tool] ?? { fr: tool.name, en: tool.name }`, puis `t()`. Les sections et titres viennent de `MESSAGES`.

**Accessibilité.** `<footer>`, image décorative `alt=""`, texte `sr-only` « NanoFile », chaque section avec `<nav aria-label={title}>` traduit.

**À surveiller.**

- `FOOTER_TOOL_GROUPS` et `FOOTER_SECTIONS` sont calculés au chargement du module.
- Seules les catégories `optimize`, `convert`, `organize`, `security`, `photo` sont couvertes.
- Le repli anglais afficherait le nom français si `MESSAGES.tools[tool.tool]` manquait.
- Le footer est masqué sur `/login` et `/register` par `App.jsx`.
- `/terms` apparaît volontairement deux fois.

---

### `src/components/Navbar.jsx`

**Rôle.** Barre de navigation globale sticky : menu desktop, menu mobile avec recherche et groupes dépliables, bascules de langue et de thème, verrouillage du scroll et piège de focus (`src/components/Navbar.jsx:171-701`).

**Imports notables.** `useEffect`, `useRef`, `useState`, `Link`, `useLocation`, 17 icônes `react-icons/fi`, logo, `LocaleToggle`, `ThemeToggle`, `TOOLS`, `MESSAGES`, `useLocale`, `useMeContext`.

**Composant interne.** `MobileNavLink({ link, pathname, onClick })`.

**Contexte.**

- `useLocale()` → `{ locale, t }`.
- `useMeContext()` → `{ isGuest, loading }`.

**État et refs.**

- `menuOpen`, `toolsOpen`, `spaceOpen`, `menuSearch`, `expandedGroups`.
- refs `toolsRef`, `spaceRef`, `menuButtonRef`, `menuContainerRef`, `menuSearchRef`.
- effet de fermeture au clic extérieur et à Échap ;
- effet de piège de focus et restauration vers le bouton hamburger ;
- effet de masquage de `document.body.style.overflow`.

**Routes.**

- `/` ;
- `/tools/${tool.tool}`;
- `/studio`, `/dashboard`, `/documents`, `/jobs` ;
- `/profile`, `/account`, `/billing` ;
- `/login`, `/register` pour les invités ;
- raccourcis mobiles `/tools/compress`, `/catalogue`, `/studio`.

**Logique FR/EN.** Principalement via `MESSAGES` et `t()`. Quelques ternaires locaux subsistent : `Mon espace`/`My space`, `Activité`/`Activity`, `Actif`/`Active`, `Navigation mobile`/`Mobile navigation`, `Menu NanoFile`/`NanoFile menu`, `Recherche`/`Search`, `Accès rapide`/`Quick access`, message « aucun outil trouvé ».

**Accessibilité.** `<nav aria-label>`, `aria-expanded`, `aria-haspopup`, `aria-controls="mobile-navigation"`, `role="menu"`, `aria-current="page"`, icônes `aria-hidden`, champs de recherche avec `sr-only`, overlay de fermeture avec `aria-label`.

**À surveiller.**

- `aria-modal="true"` est présent sur le nav mobile sans `role="dialog"`.
- Les menus desktop utilisent `role="menu"` mais les `Link` n’ont pas `role="menuitem"`.
- Le piège de focus interroge seulement `menuContainerRef`, alors que le bouton overlay est en dehors.
- `isActiveLink` et `findCurrentToolGroupId` reposent sur `startsWith`.
- La recherche ne normalise pas les accents.
- Les groupes et liens sont figés au chargement du module.
- Pendant `loading`, `authLinks` vaut `[]` et les liens de connexion sont masqués.

---

### `src/components/ToolGrid.jsx`

**Rôle.** Grille d’outils filtrée par catégorie, avec état vide traduit (`src/components/ToolGrid.jsx:12-26`).

**Imports.** `ToolCard`, `useLocale`, `TEXT.empty`.

**Props.** `tools`, `category`.

**Contexte.** `useLocale()` → `{ t }`.

**Logique.**

- Si `category === 'all'`, aucun filtre n’est appliqué.
- Sinon, filtre sur `tool.category === category`.
- `visibleTools` est recalculé à chaque rendu.

**Accessibilité.** `id="tools-grid"` et `role="tabpanel"`, correspondant à l’`aria-controls` de `CategoryTabs`.

**À surveiller.**

- Pas d’`aria-labelledby` reliant le panneau à l’onglet actif.
- `tools` est supposé être un tableau d’objets avec `tool` et `category`.
- Le `key` est `tool.tool` : deux outils avec le même identifiant poseraient problème.

---

### `src/components/ToolCard.jsx`

**Rôle.** Carte cliquable représentant un outil, avec icône, nom et description dans la langue courante (`src/components/ToolCard.jsx:34-61`).

**Imports notables.** `Link`, `useLocale`, 11 icônes `react-icons/fi`, table `TOOL_ICONS`.

**Props.** `tool`, avec `tool`, `name`, `nameEn`, `description`, `descriptionEn`.

**Contexte.** `useLocale()` → `{ locale }`. `t()` n’est pas utilisé ici.

**Logique.**

- `<Link to={`/tools/${tool.tool}`}>`.
- `locale === 'en' ? tool.nameEn : tool.name`.
- `locale === 'en' ? tool.descriptionEn : tool.description`.

**Accessibilité.** Lien avec `focus-visible`, icône `aria-hidden`, titre `<h3>`.

**À surveiller.**

- Aucun repli vers `tool.name` si `nameEn` ou `descriptionEn` manque : l’anglais afficherait `undefined`.
- `TOOL_ICONS` ne couvre que 12 identifiants et utilise `FiFileText` par défaut.
- `tool.tool` est supposé défini pour la clé React et l’URL.

---

### `src/components/ToolRunner.jsx`

**Rôle.** Formulaire très simple permettant de lancer un outil par identifiant et d’afficher la réponse brute JSON (`src/components/ToolRunner.jsx:5-55`).

**Imports.** `useState`, `useRunTool`.

**Props et contexte.** Aucun. Ce composant n’utilise pas `useLocale`.

**État et API.** `tool` et `useRunTool()` → `{ data, loading, error, runTool }`. L’action appelle `POST /tools/${encodeURIComponent(tool)}`.

**Textes codés en dur.** `Lancer un outil`, `Identifiant de l'outil`, `Lancement…`, `Lancer`.

**Accessibilité.** L’input n’a ni `<label>` ni `aria-label` ; seul le `placeholder` existe.

**À surveiller.**

- Composant non référencé dans `src`.
- Non traduit malgré `LocaleProvider`.
- `if (!tool)` accepte une chaîne contenant seulement des espaces.
- Le JSON brut peut révéler une réponse non stable.
- Une réponse `null` n’affiche rien.

---

## 5. Pages

### `src/pages/HomePage.jsx`

**Rôle.** Page d’accueil statique : héros, arguments, zone compression, cartes d’accès, trois étapes et FAQ (`src/pages/HomePage.jsx:5-193`).

**Imports.** `Link`, `MESSAGES`, `useLocale`.

**Contexte.** `useLocale()` uniquement. Aucun état, effet ou hook métier.

**API.** Aucun appel direct ou indirect.

**Routes.** Liens vers `/catalogue`, `/dashboard`, `/tools/compress`, `/studio`. Un `id="comment-ca-marche"` existe (`:115`) mais le lien d’ancrage correspondant est commenté.

**Langue.** Uniquement `t(MESSAGES.home.*)` et `t(MESSAGES.common.*)` ; aucune branche `locale === 'en'`.

**Accessibilité.** `<h1>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<details>/<summary>`, décor `aria-hidden`.

**À surveiller.**

- Blocs JSX commentés à `:15-17`, `:21`, `:79-82`, `:153-160`.
- Classe `bg-gradient-to-br   to-canvas` avec espaces multiples et sans `from-*`.
- Div décorative avec classe vide en fin.
- La zone « Déposez vos fichiers ici » est un `Link` vers `/tools/compress`, pas un vrai dépôt.
- Les clés `MESSAGES.home.*` et `MESSAGES.common.*` doivent rester synchronisées avec `src/i18n/messages.js`.

---

### `src/pages/CataloguePage.jsx`

**Rôle.** Afficher les outils documentés filtrés par catégorie (`src/pages/CataloguePage.jsx:18-49`).

**Imports.** `useState`, `Link`, `CategoryTabs`, `ToolGrid`, `TOOLS`, `TOOL_CATEGORIES`, `useLocale`.

**État.** `useState('all')` pour `activeCategory`. Aucun effet ni mémoïsation.

**API.** Aucun appel. Les données sont statiques via `src/config/tools.js`.

**Routes.** `/catalogue`, lien vers `/dashboard`, puis `ToolCard` vers `/tools/${tool.tool}`.

**Langue.** `TEXT` local traduit via `t()`. Le choix FR/EN des catégories et outils est fait dans `CategoryTabs` et `ToolCard`.

**À surveiller.**

- `'all'` est une chaîne magique utilisée comme valeur initiale et comme identifiant de catégorie.
- Ajouter un outil exige `src/config/tools.js`, puis éventuellement `DOCUMENTED_OPTION_TOOLS` et le formulaire de `ToolPage.jsx`.
- Le sous-titre affirme que les options par défaut sont documentées ; garder cette formulation cohérente avec `ToolPage`.

---

### `src/pages/DashboardPage.jsx`

**Rôle.** Afficher l’état du service et du compte en composant `HealthStatus` et `MeStatus`, plus deux liens (`src/pages/DashboardPage.jsx:17-50`).

**Imports.** `Link`, `useLocale`, `HealthStatus`, `MeStatus`.

**Contexte.** `useLocale()` dans la page. Les deux composants enfants gèrent leurs propres hooks.

**État et API.** Aucun état local. Appels indirects via `GET /health` et `GET /me`.

**Routes.** Liens vers `/account` et `/jobs`.

**Langue.** Table `TEXT` de cinq entrées bilingues. Les libellés de liens incluent directement la flèche `→`.

**À surveiller.**

- La page ne gère ni chargement ni erreur : tout est délégué.
- Une régression dans `HealthStatus` ou `MeStatus` affecte directement `/dashboard`.
- Toute réécriture des traductions doit conserver `→`.

---

### `src/pages/AdminPage.jsx`

**Rôle.** Control-room administratif : chargement de sept jeux de données, affichage JSON, création d’annonce, statut admin, crédits, plan et paramètres (`src/pages/AdminPage.jsx:36-346`).

**Imports.** `useEffect`, `useState`, `useAdmin`. Composants internes `JsonView`, `Panel`, `Field` ; constante `inputClass`.

**Contexte.** Aucun contexte React direct. `useAdmin` encapsule les états et appels.

**État.**

- `announcement`, `adminChange`, `credits`, `plan`, `setting`, `formError`, `formSuccess`.
- `useEffect` au montage : dashboard, users, tool runs, events, event errors, anonymous usage, settings.

**API indirecte.** Via `useAdmin` → `src/api/adminApi.js`, préfixe `/control-room-7f3k` :

- `GET /dashboard`, `/users`, `/tool-runs`, `/events`, `/event-errors`, `/anonymous-usage`, `/settings` ;
- `POST /announcements` avec `{ title, body }` ;
- `PATCH /users/:id/admin?enabled=true|false` ;
- `POST /users/:id/credits` avec `{ delta, reason }` ;
- `POST /users/:id/plan` avec `{ plan, days }` ;
- `PUT /settings/:key` avec une valeur JSON.

**Langue.** Aucune : tous les textes sont en français codé en dur.

**Gestion d’état.**

- 401/403 → écran « Accès refusé ».
- `loading` global désactive les boutons.
- `runAction(action, successMessage, afterSuccess)` réinitialise les messages, traite un payload falsy comme refus, puis rafraîchit.

**Accessibilité.** `Field` enveloppe le libellé et le champ dans un `<label>`, `role="alert"`/`role="status"`, `datalist`, boutons désactivés pendant `loading`.

**À surveiller.**

- `runAction` considère un payload `null` comme refus : une réponse `204` réussie masquerait le succès.
- `formSuccess` est placé avant `afterSuccess` : le message reste affiché même si le rafraîchissement échoue.
- `Number('')` devient `0` si la validation HTML est contournée.
- Le paramètre JSON accepte uniquement un objet, pas un tableau.
- Aucune confirmation n’est demandée avant les actions sensibles.
- La route `/admin` existe mais n’est pas proposée publiquement.

---

### `src/pages/ToolPage.jsx`

**Rôle.** Page générique de `/tools/:tool`. Elle résout l’outil depuis `TOOLS`, affiche un dépôt de fichiers, les options documentées, crée un job, interroge son statut, télécharge le résultat, affiche les spécifications photo, les outils similaires et un fil d’Ariane (`src/pages/ToolPage.jsx:679-1231`).

**Imports notables.** `useCallback`, `useEffect`, `useMemo`, `useRef`, `useState`, `Link`, `useParams`, `TOOLS`, `TOOL_CATEGORIES`, `useLocale`, `useCatalog`, `useEvents`, `useJob`, `useJobDownload`, `useJobsManager`, `useMeContext`.

**Params et composants locaux.**

- Paramètre `tool` via `useParams()`.
- `Step({ title, description, done, active })`.
- `PhotoSpecSummary({ countries, excluded })`.

**Contexte.**

- `useLocale()` → `{ locale, t }`.
- `useMeContext()` → `reload`, passé comme `onSuccess` à `useJobsManager`.

**État et refs.**

- `files`, `isDragging`, `jobId`, `downloadedJobId`, `localError` ;
- `photoOptions`, `compressOptions`, `toolOptions` ;
- `reportedRef` pour dédupliquer les événements terminaux ;
- `trackEvent` en `useCallback` ;
- `photoCountries`, `photoExcluded`, `photoDocuments` en `useMemo`.

**Effets.**

- Polling du statut toutes les `1000` ms tant que le job n’est pas terminal.
- Notification unique `tool_run_completed`/`tool_run_failed`.
- Chargement des pays photo pour `photo_id` uniquement.

**API indirecte.**

- `createJob` → `POST /v1/jobs` en `FormData` avec `files`, `tool`, `options` JSON.
- `getJob` → `GET /v1/jobs/:id`, repli `GET /jobs/:id` si 404.
- `download` → `GET /v1/files/:fileId` en Blob, repli `GET /jobs/:id/download`.
- `getPhotoSpecs` → `GET /v1/photo-specs`.
- `sendEvents` → `POST /v1/events`.
- `reload` → `GET /me`.

**Options documentées.** `DOCUMENTED_OPTION_TOOLS` contient `compress`, `pdf_to_images`, `pdf_split`, `pdf_reorder`, `images_to_pdf`, `pdf_sign`, `pdf_protect`, `pdf_watermark`, `photo_id`.

Détails :

- `compress` : `level` (`basic`, `medium`, `max`) ou `target_size_kb` ; la taille cible est prioritaire.
- `pdf_to_images` : `pages`, `format` (`png`/`jpg`), `dpi` 72-600.
- `pdf_split` : `ranges`, texte trimé.
- `pdf_reorder` : `order`, entiers positifs séparés par des virgules.
- `images_to_pdf` : `order` construit depuis les noms de fichiers, avec boutons Monter/Descendre.
- `pdf_sign` : `signature_text`, `page`, `position` par défaut `bottom_right`.
- `pdf_protect` : `password`.
- `pdf_watermark` : clé `text`, pas `watermark`.
- `photo_id` : `country`, `document`, `sheet`, `background`, `max_size_kb`.
- `pdf_to_word`, `zip`, `pdf_merge` : aucun formulaire avancé, message `noAdvancedOptions`.

**Langue.** `t(TEXT.*)` pour la majorité des libellés ; `locale === 'en'` pour catégorie, nom, description, outils liés ; unités `o/Ko/Mo` ou `B/KB/MB` ; placeholder `all ou 1,3-5` / `all or 1,3-5`.

**Accessibilité.** Fil d’Ariane avec `aria-label`, input fichier `sr-only` avec label, `role="alert"`, `role="progressbar"` avec `aria-valuenow/min/max`, `<ol>` pour les étapes.

**À surveiller.**

- `parsePageOrder` ignore silencieusement les entrées invalides.
- `maxSizeKb` accepte une valeur négative si la validation HTML est contournée.
- `images_to_pdf` utilise les noms de fichiers comme ordre : deux homonymes sont ambigus.
- `decodeFileName` tente une réparation UTF-8 sans round-trip, contrairement à `JobsPage.jsx`.
- `handleDownloadResult` présume que `download()` renvoie un `Blob` ou une chaîne.
- `reportedRef.current = key` est posé avant le microtask : un démontage peut marquer un événement non envoyé.
- Un statut inconnu retombe visuellement sur `queued`.

---

### `src/pages/StudioPage.jsx`

**Rôle.** Page `/studio` avec deux onglets : catalogue de modèles et rendu CV/lettre/lettres multiples, puis assistants de réécriture (`src/pages/StudioPage.jsx:222-681`).

**Imports.** `useEffect`, `useState`, `buildApiUrl`, `CvDataForm`, `useCatalog`, `useLocale`, `useRender`.

**Helpers et composants locaux.** `JsonBlock`, `normalizeTemplates`, `formatValue`, `ValueRows`, `resolveUrl`, `RenderResult`, `RewriteResult`, `parseJson`, `parseRequiredObject`.

**Contexte.** `useLocale()` uniquement. Aucun `MeContext`.

**État.**

- `activeTab`, `templateKind`, `previewId`, `lastAction` ;
- `renderForm`, `rewriteForm`, `localError` ;
- `useEffect` différé pour `fetchTemplates(templateKind)`.

**API indirecte.**

- `listTemplates(kind)` → `GET /v1/templates?kind=cv|letter`.
- Aperçu via `buildApiUrl('/v1/templates/.../preview.svg')` directement dans la page.
- `renderCv`, `renderLetter`, `renderLetters` → `/v1/cv/render`, `/v1/letter/render`, `/v1/letters/render`.
- `rewriteCv` → `/v1/cv/rewrite`.
- `rewriteLetter`, `rewriteLetters` → `/v1/letter/rewrite?payload=…`, `/v1/letters/rewrite?payload=…`.

**Options.** Onglets `studio`/`rewrite`, filtre `cv`/`letter`, rendu `cv`/`letter`/`letters`, format `html`/`pdf`/`docx`, langue `fr`/`en`, champs `letter_kind`, `job_title`, `company`, case CV structuré via `CvDataForm`.

**Langue et accessibilité.** `t(TEXT.*)`, `aria-pressed` sur les boutons d’onglet, labels `htmlFor`, `datalist`, `img alt`, `iframe sandbox=""`, `role="status"`/`role="alert"`.

**À surveiller.**

- Certains textes produits par `parseRequiredObject` ont un accord grammatical perfectible.
- `lastAction` et `renderData` sont partagés entre rendu et réécriture.
- Le filtre modèles est `cv`/`letter`, mais le rendu accepte aussi `letters`.
- `resolveUrl` traite toute URL relative comme un chemin API ; `data:` et `blob:` ne sont pas acceptés comme absolus.
- `useRender` agrège sept actions : `renderLoading`, `renderError` et `renderData` peuvent provenir d’une action différente de la dernière initiée par la page.
- Les boutons d’onglet n’ont ni `role="tablist"`/`role="tab"` ni `aria-controls`.

---

### `src/pages/LegalPage.jsx`

**Rôle.** Page statique générique pour les textes légaux ; le contenu est défini dans `CONTENT` et sélectionné par la prop `kind` (`src/pages/LegalPage.jsx:5-363`, `:387-413`).

**Imports.** `Link`, `MESSAGES`, `useLocale`.

**Props.** `kind` : `terms`, `privacy`, `cookies`, `legal`. Repli silencieux vers `CONTENT.legal`.

**Composant interne.** `LegalSection({ title, paragraphs = [], items = [] })`.

**API.** Aucune. Le commentaire indique explicitement que le backend ne fournit pas ces textes.

**Routes.** Montée quatre fois dans `App.jsx` sur `/terms`, `/privacy`, `/cookies`, `/legal`. Seul lien de la page : `/`.

**Langue.** Titres et introductions depuis `MESSAGES.legal.*` ; paragraphes et listes sous forme `{ fr, en }` résolus par `t()`.

**Contenu.** CGU, confidentialité, cookies, mentions légales. Plusieurs marqueurs `[À compléter]` restent présents, notamment pour l’éditeur, l’hébergement, les durées et les contacts.

**Accessibilité.** Structure sémantique `<section>`, `<h1>`, `<h2>`, `<p>`, `<ul>/<li>`, lien natif.

**À surveiller.**

- Les textes légaux doivent être complétés puis validés juridiquement.
- `key={section.title.fr}` suppose des titres uniques et stables.
- Les classes `border-line`, `bg-surface`, `text-ink`, `text-brand`, etc. dépendent de la configuration Tailwind.
- Le texte sur `nf_session`, `nanofile.anon_id`, `nanofile.theme` et les services tiers doit rester synchronisé avec le code.

---

### `src/pages/JobsPage.jsx`

**Rôle.** Historique paginé des jobs, sélection d’un job, affichage du détail et téléchargement de chaque fichier (`src/pages/JobsPage.jsx:143-414`).

**Imports.** `useEffect`, `useState`, `Link`, `useLocale`, `useJob`, `useJobDownload`, `useJobsManager`, `useMeContext`.

**Helpers locaux.** `formatBytes`, `formatDate`, `decodeFileName`, `safeDownloadName`, `formatBoolean`, `statusLabel`, `normalizeJobs`.

**État.**

- `limit = 20`, `offset = 0`, `selected`, `downloadedFileKey`.
- `job = useJob(selected)` et `jobDownload = useJobDownload()`.
- `useEffect` différé pour `fetchJobs({ limit, offset })`.

**API indirecte.**

- `listJobs({ limit, offset })` → `GET /v1/jobs?limit=…&offset=…`.
- `getJob(selected)` → `GET /v1/jobs/:id`, repli `GET /jobs/:id`.
- `download(selected, file)` → `GET /v1/files/:fileId`, repli `GET /jobs/:id/download`.
- `useMeContext` → `GET /me`.

**Langue.** `TEXT`, `STATUS_LABELS`, unités et dates `fr-FR`/`en-US`.

**Fonctionnalités.** Pagination Précédent/Suivant, `limit` 10/20/50, sélection d’un job, bouton « Actualiser le statut », téléchargement par fichier désactivé sauf si `status === 'done'`.

**Accessibilité.** `role="progressbar"`, `role="alert"`, `title` sur nom tronqué, boutons désactivés.

**À surveiller.**

- `handleNext` teste seulement `items.length < limit` : une page pleine sans suite peut mener à une page vide.
- `decodeFileName` possède un contrôle de round-trip absent de `ToolPage.jsx`.
- `safeDownloadName` appelle `value.replace(...)` sans garde de type.
- `jobDownload.error` est global alors que le succès est clé par fichier.
- `onClick={job.reload}` transmet l’événement, mais `reload` l’ignore.
- Le message invité apparaît même si des jobs anonymes peuvent exister via `anon_id`.
- Le `select` de limite n’a pas de `label` associé.

---

### `src/pages/VerifyEmailPage.jsx`

**Rôle.** Callback du lien de vérification d’email : lit `token` et `return_to`, vérifie, recharge le contexte utilisateur, puis propose « Continuer » et un lien permanent vers `/login` (`src/pages/VerifyEmailPage.jsx:28-101`).

**Imports.** `useCallback`, `useEffect`, `Link`, `useSearchParams`, `useLocale`, `useMeContext`, `useVerifyEmail`.

**Params.** `token` (`?? ''`) et `return_to` filtré par `safeReturnTo`.

**Contexte et hooks.** `useLocale()` → `{ t }` ; `useMeContext()` → `{ reload }` ; `useVerifyEmail({ onSuccess })`.

**Effet.** `useEffect([token, verifyEmail])` avec garde `active` et appel différé via `Promise.resolve().then(...)`. Retour `undefined` si pas de token.

**API.** `verifyEmail(token)` puis `reload()` → `GET /me` en cas de succès.

**Navigation.** `Link to={returnTo}` (par défaut `/`) et `Link to="/login"`.

**États.**

- token absent → paragraphe rouge ;
- `loading` → texte simple ;
- erreur → `role="alert"` avec `TEXT.invalidLink` puis `error.message` ;
- `data` → `role="status"` vert.

**À surveiller.**

- `safeReturnTo` accepte toute valeur commençant par `/`, y compris query/hash.
- Aucune action de renvoi en cas d’échec.
- `error.message` peut être technique ou anglais.
- Le chargement n’a pas d’attribut live.

---

### `src/pages/ResetPasswordPage.jsx`

**Rôle.** Formulaire de nouveau mot de passe après lien email (`src/pages/ResetPasswordPage.jsx:24-118`).

**Imports.** `useState`, `Link`, `useSearchParams`, `useLocale`, `useResetPassword`.

**Params.** `token` via `useSearchParams().get('token') ?? ''`.

**État.**

- `form = { password, password_confirmation }` ;
- `localError` ;
- `useResetPassword()` → `{ resetPassword, data, loading, error }`.

**API.** `resetPassword({ token, password, password_confirmation })`.

**Validations locales.** Token manquant et mots de passe différents.

**Affichage.** Bouton désactivé pendant `loading`, `role="alert"` pour `(localError || error)`, `role="status"` en cas de succès, lien `/login`.

**Accessibilité.** Labels `htmlFor`, `type="password"`, `required`, `autoComplete="new-password"`.

**À surveiller.**

- Pas de `trim()` ni de règle de longueur côté client.
- `localError` masque l’erreur API tant qu’il n’est pas réinitialisé.
- Le formulaire reste affiché après succès.
- Le token n’est vérifié qu’au submit.

---

### `src/pages/ForgotPasswordPage.jsx`

**Rôle.** Demande de lien de réinitialisation avec message volontairement ambigu (`src/pages/ForgotPasswordPage.jsx:16-76`).

**Imports.** `useState`, `Link`, `useLocale`, `useForgotPassword`.

**État.** `email` et `useForgotPassword()` → `{ forgotPassword, loading, error, sent }`.

**API.** `forgotPassword(email)` sans `trim()`.

**Affichage.** Formulaire remplacé par un `role="status"` vert quand `sent` est vrai ; `role="alert"` pour l’erreur ; lien `/login`.

**À surveiller.**

- Ne pas remplacer le message neutre par un texte révélant l’existence du compte.
- Aucun délai ni renvoi.
- Formulaire, succès et erreur ne sont pas strictement mutuellement exclusifs.

---

### `src/pages/LoginPage.jsx`

**Rôle.** Connexion par email/mot de passe avec bouton Google conditionné à l’acceptation des conditions (`src/pages/LoginPage.jsx:86-208`). Après succès, recharge le contexte utilisateur et navigue vers `/`.

**Imports notables.** `useState`, `Link`, `useNavigate`, logo, `GoogleAuthButton`, `useLocale`, `useLogin`, `useMeContext`.

**Composants locaux.** `EyeIcon`, `EyeOffIcon`, `PasswordField`.

**État.**

- `form = { email, password }` ;
- `googleTermsAccepted` ;
- `visible` dans `PasswordField` ;
- `useLogin({ onSuccess })` → `{ login, loading, error }`.

**API.** `login(form)` ; flux Google via `GoogleAuthButton`.

**Navigation.** `navigate('/')` après email ou Google ; liens `/forgot-password` et `/register`.

**Langue.** Table `TEXT` de 11 entrées bilingues.

**Accessibilité.** Labels, `required`, `type="email"`, `autoComplete`, bouton d’affichage avec `aria-label`/`aria-pressed`/`aria-controls`, `role="alert"`.

**À surveiller.**

- Duplication complète de `EyeIcon`, `EyeOffIcon` et `PasswordField` avec `RegisterPage.jsx`.
- Pas de `trim()` sur l’email.
- Pas de `return_to` repris de l’URL.
- Succès Google vers `/`, alors que `RegisterPage.jsx` navigue vers `/dashboard`.
- `marketingOptIn={false}` figé pour Google.
- `error.message` brut.

---

### `src/pages/RegisterPage.jsx`

**Rôle.** Inscription compacte avec bouton Google conditionné, formulaire email/mot de passe/confirmation/nom, deux cases à cocher et écran de confirmation (`src/pages/RegisterPage.jsx:109-333`).

**Imports.** `useState`, `Link`, `useNavigate`, logo, `GoogleAuthButton`, `useLocale`, `useRegister`.

**Composants locaux.** `EyeIcon`, `EyeOffIcon`, `PasswordField`.

**État.**

- `form` avec `email`, `password`, `password_confirmation`, `name`, `terms_accepted`, `marketing_opt_in` ;
- `localError` ;
- `visible` dans `PasswordField` ;
- `useRegister()`.

**API.** `register({ email: trim, password, password_confirmation, name: trim || undefined, terms_accepted, marketing_opt_in })`.

**Navigation.** Succès Google → `navigate('/dashboard')` ; liens `/login`.

**Validations.** Mots de passe différents et conditions non acceptées.

**Succès.** Écran global `role="status"` avec logo et email saisi, puis lien `/login`.

**À surveiller.**

- Le `return` anticipé si `data` rend le bloc `data &&` de fin de formulaire inatteignable.
- `payload` truthy est utilisé pour effacer les mots de passe sans vérifier la forme de la réponse.
- Google n’appelle pas `reload()` ici, contrairement à `LoginPage`.
- `marketing_opt_in` est transmis au bouton Google.
- Logique de mot de passe dupliquée avec `LoginPage`.

---

### `src/pages/ProfilePage.jsx`

**Rôle.** Page « Mon profil » : chargement, erreur, invitation à se connecter, formulaire de données personnelles, formulaire de mot de passe et déconnexion (`src/pages/ProfilePage.jsx:192-240`).

**Imports.** `useState`, `Link`, `ChangePasswordForm`, `LogoutButton`, `useLocale`, `useMeContext`, `usePatchMe`.

**Composant interne.** `ProfileForm({ user, onSuccess })`.

**Contexte et hooks.**

- `useMeContext()` → `{ user, loading, error, reload, isGuest }` ;
- `usePatchMe({ onSuccess })` ;
- `useLocale()` → `{ t }`.

**Formulaire.** Sept champs initialisés depuis `user`, dont :

- `terms_accepted: Boolean(user.terms_accepted_at ?? user.terms_accepted)` ;
- `marketing_opt_in: Boolean(user.marketing_opt_in)`.

**API.** `patchMe({ email, first_name, last_name, profession, name, terms_accepted, marketing_opt_in })` ; `reload()` après succès et après logout.

**Routes.** Lien `/login` pour les invités.

**À surveiller.**

- L’état du formulaire n’est initialisé qu’une fois, sans effet de synchronisation.
- `key={user.id ?? user.email ?? 'profile'}` force le remontage seulement si l’identifiant change.
- `Boolean(...)` transforme n’importe quelle chaîne de date en `true`.
- `patchMe` envoie systématiquement les sept champs, y compris vides.
- `error.message` brut.

---

### `src/pages/AccountPage.jsx`

**Rôle.** Page « Mon compte » : identité, statut, statistiques de quota, puis onglets vue d’ensemble, données personnelles RGPD et communication (`src/pages/AccountPage.jsx:317-620`).

**Imports.** `useEffect`, `useState`, `Link`, `useSearchParams`, `useMeActions`, `useMeContext`, `useUsage`, `useLocale`.

**Helpers et composants locaux.** `formatValue`, `rowsFrom`, `quotaRows`, `usageIdentity`, `rowValue`, `initials`, `ValueList`, `StatCard`, `SectionCard`, `AccountTabs`, `OverviewTabs`, `JsonBlock`.

**Contexte et hooks.**

- `useMeContext()` → `{ user, quota, reload, isGuest, loading }` ;
- `useUsage()` → `{ getUsage, data, loading, error }` ;
- `useMeActions({ onSuccess: reload })` ;
- `useLocale()` → `{ locale, t }`.

**État.**

- `activeTab`, `overviewTab`, `token`, `deleteConfirmation`, `includeAccount`, `localError` ;
- token initialisé depuis `useSearchParams()` ;
- `useEffect` différé pour `getUsage()`.

**API indirecte.**

- `GET /v1/usage` ;
- export RGPD ;
- suppression des données avec `includeAccount` ;
- désinscription marketing par token.

**Langue.** Tables bilingues `QUOTA_LABELS`, `USAGE_LABELS`, `LIMIT_LABELS`, `AI_LABELS`, `TABS`, `OVERVIEW_TABS`, `TEXT`. `locale` sert aussi aux dates et unités `Mo`/`MB`, `min`.

**Accessibilité.** `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `aria-labelledby`, panneaux `hidden`, `role="alert"`/`role="status"`, `<dl>`, label du token.

**À surveiller.**

- Le token est initialisé depuis l’URL une seule fois.
- Le mot de confirmation dépend de `locale` et doit rester synchronisé avec `TEXT.deleteConfirmationRequired`.
- `rowsFrom` accepte les tableaux comme objets.
- `enabledTools` compte les valeurs truthy sans afficher les noms.
- `actions.error` est affiché globalement quel que soit l’onglet.
- Les libellés absents des tables sont silencieusement masqués.
- Le champ de confirmation de suppression n’a que `placeholder`, pas de label.
- La navigation par flèches entre onglets n’est pas implémentée.

---

### `src/pages/DocumentsPage.jsx`

**Rôle.** Gestion des documents : liste, édition de `data`/`template_id`, téléchargement, envoi par email, suppression, utilitaires fichier par identifiant ou jeton (`src/pages/DocumentsPage.jsx:176-413`).

**Imports.** `useEffect`, `useState`, `Link`, `useDocuments`, `useFiles`, `useLocale`, `useMeContext`.

**Helpers et composant interne.** `JsonBlock`, `normalizeDocuments(payload, t)`, `DocumentEditor`.

**Contexte et hooks.**

- `useDocuments()` pour liste, détail, mise à jour, suppression, téléchargement et envoi email ;
- `useFiles()` pour `getFile` et `downloadByToken` ;
- `useMeContext()` pour `isGuest` et `loading` ;
- `useLocale()`.

**État.**

- Dans `DocumentEditor` : `dataText`, `templateId`, `localError`.
- Dans la page : `selected`, `fileId`, `shareToken`, `localError`.
- Deux effets différés : liste si connecté, détail si sélection.

**Validation locale.** JSON invalide, objet invalide, téléchargement non-Blob, identifiant ou jeton vide.

**Langue.** Table `TEXT` de 32 entrées bilingues. `normalizeDocuments` devine plusieurs clés API.

**Accessibilité.** Labels pour `document-template` et `document-data`, boutons `type="button"`, `role="alert"`/`role="status"`.

**À surveiller.**

- `URL.createObjectURL(fileData)` est appelé pendant le rendu sans `revokeObjectURL`.
- `normalizeDocuments` peut masquer un changement de schéma API.
- La clé de `DocumentEditor` inclut `updated_at`, donc une mise à jour remonte le formulaire et perd la saisie.
- `handleDelete` n’attend pas le `fetchDocuments()` suivant.
- `documentsError` masque `filesError`.
- Les utilitaires fichiers restent utilisables en invité.
- Les deux champs des utilitaires fichiers n’ont que des `placeholder`.

---

### `src/pages/DocumentSharePage.jsx`

**Rôle.** Équivalent front de `/d/{token}` : télécharge un document par jeton public et affiche un lien Blob ou le JSON brut (`src/pages/DocumentSharePage.jsx:14-82`).

**Imports.** `useEffect`, `useMemo`, `Link`, `useParams`, `useFiles`, `useLocale`.

**Params.** `token` via `useParams()`.

**Contexte et hooks.** `useLocale()` → `{ t }` ; `useFiles()` → `{ data, loading, error, downloadByToken }`.

**Effets.**

- `useEffect([token, downloadByToken])` avec garde `active` et appel différé de `downloadByToken(token)`.
- `fileUrl = useMemo(() => data instanceof Blob ? URL.createObjectURL(data) : null, [data])`.
- `useEffect([fileUrl])` nettoie avec `URL.revokeObjectURL(fileUrl)`.

**Affichage.** Token absent, chargement, `role="alert"`, lien `<a href download>`, puis `<pre>` avec JSON.

**À surveiller.**

- `Blob` natif n’a pas de propriété `name` ; le repli `document-${token}` s’applique souvent.
- `JSON.stringify` peut échouer sur des valeurs non sérialisables.
- Un changement de forme de réponse fait basculer l’affichage en JSON.
- L’effet dépend de l’identité de `downloadByToken`.

---

### `src/pages/BillingPage.jsx`

**Rôle.** Afficher l’état de facturation, proposer l’actualisation et créer une session Stripe Checkout quand `billing_enabled` et le plan `pro` le permettent (`src/pages/BillingPage.jsx:114-260`).

**Imports.** `useEffect`, `useRef`, `useState`, `useLocale`, `useBilling`.

**Helpers locaux.** `formatValue`, `rowsFrom`, `ValueList`, `safeCheckoutUrl`.

**Contexte et hooks.**

- `useLocale()` → `{ t }` ;
- `useBilling()` → statut, checkout, URL, session, chargement et erreurs.

**État.**

- `checkoutInFlight = useRef(false)` et `checkoutPending = useState(false)` pour bloquer les doubles clics.
- `useEffect([fetchBillingStatus])` avec garde `active`.

**API indirecte.**

- `fetchBillingStatus()` au montage et via « Actualiser » ;
- `createCheckout()`.

**Sécurité.** `safeCheckoutUrl()` n’autorise que `/^https?:\/\//i`.

**Langue.** `BILLING_LABELS`, `CHECKOUT_LABELS`, `TEXT`.

**À surveiller.**

- Identifiant de plan `'pro'` codé en dur.
- `checkoutAvailable` dépend de `proPlan?.checkout_available !== false` : disponible si la clé est absente.
- `formatValue` sur un objet n’affiche que les clés.
- `safeCheckoutUrl` autorise `http`.
- Le lien s’ouvre dans le même onglet sans `rel`.
- `error` n’est pas effacé au rechargement.

---

### `src/pages/BillingReturnPage.jsx`

**Rôle.** Page de retour Stripe purement affichage : elle choisit son message selon la prop `success` puis renvoie vers `/billing` (`src/pages/BillingReturnPage.jsx:18-40`).

**Imports.** `Link`, `useLocale`.

**Props.** `success` fourni par `App.jsx` selon la route.

**État et API.** Aucun.

**Langue.** Table `TEXT` bilingue avec variantes succès/annulation.

**À surveiller.**

- Toute valeur falsy affiche la variante annulée.
- Aucune confirmation API du paiement.
- Si la route omet la prop, le message peut être trompeur.
- Pas de `role="status"` sur le résultat.

---

## 6. Points de vigilance transversaux

### 6.1 Flux typique d’une action UI

1. Un composant `.jsx` capture une intention utilisateur.
2. Il appelle une fonction fournie par un hook.
3. Le hook met à jour `loading`, `error`, `data`.
4. Le hook appelle une fonction de `src/api/`.
5. La fonction API construit le chemin et utilise `apiFetch`.
6. `apiFetch` gère en-têtes, cookies, anon id, langue, `204`, JSON et binaire.
7. Le composant affiche les états et erreurs.

Ne pas court-circuiter ce flux avec un `fetch` ou un `apiFetch` direct depuis un `.jsx`, sauf cas déjà présent et explicitement documenté : `StudioPage.jsx` construit l’URL d’aperçu SVG avec `buildApiUrl`.

### 6.2 Composants et pages non traduits

Ces fichiers contiennent encore des textes codés en dur non bilingues :

- `SiteHeader.jsx` : intégralement français ;
- `ToolRunner.jsx` : intégralement français et non référencé ;
- `AdminPage.jsx` : intégralement français, control-room exclu du front public.

Ils ne doivent pas être utilisés comme référence pour ajouter de nouveaux textes dans les pages publiques.

### 6.3 Composants non référencés

- `SiteHeader.jsx`
- `ToolRunner.jsx`

Ils existent et sont entretenus, mais `App.jsx` utilise `Navbar`, et aucun routage n’affiche `ToolRunner`.

### 6.4 Objets URL

Deux patterns coexistent :

- bon pattern : `DocumentSharePage.jsx` crée l’URL dans un `useMemo` et la révoque dans un `useEffect` de nettoyage ;
- pattern à corriger : `DocumentsPage.jsx` appelle `URL.createObjectURL(fileData)` pendant le rendu sans révocation.

Tout nouveau téléchargement par Blob doit suivre le pattern de `DocumentSharePage.jsx`.

### 6.5 Contextes

- `LocaleContext` est mémoïsé et utilisé par la majorité des composants via `useLocale()`.
- `MeContext` n’est pas mémoïsé.
- `MeProvider` est monté dans `App.jsx`, avant `BrowserRouter`.
- `StrictMode` peut doubler les effets en développement.

### 6.6 Authentification et invité

- Un invité est un état normal : `isGuest = !loading && user === null`.
- Les pages publiques doivent afficher un lien `/login`, pas une erreur.
- Après connexion ou vérification d’email, le contexte utilisateur doit être rechargé.
- `LoginPage.jsx` et `VerifyEmailPage.jsx` appellent `reload()`.
- `RegisterPage.jsx` Google navigue sans `reload()` : comportement à ne pas copier sans validation.

### 6.7 Tokens et secrets

Ne jamais journaliser ni afficher durablement :

- mots de passe ;
- tokens de vérification et de reset ;
- credential Google ;
- jetons de partage ;
- contenu brut des fichiers utilisateur ;
- réponses administratives sensibles.

`GoogleAuthButton.jsx` contient un client ID de repli public : ce n’est pas un secret, mais la configuration Google Cloud doit rester cohérente avec le backend.

### 6.8 Accessibilité

Points à conserver :

- labels explicites ou `aria-label` ;
- `role="alert"` pour les erreurs ;
- `role="status"` pour les succès ;
- `aria-busy` pendant les actions longues ;
- `role="progressbar"` avec valeurs min/max/courante ;
- icônes décoratives `aria-hidden` ;
- navigation clavier dans `Navbar.jsx` et `AccountPage.jsx`.

Points perfectibles :

- `aria-modal` sans `role="dialog"` dans `Navbar.jsx` ;
- `role="menu"` sans `role="menuitem"` dans `Navbar.jsx` ;
- `aria-controls` codé en dur entre `CategoryTabs` et `ToolGrid` sans `aria-labelledby` ;
- champs avec placeholder seulement dans `ToolRunner.jsx`, `DocumentsPage.jsx`, `JobsPage.jsx` et `AccountPage.jsx` ;
- onglets sans navigation par flèches dans plusieurs pages.

### 6.9 Erreurs fréquentes à éviter

- Confondre `useRunTool` (lancement direct) et `useJobsManager`/`useJob` (jobs avec fichiers).
- Confondre `HealthStatus` (santé API) et `MeStatus` (profil/quota).
- Supposer que `useGoogleAuth` charge le SDK : c’est `GoogleAuthButton.jsx` qui le fait.
- Supposer que `useCatalog` charge les outils : il charge les modèles et les specs photo.
- Ajouter un champ API non documenté dans `ToolPage.jsx`, `StudioPage.jsx` ou `AccountPage.jsx`.
- Remplacer un message de reset ambigu par un message révélant l’existence d’un compte.
- Oublier de recharger le profil après une action qui change le quota ou l’email.
- Utiliser `SiteHeader.jsx` ou `ToolRunner.jsx` comme base pour une nouvelle page publique bilingue.

---

## 7. Ajout d’un nouveau fichier `.jsx`

Checklist :

1. Choisir le bon dossier : `components/` pour un bloc réutilisable, `pages/` pour une vue routée, `contexts/` pour un provider global.
2. Vérifier si un hook existe déjà avant d’appeler une fonction API.
3. Utiliser `useLocale()` avec `MESSAGES` ou une table `TEXT` bilingue.
4. Conserver un invité comme état normal.
5. Afficher explicitement chargement, erreur et succès.
6. Nettoyer timers, abonnements, URLs Blob et drapeaux de montage.
7. Ajouter les attributs ARIA nécessaires.
8. Enregistrer la route dans `App.jsx` si c’est une page.
9. Ne pas ajouter de lien public vers le control-room.
10. Mettre à jour ce document.
11. Lancer `npm run lint && npm run build`.
12. Demander validation avant de créer un autre fichier.

---

## 8. État fonctionnel connu du backend

Ces points influencent directement plusieurs pages et composants :

- Facturation indisponible : `BILLING_UNAVAILABLE`, `billing_enabled=false`, `checkout_available=false`, réponse `503`.
- IA indisponible : `AI_UNAVAILABLE`, réponse `503`.
- Erreur `422` signalée sans URL, méthode ni corps exact.
- Pas de session admin disponible pour valider les routes du control-room.
- `pdf_sign` et `photo_id` restent bloquants côté backend.
- Photo de profil non implémentée car absente de l’API et non validée par l’utilisateur.
- Champs légaux `[À compléter]` / `[To complete]` à remplir puis à valider juridiquement.
- Avertissement Vite non bloquant : certains chunks dépassent `500 kB` après minification.

Ces limitations ne doivent pas être contournées côté front.
