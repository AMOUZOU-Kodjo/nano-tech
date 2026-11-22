# Guide de maintenance — fichiers JavaScript (`.js`)

## Périmètre de ce document

Ce guide décrit **tous les fichiers `.js` du dépôt** :

- les fichiers de configuration à la racine ;
- les fichiers de `src/api/` ;
- les fichiers de `src/hooks/` ;
- les fichiers de `src/config/` et de `src/i18n/`.

Les fichiers `.jsx` sont volontairement exclus : ils sont décrits dans le guide frère `MAINTENANCE_JSX.md`.

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
| `src/api/` | Appels HTTP purs, construction des chemins, en-têtes, sérialisation, réponses binaires, erreurs normalisées | Stocker de l’état React, lire des hooks, afficher des messages |
| `src/hooks/` | Logique métier, états React, callbacks, chargements, erreurs | Appeler `fetch` directement, inventer des champs API |
| `src/config/` | Données statiques partagées : catalogue d’outils et catégories | Faire des appels réseau ou dépendre d’un contexte React |
| `src/i18n/` | Dictionnaires de textes génériques FR/EN | Contenir des textes spécifiques à une page |
| Racine | Configuration Vite et ESLint | Contenir de la logique applicative |

### 1.2 Règles de maintenance

- Modifier **un seul fichier par réponse** et demander validation avant de passer au suivant.
- Rédiger commentaires, messages et documentation en français.
- Ne jamais inventer de champ, de paramètre, de route ou d’endpoint.
- Consulter l’OpenAPI avant toute modification d’un fichier de `src/api/`.
- Utiliser `FRONTEND.md` uniquement pour les corps explicitement validés.
- Conserver le préfixe `/api` déjà contenu dans `VITE_API_URL`.
- Utiliser le préfixe relatif `/v1/...` pour les routes qui n’existent que dans `FRONTEND.md` ou dans l’OpenAPI `/api/v1`.
- Gérer les réponses `204` sans parsing JSON.
- Considérer un invité comme un état normal, jamais comme une erreur.
- Après modification de code : `npm run lint && npm run build`.
- Ne pas committer sans demande explicite.

### 1.3 Variable d’environnement

Fichier `.env`, ignoré par Git :

```env
VITE_API_URL=https://api.nanofile.tech/api
```

`src/api/client.js` exige cette variable dès son import et lève une erreur si elle est absente. Il n’existe pas de repli local automatique.

Par conséquent :

- `GET /me` vise `/api/me` ;
- `POST /auth/login` vise `/api/auth/login` ;
- `POST /v1/jobs` vise `/api/v1/jobs` ;
- `GET /control-room-7f3k/dashboard` vise `/api/control-room-7f3k/dashboard`.

---

## 2. Cartographie rapide

### 2.1 Fichiers à la racine

| Fichier | Rôle principal |
|---|---|
| `eslint.config.js` | Configuration ESLint plate, ignore `dist` et `node_modules`, active JavaScript recommandé, React Hooks et React Refresh |
| `vite.config.js` | Configuration Vite, plugin React, plugin Tailwind v4, alias `@` vers `src` |

### 2.2 Configuration et traductions

| Fichier | Rôle principal |
|---|---|
| `src/config/tools.js` | Catégories et outils publics du catalogue, avec libellés FR et EN |
| `src/i18n/messages.js` | Dictionnaires FR/EN partagés pour les éléments génériques de l’interface |

### 2.3 Couche API

| Fichier | Domaine |
|---|---|
| `src/api/client.js` | Client HTTP central, erreurs, jeton anonyme, langue, réponses binaires |
| `src/api/adminApi.js` | Control-room administratif |
| `src/api/authApi.js` | Connexion, inscription, vérification, mot de passe, Google, lien magique |
| `src/api/billingApi.js` | État de facturation et session Stripe Checkout |
| `src/api/catalogApi.js` | Modèles, aperçus SVG et spécifications photo |
| `src/api/documentsApi.js` | Documents CV/lettre, mise à jour, téléchargement, envoi par email |
| `src/api/eventsApi.js` | Envoi d’événements simples ou groupés |
| `src/api/filesApi.js` | Métadonnées de fichier et téléchargement par jeton public |
| `src/api/healthApi.js` | Santé globale de l’API |
| `src/api/jobsApi.js` | Création, historique, détail et téléchargement des jobs |
| `src/api/meApi.js` | Profil, mot de passe, usage, RGPD, désinscription |
| `src/api/renderApi.js` | Rendu de CV/lettres et assistants de réécriture |
| `src/api/toolsApi.js` | Lancement direct d’un outil |

### 2.4 Hooks

| Fichier | Rôle principal |
|---|---|
| `src/hooks/useAdmin.js` | Actions et lectures du control-room |
| `src/hooks/useApiAction.js` | Exécution manuelle générique d’une requête avec états uniformes |
| `src/hooks/useBilling.js` | État de facturation et création de session Checkout |
| `src/hooks/useCatalog.js` | Modèles, aperçus et spécifications photo |
| `src/hooks/useChangePassword.js` | Changement de mot de passe du profil connecté |
| `src/hooks/useDocuments.js` | Cycle de vie des documents |
| `src/hooks/useEmailLink.js` | Lien magique et vérifications d’email |
| `src/hooks/useEvents.js` | Envoi d’événements |
| `src/hooks/useFiles.js` | Lecture de fichier privé ou public |
| `src/hooks/useForgotPassword.js` | Demande de réinitialisation du mot de passe |
| `src/hooks/useGoogleAuth.js` | Trois flux d’authentification Google |
| `src/hooks/useHealth.js` | Chargement de `/health` |
| `src/hooks/useJob.js` | Détail d’un job avec rechargement manuel |
| `src/hooks/useJobDownload.js` | Téléchargement du résultat d’un job |
| `src/hooks/useJobsManager.js` | Création de job et historique paginé |
| `src/hooks/useLocale.js` | Accès au contexte linguistique |
| `src/hooks/useLogin.js` | Connexion email/mot de passe |
| `src/hooks/useLogout.js` | Déconnexion |
| `src/hooks/useMe.js` | Profil courant, quota et état invité |
| `src/hooks/useMeActions.js` | Export RGPD, suppression de données, désinscription |
| `src/hooks/useMeContext.js` | Accès au contexte `Me` |
| `src/hooks/usePatchMe.js` | Mise à jour du profil |
| `src/hooks/useRegister.js` | Inscription |
| `src/hooks/useRender.js` | Rendu et réécriture assistée |
| `src/hooks/useResendEmail.js` | Renvoi de l’email de vérification |
| `src/hooks/useResetPassword.js` | Réinitialisation du mot de passe |
| `src/hooks/useRunTool.js` | Lancement direct d’un outil |
| `src/hooks/useTheme.js` | Thème système/clair/sombre |
| `src/hooks/useUsage.js` | Consommation détaillée |
| `src/hooks/useVerifyEmail.js` | Vérification de l’email |

---

## 3. Configuration racine

### `eslint.config.js`

**Rôle.** Définir la configuration ESLint plate utilisée par `npm run lint`.

**Imports.**

- `defineConfig` depuis `eslint/config`.
- `js` depuis `@eslint/js`.
- `globals` depuis `globals`.
- `reactHooks` depuis `eslint-plugin-react-hooks`.
- `reactRefresh` depuis `eslint-plugin-react-refresh`.

**Configuration globale.**

- `ignores: ['dist', 'node_modules']`.
- Preset `reactHooks.configs.flat.recommended`.
- Bloc appliqué à `**/*.{js,jsx}`.
- Plugin `react-refresh`.
- `ecmaVersion: 'latest'`.
- `globals.browser`.
- `parserOptions.ecmaFeatures.jsx: true`.
- `parserOptions.sourceType: 'module'`.

**Règles.**

- `...js.configs.recommended.rules`.
- `no-unused-vars` en erreur avec `argsIgnorePattern: '^_'`.
- `react-refresh/only-export-components` en avertissement avec `allowConstantExport: true`.

**À surveiller.**

- Il n’y a **pas** de plugin `eslint-plugin-react` dans cette configuration.
- `globals.node` n’est pas activé globalement ; les fichiers de configuration Node ne nécessitent pas `process` ou `require`.
- Un argument volontairement inutilisé doit commencer par `_`.
- Le plugin React Refresh tolère les exports constants, ce qui est important pour les hooks et contextes.

---

### `vite.config.js`

**Rôle.** Configurer Vite, React, Tailwind CSS v4 et l’alias de chemins.

**Imports.**

- `defineConfig` depuis `vite`.
- `react` depuis `@vitejs/plugin-react`.
- `tailwindcss` depuis `@tailwindcss/vite`.
- `fileURLToPath` et `URL` depuis `node:url`.

**Configuration.**

- `plugins: [react(), tailwindcss()]`.
- `resolve.alias['@'] = fileURLToPath(new URL('./src', import.meta.url))`.

**À surveiller.**

- L’alias `@` est utilisé massivement dans les hooks et composants : `@/api/...`, `@/hooks/...`, `@/contexts/...`.
- Ne pas réintroduire `tailwind.config.js` ou `postcss.config.js` : Tailwind v4 passe par le plugin Vite et le CSS global.
- Ce fichier ne définit pas de cible de build particulière.
- L’avertissement Vite sur les chunks supérieurs à `500 kB` est connu et non bloquant.

---

## 4. Configuration applicative et traductions

### `src/config/tools.js`

**Rôle.** Source statique du catalogue public affiché dans l’interface.

**Exports.**

- `TOOL_CATEGORIES`
- `TOOLS`

**`TOOL_CATEGORIES`.**

Tableau de catégories de filtrage :

```js
{ id: 'optimize', label: 'Optimiser', labelEn: 'Optimize' }
```

Catégories disponibles :

- `all`
- `optimize`
- `convert`
- `organize`
- `security`
- `photo`

**`TOOLS`.**

Chaque outil contient :

- `tool` : identifiant envoyé à l’API ;
- `name` et `nameEn` ;
- `description` et `descriptionEn` ;
- `category`.

Outils disponibles :

- `compress`
- `pdf_to_word`
- `pdf_to_images`
- `images_to_pdf`
- `zip`
- `pdf_merge`
- `pdf_split`
- `pdf_reorder`
- `pdf_sign`
- `pdf_protect`
- `pdf_watermark`
- `photo_id`

**Format bilingue.**

Ce fichier n’utilise pas d’objets `{ fr, en }`. Il conserve `label`, `name` et `description` en français, puis ajoute `labelEn`, `nameEn` et `descriptionEn` pour l’anglais.

**À surveiller.**

- Aucun outil supplémentaire ne doit être ajouté sans validation de `FRONTEND.md`.
- Ce fichier ne contient ni icônes, ni nombre de fichiers, ni options de formulaire.
- Les options et contraintes de traitement sont gérées par les composants et les hooks, pas ici.
- Les libellés `MESSAGES.tools` dans `src/i18n/messages.js` reprennent les mêmes identifiants.

---

### `src/i18n/messages.js`

**Rôle.** Fournir les textes génériques partagés entre plusieurs vues.

**Export.**

- `MESSAGES`

**Sections.**

- `common` : navigation générique, actions, chargement.
- `locale` : sélecteur de langue.
- `nav` : navigation principale, raccourcis, groupes de catégories, état du compte.
- `footer` : liens, tagline, copyright, textes légaux courts.
- `home` : héros, bénéfices, étapes, FAQ.
- `legal` : titres, sous-titres et Intro des quatre pages légales.
- `tools` : noms bilingues des douze outils.

**Format.**

Chaque entrée suit le motif :

```js
key: {
  fr: 'Texte français',
  en: 'English text'
}
```

**Utilisation.**

Les composants utilisent le hook `useLocale` puis `t(MESSAGES.section.cle)`.

**À surveiller.**

- Ne pas placer ici un texte spécifique à une page : les pages traduites définissent leur propre objet `TEXT` local.
- Toute nouvelle clé doit être ajoutée dans les deux langues.
- Les corps longs des mentions légales sont définis dans `src/pages/LegalPage.jsx`.
- Les champs `[À compléter]` / `[To complete]` restent à remplir puis à valider juridiquement.

---

## 5. Couche API

### `src/api/client.js`

**Rôle.** Client HTTP central utilisé par tous les modules API.

**Exports.**

- `setAnonId(token)`
- `clearAnonId()`
- `ApiError`
- `buildApiUrl(path)`
- `apiFetch(path, options = {})`

**Variables internes.**

- `API_URL` : lu dans `import.meta.env.VITE_API_URL`, obligatoire.
- `ANON_ID_STORAGE_KEY = 'nanofile.anon_id'`.
- `LOCALE_STORAGE_KEY = 'nanofile.locale'`.
- `anonId` : valeur courante, initialisée depuis `localStorage`.

**Jeton anonyme.**

- Le jeton vient de l’API, dans `payload.anon_token`.
- `rememberAnonId(payload)` l’enregistre automatiquement après une réponse JSON.
- `setAnonId` l’écrit en mémoire et dans `localStorage`.
- `clearAnonId` supprime les deux copies.
- Le stockage est protégé contre les erreurs d’accès à `localStorage`.

**Langue.**

- `detectLanguage()` lit d’abord `nanofile.locale`.
- Ensuite, elle parcourt `navigator.languages` ou `navigator.language`.
- Elle reconnaît les préfixes `fr` et `en`.
- Repli final : `fr`.

**`buildApiUrl(path)`.**

- Retire le slash final de la base.
- Ajoute un slash initial au chemin si nécessaire.
- Concatène base et chemin.
- Ne gère pas les URL absolues : tous les appels attendent un chemin relatif.

**Options de `apiFetch`.**

- `method`, par défaut `GET`.
- `body`.
- `headers`.
- `signal`.
- `responseType`, par défaut `text`.
- Autres options transmises telles quelles à `fetch`.

**En-têtes ajoutés.**

- `Accept-Language`, sauf si déjà fourni.
- `X-Anon-Id`, si un jeton existe et si l’en-tête n’est pas déjà fourni.
- `Content-Type: application/json` si un corps est présent, sauf `FormData` ou en-tête déjà fourni.

**Corps.**

- `FormData` est envoyé tel quel.
- Les autres objets sont sérialisés en JSON.
- `credentials: 'include'` est toujours appliqué pour transmettre les cookies de session.

**Réponses.**

- `204` : retour `null`, sans lecture du corps.
- Binaire : retour d’un `Blob` si `responseType: 'blob'` ou si le type MIME est PDF, octet-stream, ZIP, Word, document OpenXML, image, audio ou vidéo.
- Erreur binaire : lecture du texte du Blob puis tentative de parsing JSON avant création de `ApiError`.
- Texte/JSON : lecture de `response.text()`, parsing JSON si le content-type contient `application/json`.
- Le jeton anonyme est mémorisé après parsing d’une réponse JSON.

**`ApiError`.**

Propriétés exposées :

- `name = 'ApiError'`
- `status`
- `payload`
- `code`
- `details`
- `message`

Formats d’erreur gérés :

- `detail[]` de type `HTTPValidationError` ;
- `{ detail: { code, message } }` ;
- `{ error: { code, message, details } }` ;
- `detail` sous forme de chaîne ;
- messages spécifiques `402` pour `QUOTA_EXCEEDED` et `INSUFFICIENT_CREDITS` ;
- messages génériques `404`, `410`, `429` ;
- repli `Erreur HTTP <status>`.

**À surveiller.**

- Ce fichier est critique : toute modification affecte tous les appels API.
- Ne pas retirer `credentials: 'include'`.
- Ne pas parser le corps d’une réponse `204`.
- Conserver les trois formats d’erreur documentés.
- Le parsing JSON d’une réponse déclarée JSON peut lever une erreur si le corps est mal formé.
- Il n’existe pas de helper `getApiError` : les consommateurs lisent `error.message`.

---

### `src/api/adminApi.js`

**Rôle.** Regroupe les appels du control-room administratif.

**Préfixe.**

```js
const ADMIN_ROUTE = '/control-room-7f3k'
```

`adminPath(suffix)` construit les chemins. `userPath(userId, suffix)` encode l’identifiant utilisateur.

**Exports.**

- `getAdminDashboard()` : `GET /control-room-7f3k/dashboard`.
- `listAdminUsers()` : `GET /control-room-7f3k/users`.
- `createAnnouncement({ title, body })` : `POST /control-room-7f3k/announcements`.
- `updateUserAdmin(userId, enabled)` : `PATCH /control-room-7f3k/users/{id}/admin?enabled=true|false`.
- `updateUserCredits(userId, { delta, reason })` : `POST /control-room-7f3k/users/{id}/credits`, avec `reason = 'admin_adjustment'` par défaut.
- `updateUserPlan(userId, { plan, days })` : `POST /control-room-7f3k/users/{id}/plan`.
- `listToolRuns()` : `GET /control-room-7f3k/tool-runs`.
- `listAdminEvents()` : `GET /control-room-7f3k/events`.
- `listEventErrors()` : `GET /control-room-7f3k/event-errors`.
- `listAnonymousUsage()` : `GET /control-room-7f3k/anonymous-usage`.
- `getAdminSettings()` : `GET /control-room-7f3k/settings`.
- `updateAdminSetting(key, value)` : `PUT /control-room-7f3k/settings/{key}`, avec le corps `value`.

**À surveiller.**

- Le control-room est exclu du front public.
- Aucun lien public ne doit mener à `/admin`.
- `enabled` est un paramètre de requête, pas un champ du corps.
- `delta`, `reason`, `plan` et `days` sont les seuls champs utilisés.
- `updateAdminSetting` envoie directement `value` comme corps JSON.

---

### `src/api/authApi.js`

**Rôle.** Tous les appels d’authentification.

**Listes de champs autorisés.**

- `RESET_FIELDS = ['token', 'password', 'password_confirmation']`
- `REGISTER_FIELDS = ['email', 'password', 'password_confirmation', 'terms_accepted', 'marketing_opt_in', 'name']`
- `LOGIN_FIELDS = ['email', 'password']`
- `GOOGLE_FIELDS = ['credential', 'terms_accepted', 'marketing_opt_in']`
- `EMAIL_START_FIELDS = ['email', 'return_to']`
- `GOOGLE_CALLBACK_FIELDS = ['code', 'state', 'error']`

Des helpers internes `pickResetFields`, `pickRegisterFields`, `pickLoginFields` et `pickAuthFields` filtrent les objets avant envoi.

**Exports.**

- `logout()` : `POST /auth/logout`, retourne `null` sur `204`.
- `forgotPassword(email)` : `POST /auth/password/forgot`, corps `{ email }`.
- `resetPassword(changes)` : `POST /auth/password/reset`, champs filtrés.
- `register(changes)` : `POST /auth/register`, puis repli `POST /v1/auth/register` uniquement sur `422`.
- `login(changes)` : `POST /auth/login`, champs filtrés.
- `verifyEmail(token)` : `POST /auth/verify`, corps `{ token }`.
- `resendEmail(email)` : `POST /auth/resend`, corps `{ email }`.
- `googleLogin()` : `GET /auth/google/login`.
- `googleCallback(params)` : `GET /auth/google/callback?...`, avec seulement `code`, `state` et `error`.
- `googleAuth(changes)` : `POST /v1/auth/google`, champs filtrés.
- `emailStart(changes)` : `POST /v1/auth/email/start`.
- `emailVerify(token)` : `POST /v1/auth/email/verify`, corps `{ token }`.
- `emailResend(email)` : `POST /v1/auth/email/resend`, corps `{ email }`.
- `verifyEmailV1(token)` : `POST /v1/auth/verify-email`, corps `{ token }`.

**À surveiller.**

- Le repli d’inscription vers `/v1/auth/register` est volontaire et limité au statut `422`.
- Les champs non présents dans les listes sont ignorés silencieusement.
- `verifyEmail` et `verifyEmailV1` sont deux routes distinctes.
- Ne pas ajouter de corps à `googleLogin` ni à `googleCallback`.
- Les tokens et credentials ne doivent jamais être journalisés.

---

### `src/api/billingApi.js`

**Rôle.** Accès à l’état de facturation et à Stripe Checkout.

**Exports.**

- `getBillingStatus()` : `GET /v1/billing`.
- `createCheckout()` : `POST /v1/billing/checkout`, sans corps.

**À surveiller.**

- Il n’existe pas de fonction d’annulation d’abonnement dans ce fichier.
- Aucun prix, plan ou URL Stripe n’est codé en dur.
- Backend actuellement indisponible : `BILLING_UNAVAILABLE`, `billing_enabled=false`, `checkout_available=false`, `503`.
- Le front doit afficher l’indisponibilité sans simuler un paiement.

---

### `src/api/catalogApi.js`

**Rôle.** Récupérer les modèles, aperçus et spécifications photo.

**Exports.**

- `listTemplates(kind)` : `GET /v1/templates`, avec query `kind` si fourni.
- `getTemplatePreview(kind, templateId)` : `GET /v1/templates/{kind}/{templateId}/preview.svg`.
- `getPhotoSpecs()` : `GET /v1/photo-specs`.
- `getPhotoSpecsAlternate()` : `GET /v1/photo/specs`, conservé pour compatibilité OpenAPI.

**À surveiller.**

- Ce fichier n’est pas le catalogue d’outils ; il concerne les modèles CV/lettre et la photo d’identité.
- Le catalogue d’outils statique est dans `src/config/tools.js`.
- L’aperçu SVG revient sous forme de texte brut car le content-type n’est pas JSON.
- `getPhotoSpecsAlternate` sert de repli ou de variante OpenAPI.

---

### `src/api/documentsApi.js`

**Rôle.** Cycle de vie des documents CV et lettre.

**Champ autorisé.**

- `DATA_FIELDS = ['data', 'template_id']`

`pickDataFields(changes)` filtre le corps avant mise à jour.

**Exports.**

- `listDocuments()` : `GET /v1/documents`.
- `getDocument(documentId)` : `GET /v1/documents/{id}`.
- `updateDocumentData(documentId, changes)` : `PUT /v1/documents/{id}/data`, corps filtré.
- `deleteDocument(documentId)` : `DELETE /v1/documents/{id}`, retour `null` sur `204`.
- `downloadDocument(documentId)` : `GET /v1/documents/{id}/download`, `responseType: 'blob'`.
- `sendDocumentEmail(documentId)` : `POST /v1/documents/{id}/send-email`, retour `null` sur `204`.

**À surveiller.**

- Ne pas envoyer d’autres champs que `data` et `template_id`.
- Le téléchargement retourne un Blob.
- La suppression doit être confirmée dans l’interface.
- Ce fichier ne contient pas de création de lien de partage public.

---

### `src/api/eventsApi.js`

**Rôle.** Envoyer des événements.

**Fonction interne.**

`normalizeEvent(event)` :

- garde `name` comme chaîne trimée et tronquée à 40 caractères ;
- garde `props` uniquement si c’est un objet non tableau ;
- sinon, `props = {}`.

**Exports.**

- `sendEvent()` : `POST /events`, legacy sans corps, retour `null` sur `204`.
- `sendEvents(payload)` : `POST /v1/events`.
  - accepte un événement ou un tableau ;
  - normalise chaque entrée ;
  - lève `Nom d’événement invalide.` si un nom manque ;
  - envoie un objet ou un tableau selon la forme d’entrée.

**À surveiller.**

- Ce module **envoie** des événements ; il ne liste pas d’événements.
- La liste des événements administratifs est dans `adminApi.js`.
- Ne pas envoyer de contenu de fichier dans `props`.
- Un nom vide est rejeté localement avant appel réseau.

---

### `src/api/filesApi.js`

**Rôle.** Récupérer un fichier privé ou un document public par jeton.

**Exports.**

- `getFile(fileId)` : `GET /v1/files/{id}`.
- `downloadByToken(token)` : `GET /v1/d/{token}`.

**À surveiller.**

- `filePath(fileId)` encode l’identifiant avec `encodeURIComponent`.
- `downloadByToken` est le chemin public à partir d’un jeton de partage.
- Ces fonctions ne suppriment pas de fichier et ne listent pas les fichiers.
- Les tokens de partage sont sensibles : ne pas les afficher ni les journaliser.

---

### `src/api/healthApi.js`

**Rôle.** Vérifier la disponibilité globale de l’API.

**Export.**

- `getHealth()` : `GET /health`.

**À surveiller.**

- La route validée est `/api/health`, pas `/api/v1/health`.
- Ce fichier ne contient pas de contrôle de santé IA.
- La réponse est documentée sans schéma détaillé.

---

### `src/api/jobsApi.js`

**Rôle.** Créer, lister, lire et télécharger les jobs de traitement de fichiers.

**Helpers internes.**

- `jobPath(jobId, suffix)` : construit un chemin legacy `/jobs/{id}{suffix}` avec identifiant encodé.
- `resultFileId(file)` : lit `file.file_id` ou extrait l’identifiant d’une URL contenant `/files/...`.

**Exports.**

- `getJob(jobId)` :
  - essaie d’abord `GET /v1/jobs/{id}` ;
  - replie sur `GET /jobs/{id}` uniquement si le statut est `404` ;
  - propage les autres erreurs.
- `downloadJob(jobId, file = null)` :
  - utilise le fichier fourni ou le premier fichier de `result.files` du job ;
  - si un identifiant de fichier est trouvé : `GET /v1/files/{id}` avec `responseType: 'blob'` ;
  - sinon : `GET /jobs/{id}/download` avec `responseType: 'blob'`.
- `createJob(files, tool, options = {})` :
  - construit un `FormData` ;
  - ajoute chaque fichier sous la clé `files` ;
  - ajoute `tool` ;
  - ajoute `options`, déjà chaîne ou sérialisée en JSON ;
  - appelle `POST /v1/jobs`.
- `listJobs({ limit = 20, offset = 0 } = {})` :
  - construit `limit` et `offset` avec `URLSearchParams` ;
  - appelle `GET /v1/jobs?...`.

**À surveiller.**

- Audit `FRONTEND.md` section 5.1 validé : corps `FormData`, champs `files`, `tool`, `options`, `{}` par défaut.
- `202 Accepted` est traité comme un succès par `apiFetch`.
- `FRONTEND.md` écrit parfois `POST /jobs` en raccourci ; le chemin réel retenu est `/v1/jobs`.
- Il n’existe pas de fonction `retryJob`, `listJobFiles` ou `downloadJobFile` dans ce fichier.
- Le téléchargement retourne un Blob.

---

### `src/api/meApi.js`

**Rôle.** Profil connecté, mot de passe, usage et routes RGPD.

**Listes de champs autorisés.**

- `UPDATABLE_FIELDS = ['email', 'first_name', 'last_name', 'profession', 'name', 'terms_accepted', 'marketing_opt_in']`
- `PASSWORD_FIELDS = ['current_password', 'password', 'password_confirmation']`

**Exports.**

- `getMe()` : `GET /me`.
- `patchMe(changes)` : `PATCH /me`, corps filtré avec `pickUpdatableFields`.
- `changePassword(changes)` : `POST /me/password`, corps filtré avec `pickPasswordFields`.
- `getUsage()` : `GET /v1/usage`.
- `exportMe()` : `GET /v1/me/export`.
- `deleteMyData(account = false)` : `DELETE /v1/me/data?account=true|false`.
- `unsubscribe(token)` : `GET /v1/email/unsubscribe?token=...`, peut retourner une page HTML.

**À surveiller.**

- Le champ de nouveau mot de passe s’appelle `password`, pas `new_password`.
- La confirmation s’appelle `password_confirmation`.
- `PATCH /me` ignore toute clé non documentée.
- `deleteMyData(false)` supprime les données associées sans supprimer le compte.
- `unsubscribe` peut retourner du HTML : ne pas forcer un parsing JSON spécifique.
- `GET /me` vise `/api/me`.

---

### `src/api/renderApi.js`

**Rôle.** Rendu de modèles et assistants de réécriture.

**Listes de champs autorisés.**

- `RENDER_FIELDS = ['template_id', 'data', 'format']`
- `CV_REWRITE_FIELDS = ['lang', 'target_job', 'raw_text', 'existing_data']`
- `LETTER_REWRITE_FIELDS = ['lang', 'kind', 'job_title', 'company', 'raw_text', 'cv_data']`

**Helpers internes.**

- `pickFields(fields, changes)` : filtre un objet.
- `rewritePayload(changes)` : filtre puis encode `JSON.stringify` dans un paramètre de requête.

**Exports.**

- `render(kind, changes)` : `POST /v1/render/{kind}`.
- `renderCv(changes)` : `POST /v1/cv/render`.
- `renderLetter(changes)` : `POST /v1/letter/render`.
- `renderLetters(changes)` : `POST /v1/letters/render`.
- `rewriteCv(changes)` : `POST /v1/cv/rewrite`.
- `rewriteLetter(changes)` : `POST /v1/letter/rewrite?payload=...`.
- `rewriteLetters(changes)` : `POST /v1/letters/rewrite?payload=...`.

**À surveiller.**

- Les routes de réécriture de lettres exigent le paramètre `payload`.
- Les corps de réécriture sont validés depuis `FRONTEND.md`.
- Backend actuellement indisponible : `AI_UNAVAILABLE`, `503`.
- Ce fichier ne contient pas de health check ni de polling de rendu.
- Ne pas simuler de rendu local.

---

### `src/api/toolsApi.js`

**Rôle.** Lancer un outil directement par identifiant.

**Export.**

- `runTool(tool)` : `POST /tools/{tool}`, avec identifiant encodé.

**À surveiller.**

- Réponse `202` documentée sans schéma détaillé.
- Ce flux est distinct de `createJob(files, tool, options)` dans `jobsApi.js`.
- Le lancement avec fichiers passe par `jobsApi.js`, pas par ce fichier.
- Ne pas confondre `tool` et `slug` d’affichage.

---

## 6. Hooks

### `src/hooks/useApiAction.js`

**Rôle.** Exécuter manuellement une requête et exposer un état uniforme.

**Signature.**

```js
useApiAction(request, { onSuccess } = {})
```

**État interne.**

- `data`
- `success`
- `loading`
- `error`

**Retour.**

```js
{ data, success, loading, error, run }
```

**`run(...args)`.**

- remet `data` à `null`, `error` à `null`, `success` à `false` ;
- passe `loading` à `true` ;
- appelle `request(...args)` ;
- stocke le résultat dans `data` ;
- appelle `onSuccess?.(payload)` ;
- retourne le payload ou `null` ;
- stocke l’erreur brute dans `error` ;
- remet `loading` à `false` dans `finally`.

**À surveiller.**

- Il n’y a pas d’exécution automatique au montage.
- Il n’y a pas de `reset` ni d’option `immediate`.
- `error` contient l’objet erreur, pas un message : l’interface doit lire `error.message`.
- Ce hook est utilisé par la majorité des hooks métier.

---

### `src/hooks/useAdmin.js`

**Rôle.** Regrouper les actions et lectures du control-room.

**Construction.**

Crée un `useApiAction` pour chaque fonction de `adminApi.js` :

- `dashboard`
- `users`
- `announcement`
- `adminStatus`
- `credits`
- `plan`
- `toolRuns`
- `events`
- `eventErrors`
- `anonymousUsage`
- `settings`
- `setting`

**État global.**

- `loading` : vrai si au moins une action est en cours.
- `error` : première erreur trouvée, sinon `null`.
- `data` : première donnée disponible parmi tableau de bord, utilisateurs et paramètres.

**Retour notable.**

- `users` accepte `users.data.users` ou `users.data`.
- `toolRuns` accepte `toolRuns.data.tool_runs` ou `toolRuns.data`.
- `events` et `eventErrors` acceptent `.events` ou la réponse brute.
- Chaque fonction API est exposée sous son nom via le `.run` correspondant.

**À surveiller.**

- Hook réservé à l’administration.
- Aucun appel n’est lancé au montage.
- Les listes tombent à `[]` si la réponse est absente.
- `error` est une erreur brute.

---

### `src/hooks/useBilling.js`

**Rôle.** Exposer l’état de facturation et la création de Checkout.

**Construction.**

- `status = useApiAction(getBillingStatus)`
- `checkout = useApiAction(createCheckout)`

**Retour.**

- `data` : `status.data ?? checkout.data`
- `status`
- `checkout`
- `checkoutUrl` : `checkout.data?.checkout_url ?? null`
- `sessionId` : `checkout.data?.session_id ?? null`
- `loading`, `error`
- `getBillingStatus`, `createCheckout`

**À surveiller.**

- Aucun chargement automatique.
- Aucune dérivation locale de `billing_enabled` ou `checkout_available`.
- Si le backend répond `503`, l’erreur est exposée telle quelle.
- `createCheckout` n’accepte aucun argument utile : l’API n’a pas de corps documenté.

---

### `src/hooks/useCatalog.js`

**Rôle.** Charger modèles, aperçus et spécifications photo.

**Construction.**

- `list = useApiAction(listTemplates)`
- `preview = useApiAction(getTemplatePreview)`
- `specs = useApiAction(getPhotoSpecs)`
- `alternateSpecs = useApiAction(getPhotoSpecsAlternate)`

**Retour.**

- `data` : première donnée disponible.
- `templates` : `list.data ?? []`.
- `preview`.
- `photoSpecs` : `specs.data ?? alternateSpecs.data`.
- `loading` et `error` agrégés.
- Fonctions `listTemplates`, `getTemplatePreview`, `getPhotoSpecs`, `getPhotoSpecsAlternate`.

**À surveiller.**

- Ce hook ne charge pas `TOOLS`.
- L’aperçu SVG est du texte ou un Blob selon la réponse réelle.
- Le repli photo est transparent pour le composant appelant.
- Aucun appel n’est déclenché automatiquement.

---

### `src/hooks/useChangePassword.js`

**Rôle.** Changer le mot de passe du profil connecté.

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

- `changePassword(changes = {})`.

**Comportement.**

- Appelle `changePasswordRequest` depuis `meApi.js`.
- Stocke la réponse dans `data`.
- Stocke l’erreur brute dans `error`.
- Retourne le payload ou `null`.

**À surveiller.**

- Les champs autorisés sont filtrés dans `meApi.js`.
- Le nouveau mot de passe s’appelle `password`.
- Ne pas conserver le mot de passe dans l’état local après soumission.
- Aucun message de succès n’est calculé ici.

---

### `src/hooks/useDocuments.js`

**Rôle.** Couvrir le cycle de vie complet des documents.

**Construction.**

Actions basées sur `useApiAction` :

- `list`
- `get`
- `update`
- `remove`
- `download`
- `sendEmail`

**Retour.**

- `data` : `get.data ?? update.data ?? download.data ?? list.data`.
- `documents` : `list.data ?? []`.
- `sentEmail` : `sendEmail.success`.
- `loading` : vrai si au moins une action est en cours.
- `error` : première erreur disponible.
- Fonctions : `listDocuments`, `getDocument`, `updateDocumentData`, `deleteDocument`, `downloadDocument`, `sendDocumentEmail`.

**À surveiller.**

- Aucune action n’est lancée au montage.
- La suppression ne retire pas localement le document : l’interface doit recharger si nécessaire.
- `downloadDocument` retourne un Blob.
- `sentEmail` est un booléen basé sur `success`.

---

### `src/hooks/useEmailLink.js`

**Rôle.** Gérer le lien magique et deux routes de vérification d’email.

**Options.**

```js
useEmailLink({ onSuccess } = {})
```

**Construction.**

- `start = useApiAction(emailStart)`
- `verify = useApiAction(emailVerify, { onSuccess })`
- `resend = useApiAction(emailResend)`
- `verifyV1 = useApiAction(verifyEmailV1, { onSuccess })`

**Retour.**

- `data` : vérification v1, vérification standard, puis `start`.
- `sent` : `start.success || resend.success`.
- `verified` : `verify.success || verifyV1.success`.
- `loading` et `error` agrégés.
- Fonctions : `emailStart`, `emailVerify`, `emailResend`, `verifyEmailV1`.

**À surveiller.**

- `onSuccess` n’est branché que sur les deux vérifications.
- Les tokens ne doivent pas être journalisés.
- `emailStart` attend `{ email, return_to }` ; le filtrage est fait dans `authApi.js`.
- Aucun appel automatique au montage.

---

### `src/hooks/useEvents.js`

**Rôle.** Envoyer un événement simple ou groupé.

**Construction.**

- `legacy = useApiAction(sendEvent)`
- `batch = useApiAction(sendEvents)`

**Retour.**

- `data` : `batch.data ?? legacy.data`.
- `sent` : succès de l’un ou l’autre.
- `loading`, `error`.
- `sendEvent`, `sendEvents`.

**À surveiller.**

- Ce hook n’écoute pas et ne liste pas d’événements.
- `sendEvents` peut lever une erreur locale avant l’appel réseau si le nom est vide.
- Ne pas transmettre de contenu de fichier dans les propriétés.

---

### `src/hooks/useFiles.js`

**Rôle.** Récupérer un fichier privé ou public.

**Construction.**

- `file = useApiAction(getFile)`
- `download = useApiAction(downloadByToken)`

**Retour.**

- `data` : `file.data ?? download.data`.
- `loading`, `error`.
- `getFile`, `downloadByToken`.

**À surveiller.**

- Aucune suppression, liste ou aperçu n’est implémenté ici.
- `downloadByToken` utilise le chemin public `/v1/d/{token}`.
- Les jetons publics sont sensibles.

---

### `src/hooks/useForgotPassword.js`

**Rôle.** Demander un lien de réinitialisation.

**État.**

- `loading`
- `error`
- `sent`

**Fonction.**

- `forgotPassword(email)`.

**Comportement.**

- Remet `sent` à `false`.
- Appelle `forgotPasswordRequest(email)`.
- Met `sent` à `true` après succès.
- Retourne `true` ou `false`.
- Stocke l’erreur brute dans `error`.

**À surveiller.**

- La réponse `204` est sans corps : le booléen `sent` porte le succès.
- Le message affiché dans l’interface doit rester générique.
- Ne pas journaliser l’email.

---

### `src/hooks/useGoogleAuth.js`

**Rôle.** Exposer les trois flux Google de l’API.

**Options.**

```js
useGoogleAuth({ onSuccess } = {})
```

**Construction.**

- `login = useApiAction(googleLogin, { onSuccess })`
- `callback = useApiAction(googleCallback, { onSuccess })`
- `auth = useApiAction(googleAuth, { onSuccess })`

**Retour.**

- `data` : `auth.data ?? callback.data ?? login.data`.
- `success`, `loading`, `error`.
- `googleLogin`, `googleCallback`, `googleAuth`.

**À surveiller.**

- Ce hook **ne charge pas** le SDK Google et ne crée pas de bouton.
- Le composant Google est décrit dans le guide `.jsx`.
- `googleCallback` accepte `code`, `state` et `error`.
- `googleAuth` envoie `credential`, `terms_accepted` et `marketing_opt_in`.
- `onSuccess` est appelé par les trois actions.

---

### `src/hooks/useHealth.js`

**Rôle.** Charger `/health` au montage et permettre un rechargement manuel.

**État.**

- `data`
- `ok` : `data?.ok ?? null`
- `capabilities` : `data?.capabilities ?? null`
- `loading`, initialement `true`
- `error`

**Fonctions.**

- `reload()` : recharge manuellement.

**Comportement.**

- Le premier appel est fait dans un `useEffect`.
- Un drapeau `mounted` évite les mises à jour après démontage.
- `reload` utilise les mêmes règles d’état.

**À surveiller.**

- Il n’existe pas de contrôle IA ici.
- Aucun polling automatique n’est configuré.
- `error` contient l’objet erreur.

---

### `src/hooks/useJob.js`

**Rôle.** Charger le détail d’un job pour un identifiant donné.

**Entrée.**

```js
useJob(jobId)
```

**État interne.**

Objet unique :

- `jobId`
- `data`
- `loading`
- `error`

**Comportement.**

- Chargement initial dans `useEffect` si `jobId` est présent.
- `reload()` recharge manuellement.
- `active` évite les mises à jour après démontage ou changement d’identifiant.
- `isCurrent` compare `state.jobId` au `jobId` courant pour éviter d’afficher une réponse périmée.

**Retour.**

- `data`, `loading`, `error`, `reload`.

**À surveiller.**

- Sans `jobId`, `data` et `error` sont `null`.
- Le hook ne gère ni polling ni téléchargement.
- `getJob` contient le repli legacy dans l’API.

---

### `src/hooks/useJobDownload.js`

**Rôle.** Télécharger le résultat d’un job ou un fichier précis.

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

```js
download(jobId, file = null)
```

**Comportement.**

- Remet `data` à `null` et `error` à `null`.
- Appelle `downloadJobRequest(jobId, file)` depuis `jobsApi.js`.
- Stocke le Blob ou payload retourné dans `data`.
- Retourne le payload ou `null`.
- Stocke l’erreur brute dans `error`.

**À surveiller.**

- Ce hook ne crée pas d’URL objet et ne déclenche pas le téléchargement dans le navigateur.
- La transformation du Blob en fichier téléchargé est à faire dans le composant.
- `file` peut être un objet avec `file_id` ou `url`.

---

### `src/hooks/useJobsManager.js`

**Rôle.** Créer un job et consulter l’historique paginé.

**Options.**

```js
useJobsManager({ onSuccess } = {})
```

**Construction.**

- `create = useApiAction(createJob, { onSuccess })`
- `list = useApiAction(listJobs)`

**Retour.**

- `data` : `create.data ?? list.data`.
- `jobs` : `list.data?.jobs ?? list.data ?? []`.
- `created` : `create.success`.
- `loading`, `error`.
- `createJob`, `listJobs`.

**À surveiller.**

- Aucun polling automatique n’est implémenté ici.
- Aucun téléchargement ni retry n’est implémenté ici.
- `createJob` attend `(files, tool, options = {})`.
- `listJobs` attend `(params)` avec `limit` et `offset` par défaut.

---

### `src/hooks/useLocale.js`

**Rôle.** Accéder au contexte linguistique.

**Retour.**

Le contexte fourni par `LocaleProvider` :

- `locale`
- `setLocale`
- `toggleLocale`
- `t`

**Erreur.**

- Lève `useLocale doit être utilisé dans LocaleProvider.` si le provider est absent.

**À surveiller.**

- Ce hook ne contient ni logique API ni détection navigateur.
- La persistance et la détection sont décrites dans le guide `.jsx`, dans `LocaleContext.jsx`.
- Toute nouvelle page doit utiliser `t` au lieu de texte codé en dur.

---

### `src/hooks/useLogin.js`

**Rôle.** Connecter l’utilisateur.

**Options.**

```js
useLogin({ onSuccess } = {})
```

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

```js
login(changes = {})
```

**Comportement.**

- Appelle `loginRequest(changes)` depuis `authApi.js`.
- Stocke la réponse dans `data`.
- Appelle `onSuccess?.()` uniquement après succès.
- Retourne le payload ou `null`.

**À surveiller.**

- Les champs sont filtrés dans `authApi.js`.
- Le hook ne rafraîchit pas le profil tout seul.
- `error` est un objet erreur.

---

### `src/hooks/useLogout.js`

**Rôle.** Déconnecter l’utilisateur.

**Options.**

```js
useLogout({ onSuccess } = {})
```

**État.**

- `loading`
- `error`

**Fonction.**

- `logout()`.

**Comportement.**

- Appelle `logoutRequest()`.
- Appelle `onSuccess?.()` uniquement après succès.
- Retourne le résultat de l’API ou `null`.
- La réponse `204` devient `null` dans `apiFetch`.

**À surveiller.**

- Le hook ne redirige pas et ne rafraîchit pas le profil tout seul.
- Les cookies sont gérés par le backend.
- `error` est un objet erreur.

---

### `src/hooks/useMe.js`

**Rôle.** Charger le profil courant, le quota et l’état invité.

**Helper interne.**

`extractQuota(payload)` retourne :

- `payload.quota` si présent ;
- sinon un objet composé de :
  - `plan`
  - `credits`
  - `paywall_enabled`
  - `free_uses_left`
  - `ai_uses_left_today`
  - `daily_jobs_left`
  - `daily_renders_left`
  - `limits`

**État.**

- `data`
- `user`
- `quota`
- `loading`, initialement `true`
- `error`

**Fonction.**

- `reload()`.

**Comportement.**

- Chargement initial dans `useEffect`.
- `user = payload?.user ?? null`.
- `quota = extractQuota(payload)`.
- `mounted` évite les mises à jour après démontage.
- `isGuest = !loading && user === null`.

**À surveiller.**

- Un invité n’est jamais une erreur.
- Il n’existe pas de cache `sessionStorage` dans ce hook.
- Il n’existe pas de normalisation d’email ici.
- Après connexion, inscription ou déconnexion, l’appelant doit appeler `reload` ou le contexte doit le faire.

---

### `src/hooks/useMeActions.js`

**Rôle.** Regrouper les actions RGPD et la désinscription marketing.

**Options.**

```js
useMeActions({ onSuccess } = {})
```

**Construction.**

- `exportAction = useApiAction(exportMe)`
- `deleteAction = useApiAction(deleteMyData, { onSuccess })`
- `unsubscribeAction = useApiAction(unsubscribe)`

**Retour.**

- `exportedData`
- `deleted`
- `unsubscribed`
- `loading`, `error`
- `exportMe`, `deleteMyData`, `unsubscribe`

**À surveiller.**

- Ce hook ne met pas à jour le profil : voir `usePatchMe`.
- `deleteMyData(account)` accepte un booléen.
- `unsubscribe(token)` peut retourner du HTML.
- `onSuccess` est branché uniquement sur la suppression de données.

---

### `src/hooks/useMeContext.js`

**Rôle.** Lire le contexte `Me`.

**Erreur.**

- Lève `useMeContext doit être utilisé dans MeProvider.` si le provider est absent.

**À surveiller.**

- Ce hook ne fait aucun appel réseau.
- Le provider est décrit dans `src/contexts/MeContext.jsx`, dans le guide `.jsx`.
- Toute évolution du contexte doit rester compatible avec ce hook.

---

### `src/hooks/usePatchMe.js`

**Rôle.** Mettre à jour le profil connecté.

**Options.**

```js
usePatchMe({ onSuccess } = {})
```

**Retour.**

- `data`
- `success`
- `loading`
- `error`
- `patchMe`

**À surveiller.**

- `patchMe` est un wrapper de `.run` fourni par `useApiAction`.
- Les champs sont filtrés dans `meApi.js`.
- Ce hook ne rafraîchit pas le contexte tout seul.
- `error` est un objet erreur.

---

### `src/hooks/useRegister.js`

**Rôle.** Créer un compte.

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

- `register(changes = {})`.

**Comportement.**

- Appelle `registerRequest(changes)`.
- Stocke la réponse dans `data`.
- Retourne le payload ou `null`.

**À surveiller.**

- Les champs autorisés sont filtrés dans `authApi.js`.
- Le repli `/v1/auth/register` est géré côté API.
- Le hook ne connecte pas automatiquement l’utilisateur.

---

### `src/hooks/useRender.js`

**Rôle.** Regrouper les actions de rendu et de réécriture.

**Construction.**

Sept actions `useApiAction` :

- `render`
- `renderCv`
- `renderLetter`
- `renderLetters`
- `rewriteCv`
- `rewriteLetter`
- `rewriteLetters`

**Retour.**

- `data` : première réponse disponible.
- `rewritten` : vrai si une réécriture a réussi.
- `loading` agrégé.
- `error` agrégé.
- Fonctions correspondant aux sept actions.

**À surveiller.**

- Aucun health check ni polling de statut n’est implémenté ici.
- Les payloads de réécriture de lettre sont encodés dans `renderApi.js`.
- Backend actuellement indisponible : erreur `503` exposée dans `error`.

---

### `src/hooks/useResendEmail.js`

**Rôle.** Renvoyer l’email de vérification.

**État.**

- `loading`
- `error`
- `sent`

**Fonction.**

- `resendEmail(email)`.

**Comportement.**

- Appelle `resendEmailRequest(email)`.
- Met `sent` à `true` après succès.
- Retourne `true` ou `false`.

**À surveiller.**

- Corps validé : `{ email }`.
- Ne pas révéler si un compte existe.
- Le message utilisateur doit rester générique.

---

### `src/hooks/useResetPassword.js`

**Rôle.** Réinitialiser le mot de passe avec un token.

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

- `resetPassword(changes = {})`.

**Comportement.**

- Appelle `resetPasswordRequest(changes)`.
- Stocke la réponse dans `data`.
- Retourne le payload ou `null`.

**À surveiller.**

- Champs autorisés : `token`, `password`, `password_confirmation`.
- Le filtrage est fait dans `authApi.js`.
- Ne pas journaliser le token ni le mot de passe.

---

### `src/hooks/useRunTool.js`

**Rôle.** Lancer un outil directement par identifiant.

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

- `runTool(tool)`.

**Comportement.**

- Appelle `runToolRequest(tool)` depuis `toolsApi.js`.
- Stocke la réponse dans `data`.
- Retourne le payload ou `null`.

**À surveiller.**

- Ce hook ne gère ni fichiers, ni options, ni téléchargement.
- Pour un traitement avec fichiers, utiliser `useJobsManager` et `createJob`.
- La réponse `202` est un succès.

---

### `src/hooks/useTheme.js`

**Rôle.** Gérer le thème système, clair ou sombre.

**Constantes.**

- `THEME_STORAGE_KEY = 'nanofile.theme'`
- `THEMES = ['system', 'light', 'dark']`
- `THEME_COLORS = { light: '#ffffff', dark: '#0b1120' }`

**Helpers internes.**

- `normalizeTheme(value)` : replie sur `system`.
- `writeStoredTheme(value)` : écrit dans `localStorage`.
- `readStoredTheme()` : lit le thème persisté.
- `readSystemTheme()` : lit `prefers-color-scheme`.
- `applyTheme(resolvedTheme)` :
  - bascule la classe `dark` sur `document.documentElement` ;
  - met à jour la balise `<meta name="theme-color">`.

**État.**

- `theme` : choix utilisateur.
- `systemTheme` : préférence système observée.
- `resolvedTheme` : thème effectif.

**Retour.**

- `theme`
- `resolvedTheme`
- `isDark`
- `setTheme`
- `cycleTheme`

**`cycleTheme`.**

Ordre : `light` → `dark` → `system` → `light`.

**À surveiller.**

- Deux écouteurs sont nettoyés : `matchMedia change` et `storage`.
- Le thème est indépendant de la langue.
- Le meta `theme-color` est mis à jour dynamiquement.

---

### `src/hooks/useUsage.js`

**Rôle.** Charger la consommation détaillée du profil.

**Construction.**

- `usage = useApiAction(getUsage)` avec `getUsage` depuis `meApi.js`.

**Retour.**

- `data`
- `usage`
- `loading`
- `error`
- `getUsage`

**À surveiller.**

- Aucun appel automatique au montage.
- Aucun calcul local de quota.
- Endpoint : `GET /v1/usage`.

---

### `src/hooks/useVerifyEmail.js`

**Rôle.** Vérifier l’email avec le token reçu par lien.

**Options.**

```js
useVerifyEmail({ onSuccess } = {})
```

**État.**

- `data`
- `loading`
- `error`

**Fonction.**

- `verifyEmail(token)`.

**Comportement.**

- Appelle `verifyEmailRequest(token)`.
- Stocke la réponse dans `data`.
- Appelle `onSuccess?.()` après succès.
- Retourne le payload ou `null`.

**À surveiller.**

- Corps validé : `{ token }`.
- Route `/auth/verify`, distincte de `/v1/auth/verify-email`.
- Ne pas journaliser le token.

---

## 7. Points de vigilance transversaux

### 7.1 Chemin d’un appel API

1. Le hook appelle une fonction de `src/api/`.
2. La fonction API construit un chemin relatif à `VITE_API_URL`.
3. `apiFetch` ajoute les en-têtes, les cookies et le jeton anonyme.
4. `apiFetch` gère `204`, JSON, binaire et erreurs normalisées.
5. Le hook met à jour ses états.
6. Le composant `.jsx` affiche les états.

### 7.2 Erreurs

Les hooks stockent l’objet `ApiError` dans `error`.

Propriétés utiles :

- `error.message`
- `error.status`
- `error.code`
- `error.details`
- `error.payload`

Formats d’erreur gérés par `client.js` :

- `HTTPValidationError` sous forme de tableau `detail` ;
- `{ detail: { code, message } }` ;
- `{ error: { code, message, details } }` ;
- messages spécifiques pour quota, crédits insuffisants, ressource introuvable, résultat expiré et limite atteinte.

### 7.3 Invité

Un utilisateur non connecté est représenté par `user: null` avec un quota. Ce n’est **pas** une erreur. `useMe.isGuest` reflète cet état une fois le chargement terminé.

### 7.4 Secret et vie privée

Ne jamais journaliser :

- mots de passe ;
- tokens de vérification, reset ou lien magique ;
- credential Google ;
- jetons de partage téléchargeables ;
- contenu brut des fichiers utilisateur.

### 7.5 Erreurs fréquentes à éviter

- Confondre `toolsApi.js` (lancement direct) et `jobsApi.js` (traitement avec fichiers).
- Confondre `verifyEmail`, `verifyEmailV1` et `emailVerify`.
- Envoyer `new_password` au lieu de `password` dans `meApi.js`.
- Ajouter un champ non documenté à un corps filtré.
- Attendre un retour automatique de `useApiAction` : il faut appeler `run`.
- Supposer que `useJobsManager` fait du polling : ce n’est pas le cas.
- Supposer que `useGoogleAuth` charge le SDK Google : ce n’est pas le cas.
- Supposer que `useCatalog` charge les outils : il charge les modèles et specs photo.

### 7.6 Ajout d’un nouveau fichier `.js`

Checklist :

1. Choisir la bonne couche : API, hook, config ou i18n.
2. Consulter l’OpenAPI avant tout nouveau chemin API.
3. Consulter `FRONTEND.md` pour les corps validés.
4. Garder les commentaires et explications en français.
5. Exporter uniquement ce qui est nécessaire.
6. Utiliser `apiFetch` au lieu d’un `fetch` direct dans `src/api/`.
7. Filtrer les champs de requête avec une liste explicite quand le contrat est strict.
8. Nettoyer abonnements, timers et drapeaux de montage dans les hooks.
9. Mettre à jour ce document.
10. Lancer `npm run lint && npm run build`.

---

## 8. État fonctionnel connu du backend

Ces points influencent directement plusieurs modules API et hooks :

- Facturation indisponible : `BILLING_UNAVAILABLE`, `billing_enabled=false`, `checkout_available=false`, réponse `503`.
- IA indisponible : `AI_UNAVAILABLE`, réponse `503`.
- Erreur `422` signalée sans URL, méthode ni corps exact dans le diagnostic initial.
- Pas de session admin disponible pour valider les routes du control-room.
- `pdf_sign` et `photo_id` restent bloquants côté backend.
- Photo de profil non implémentée car absente de l’API et non validée par l’utilisateur.
- Champs légaux `[À compléter]` / `[To complete]` à remplir puis à valider juridiquement.

Ces limitations ne doivent pas être contournées côté front.
