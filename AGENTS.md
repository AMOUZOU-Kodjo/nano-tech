# Instructions du projet NanoFile Front

## Objectif
- Construire le front-end React (Vite) qui consomme l'API REST `https://api.nanofile.tech/api`.
- Stack : JavaScript ES6+, Tailwind CSS v4 via le plugin Vite, CSS global minimal.

## Règles de travail
- Créer ou modifier **un seul fichier par réponse**, jamais plusieurs.
- Rédiger tous les commentaires et toutes les explications en **français**, de façon claire et concise : rôle des fonctions, des états et des blocs logiques.
- Après avoir présenté ou créé un fichier, **s'arrêter immédiatement** et demander validation avant de passer au fichier suivant. Ne jamais anticiper les fichiers suivants.
- Ne rien committer sans demande explicite.

## Architecture
- `src/api/` : appels HTTP purs, aucun état React.
- `src/hooks/` : logique métier et états React (`loading`, `error`, `data`).
- `src/components/` : composants visuels réutilisables.
- `src/pages/` : vues principales de l'application.

## API, OpenAPI et FRONTEND.md
- Base URL : variable `VITE_API_URL` définie dans `.env` à `https://api.nanofile.tech/api`.
- Avant chaque fichier de `src/api/`, consulter `https://api.nanofile.tech/openapi.json` **en priorité**.
- L'OpenAPI fait foi pour les chemins, méthodes, paramètres et codes de réponse. `FRONTEND.md` est désormais utilisé en complément, avec validation globale de l'utilisateur, pour les corps de requête absents de l'OpenAPI.
- Extraire de l'OpenAPI le chemin, la méthode, les paramètres, le corps et les codes de réponse exacts.
- Ne pas inventer de champs : n'ajouter que ceux explicitement documentés dans l'OpenAPI ou validés depuis `FRONTEND.md`.
- Quand les deux sources divergent, garder le chemin OpenAPI disponible sous `/api` et compléter avec le corps `FRONTEND.md` ; c'est l'arbitrage validé pour `/auth/verify`, `/auth/resend`, `/auth/password/*`, `/auth/register`, `/auth/login` et `/me/password`.
- Les chemins présents uniquement dans `FRONTEND.md` ou dans l'OpenAPI `/api/v1` restent utilisables pour les fonctionnalités qui n'ont pas d'équivalent `/api`, avec le préfixe relatif adéquat (`/v1/...`).
- Arbitrages déjà validés :
  - Les routes utilisent le préfixe `/api` déjà contenu dans `VITE_API_URL` : `GET /me` vise `/api/me` (vérifié avec `/api/health`, contrairement à `/api/v1/health`).
  - Trois formats d'erreur sont gérés : `HTTPValidationError`, `{ detail: { code, message } }` et `{ error: { code, message, details } }`.
  - `PATCH /me` envoie les champs documentés dans `FRONTEND.md` : `email`, `first_name`, `last_name`, `profession`, `name`, `terms_accepted`, `marketing_opt_in`.
  - `useMe` accepte la forme invité `{ user: null, quota: { limit, used, remaining } }` et la forme riche décrite dans `FRONTEND.md`.
  - `POST /auth/verify` envoie `{ token }` ; `POST /auth/resend` envoie `{ email }`.
  - Les endpoints sans équivalent `/api` utilisent le préfixe `/v1/...` : Google v1, lien magique, documents, création/liste de jobs, facturation, rendu/IA, usage et routes RGPD.
  - Le control-room administratif est exclu du front public.
- Gérer les réponses `204` sans parsing JSON.
- Un invité n'est jamais une erreur, quelle que soit la forme de la réponse.

## Arborescence
- Étapes 1 à 5 figées et validées.
- Étape 6+ évolutive : traiter les endpoints publics par domaine ; regrouper plusieurs fichiers uniquement sur consigne explicite de l'utilisateur.

## Vérification
- Après les changements, exécuter les commandes disponibles : `npm run lint`, puis `npm run build`.
- Si la commande de lint n'existe pas, la demander à l'utilisateur avant de continuer.
