# Contrat frontend — NanoFile API v1

Base de production : `https://api.nanofile.tech`

Préfixe de toutes les routes documentées : `/api/v1`
Format : JSON, sauf `POST /jobs` (multipart/form-data) et les téléchargements.


---

## 1. Appel API minimal

```ts
const API = "https://api.nanofile.tech";

export async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API}/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body && !(init.body instanceof FormData)
        ? {"Content-Type": "application/json"}
        : {}),
      ...(init.headers || {}),
    },
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw data?.error ?? {code: "PROCESSING_FAILED", message: "Request failed"};
  return data;
}
```

- Le cookie de session est `HttpOnly`, `Secure`, `SameSite=Lax`, domaine `.nanofile.tech`.
- Lorsque le front est sur `nanofile.tech` ou `www.nanofile.tech`, utiliser `credentials: "include"` ; ne jamais stocker le cookie en `localStorage`.
- Les visiteurs anonymes reçoivent un cookie d’appareil. Le front peut aussi envoyer `X-Anon-Id: <token>` renvoyé par `GET /me` (`anon_token`) pour stabiliser le quota entre onglets.
- Envoyer `Accept-Language: fr|en` : les messages d’erreur v1 sont en anglais, mais la langue pilote les emails.

---

## 2. Erreurs

Toutes les erreurs v1 ont la forme :

```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "The file exceeds the allowed size.",
    "details": {}
  }
}
```

Codes principaux :

| Code | HTTP | Signification |
|---|---:|---|
| `VALIDATION_ERROR` | 422 | Champ ou structure invalide |
| `AUTH_REQUIRED` | 401 | Connexion nécessaire |
| `INVALID_CREDENTIALS` | 401 | Email/mot de passe incorrect |
| `EMAIL_UNVERIFIED` | 403 | Adresse email non confirmée |
| `EMAIL_TAKEN` | 409 | Email déjà inscrit |
| `TERMS_REQUIRED` | 422 | CGU non acceptées |
| `TOOL_UNAVAILABLE` | 409 | Outil désactivé côté admin |
| `QUOTA_EXCEEDED` | 402 | Essais gratuits visiteur épuisés |
| `INSUFFICIENT_CREDITS` | 402 | Paywall actif et solde insuffisant |
| `DAILY_LIMIT_REACHED` | 429 | Limite quotidienne atteinte |
| `RATE_LIMITED` | 429 | Trop de requêtes |
| `FILE_TOO_LARGE` | 413 | Fichier/pages/durée trop important |
| `UNSUPPORTED_FORMAT` | 415 | Format refusé pour cet outil |
| `PASSWORD_PROTECTED_PDF` | 422 | PDF protégé |
| `NO_FACE_DETECTED` / `MULTIPLE_FACES` | 422 | Photo d’identité invalide |
| `DOCUMENT_QUOTA_EXCEEDED` | 409 | Trop de documents ou stockage plein |
| `DOCUMENT_NOT_FOUND` / `DOCUMENT_EXPIRED` | 404 / 410 | Document absent ou expiré |
| `NOT_FOUND` / `EXPIRED` | 404 / 410 | Job/resultat introuvable ou supprimé |
| `PROCESSING_FAILED` | 500/503 | Échec de traitement |
| `BILLING_UNAVAILABLE` | 503 | Stripe non configuré |

---

## 3. Authentification

### 3.1 Inscription par email + mot de passe

`POST /auth/register` → `201`

```json
{
  "email": "user@example.com",
  "password": "motdepasse-long",
  "password_confirmation": "motdepasse-long",
  "terms_accepted": true,
  "marketing_opt_in": false,
  "name": "Prénom Nom"
}
```

Réponse :

```json
{
  "user": {"id": 12, "email": "user@example.com", "provider": "email"},
  "email_verification_required": true
}
```

Aucun cookie n’est posé avant vérification. Un email de confirmation est envoyé.

### 3.2 Confirmation de l’email

`POST /auth/verify-email`

```json
{"token": "token-du-lien"}
```

Réponse : payload `GET /me` + cookie de session posé.

### 3.3 Connexion

`POST /auth/login`

```json
{"email": "user@example.com", "password": "motdepasse-long"}
```

Réponse : payload `GET /me` + cookie de session.

Limites : 30 tentatives/IP/15 min et 10 tentatives/email/15 min.

### 3.4 Lien magique

`POST /auth/email/start` → `204`

```json
{"email": "user@example.com", "return_to": "/dashboard"}
```

Le front reçoit `https://nanofile.tech/auth/verify?token=...&return_to=...`, puis appelle :

`POST /auth/email/verify`

```json
{"token": "token-du-lien"}
```

Réponse : payload `GET /me` + cookie. Après une première connexion par lien magique, afficher l’écran CGU et appeler `PATCH /me` avec `terms_accepted: true`.

`POST /auth/email/resend` → `204` : renvoi avec `{"email": "..."}` ; ne révèle pas si le compte existe.

### 3.5 Google

`POST /auth/google`

```json
{
  "credential": "id-token-google",
  "terms_accepted": true,
  "marketing_opt_in": false
}
```

Un nouvel utilisateur Google doit accepter les CGU. Réponse : payload `GET /me` + cookie.

### 3.6 Mot de passe oublié

- `POST /auth/password/forgot` → `204` avec `{"email": "..."}`.
- `POST /auth/password/reset` → `{"ok": true}` avec `{token, password, password_confirmation}`.
- `POST /me/password` avec `{current_password, password, password_confirmation}`.

### 3.7 Déconnexion

`POST /auth/logout` → `204`.

---

## 4. Profil, quotas, RGPD

### `GET /me`

Réponse :

```json
{
  "authenticated": true,
  "user": {
    "id": 12,
    "email": "user@example.com",
    "first_name": "Prénom",
    "last_name": "Nom",
    "provider": "email",
    "plan": "free",
    "plan_expires_at": null,
    "marketing_opt_in": false,
    "terms_accepted_at": "2026-11-19T12:00:00",
    "terms_version": "2026-11"
  },
  "plan": "free",
  "credits": 0,
  "paywall_enabled": false,
  "free_uses_left": null,
  "ai_uses_left_today": 5,
  "daily_jobs_left": 100,
  "daily_renders_left": 30,
  "limits": {
    "tier": "user",
    "max_file_mb": 200,
    "max_total_mb": 400,
    "max_files": 30,
    "max_pdf_pages": 300,
    "max_video_minutes": 20,
    "max_documents": 200,
    "max_document_storage_mb": 500
  },
  "tools_enabled": {"compress": true, "pdf_to_word": true},
  "anon_token": "..."
}
```

`free_uses_left`, `daily_jobs_left` et `daily_renders_left` valent `null` pour un visiteur anonyme. `GET /usage` renvoie la même réponse avec un objet `ai` supplémentaire `{limit, used, remaining, resets_at}`.

### `PATCH /me`

Champs acceptés : `email`, `first_name`, `last_name`, `profession`, `name`, `terms_accepted`, `marketing_opt_in`.

```json
{"first_name": "Ada", "marketing_opt_in": true, "terms_accepted": true}
```

Réponse : `{"user": {...}, "email_verification_required": false}`.

Un email modifié doit être reconfirmé ; un lien est envoyé automatiquement.

### Autres routes

- `GET /me/export` : export JSON RGPD (profil, jobs, documents).
- `DELETE /me/data` : supprime les documents et données associées.
- `DELETE /me/data?account=true` : supprime aussi le compte et révoque les sessions. Action irréversible, demander une confirmation explicite dans le front.
- `GET /email/unsubscribe?token=...` : désinscription marketing depuis l’email ; renvoie une page HTML.

---

## 5. Traitements de fichiers

### 5.1 Créer un job

`POST /jobs` → `202`, `multipart/form-data` :

| Champ | Type | Description |
|---|---|---|
| `files` | File[] | 1 à N fichiers |
| `tool` | string | Nom de l’outil |
| `options` | string | Objet JSON sérialisé, `{}` par défaut |

Exemple navigateur :

```ts
const form = new FormData();
for (const file of files) form.append("files", file);
form.append("tool", "compress");
form.append("options", JSON.stringify({level: "medium"}));

const job = await api("/jobs", {method: "POST", body: form});
```

Réponse au statut `202` :

```json
{
  "id": "job-id",
  "tool": "compress",
  "status": "queued",
  "stage": null,
  "progress": 0,
  "eta_seconds": null,
  "created_at": "...",
  "finished_at": null,
  "input_bytes": 12345,
  "result": null,
  "error": null
}
```

### 5.2 Outils et options

| Outil | Fichiers | Options |
|---|---|---|
| `compress` | images, PDF, vidéos, Word/Excel/PowerPoint/ODF | `level: "basic"|"medium"|"max"` ou `target_size_kb` |
| `pdf_to_word` | 1 PDF | — |
| `pdf_to_images` | 1 PDF | `pages: "all"|"1,3-5"|[1,3]`, `format: "png"|"jpg"`, `dpi: 72..600` |
| `images_to_pdf` | images | `order: ["nom.jpg", ...]` |
| `zip` | fichiers libres | — |
| `pdf_merge` | 2+ PDF | — |
| `pdf_split` | 1 PDF | `ranges: "1-3,5"` |
| `pdf_reorder` | 1 PDF | `order: [3,1,2]` |
| `pdf_sign` | PDF + image de signature | `signature_text`, `page`, `position: "bottom_right"|"bottom_left"|"top_right"|"top_left"` |
| `pdf_protect` | 1 PDF | `password` |
| `pdf_watermark` | 1 PDF | `text` |
| `photo_id` | 1 image | `country`, `document`, `background`, `sheet: "10x15"|null`, `max_size_kb` |

Notes importantes :

- Le champ `signature_file_id` de l’ancien schéma n’est pas utilisé : envoyer l’image de signature comme deuxième fichier.
- Les pays/documents disponibles sont listés par `GET /photo-specs` ou `GET /photo/specs`.
- Un visiteur anonyme obtient un aperçu filigrané pour `photo_id`.
- La taille cible est plafonnée par la limite admin `max_target_pct` ; si elle est réduite, `target_met` vaut `false` et un avertissement est renvoyé.
- Si la compression rendait un fichier plus gros, l’original est conservé et `target_met` vaut `false`.
- Les PDF protégés par mot de passe sont refusés avant traitement.

### 5.3 Suivi d’un job

`GET /jobs/{id}` renvoie le même objet que la création. Statuts possibles : `queued`, `running`, `done`, `failed`.

Recommandation : interroger toutes les 800 ms à 1 s, puis s’arrêter sur `done`/`failed`. Le champ `progress` va de 0 à 100, `stage` est une étape lisible et `eta_seconds` une estimation.

`GET /jobs?limit=20&offset=0` renvoie l’historique :

```json
{"jobs": [], "total": 0, "limit": 20, "offset": 0}
```

### 5.4 Résultat et téléchargement

Sur `done` :

```json
{
  "result": {
    "files": [
      {
        "file_id": "job-id_0",
        "name": "resultat.pdf",
        "size_bytes": 4567,
        "url": "/api/v1/files/job-id_0"
      }
    ],
    "target_met": true
  },
  "quality_warning": null
}
```

Télécharger `GET /files/{file_id}` avec `credentials: "include"` ; la réponse contient `Content-Disposition: attachment`. Ne jamais tenter de deviner le chemin disque.

Sur `failed`, lire `error.code`, `error.message` et `error.details`.

### 5.5 Limites appliquées

- Visiteur : 30 Mo/fichier, 60 Mo/total, 10 fichiers, 3 essais gratuits, 3 min de vidéo.
- Utilisateur : 200 Mo/fichier, 400 Mo/total, 30 fichiers, 20 min de vidéo.
- PDF : 300 pages maximum sauf réglage admin.
- 30 jobs/min/appareil ; 100 jobs/jour et 30 rendus/jour pour un compte.
- L’API continue d’accepter jusqu’à 450 Mo au niveau Caddy, mais les limites applicatives ci-dessus s’appliquent en amont.

Lire `GET /me` pour connaître les valeurs réellement actives ; l’admin peut les modifier.

---

## 6. Documents CV / lettre

### 6.1 Modèles

`GET /templates?kind=cv|letter`
`GET /templates/{kind}/{template_id}/preview.svg`

### 6.2 Rendu

`POST /cv/render`, `POST /letter/render`, `POST /letters/render` ou `POST /render/{kind}`

```json
{
  "template_id": "moderne",
  "data": {"basics": {"full_name": "Ada Lovelace"}},
  "format": "html"
}
```

- `format: "html"` renvoie du HTML, avec filigrane pour les visiteurs anonymes.
- `format: "pdf"|"docx"` exige une session et consomme un rendu quotidien. Réponse : `{"document": {...}, "download_url": "..."}`.

### 6.3 Cycle de vie

- `GET /documents` — liste du compte.
- `GET /documents/{id}` — détail avec `data` si disponible.
- `PUT /documents/{id}/data` — body `{"data": {...}, "template_id": "..."}` ; régénère le fichier.
- `GET /documents/{id}/download` — téléchargement privé.
- `POST /documents/{id}/send-email` → `204`, maximum 3 envois/jour/document.
- `DELETE /documents/{id}` → `204`.
- `GET /d/{token}` — lien public en lecture seule, présent dans `download_url` et les emails.

Un document expire après 10 jours par défaut ; conserver `download_url` Est inutile au-delà de cette date.

---

## 7. Assistant texte (IA)

`POST /cv/rewrite`

```json
{
  "lang": "fr",
  "target_job": "Développeur backend",
  "raw_text": "Texte brut du CV...",
  "existing_data": null
}
```

`POST /letter/rewrite` ou `POST /letters/rewrite`

```json
{
  "lang": "fr",
  "kind": "motivation",
  "job_title": "Développeur backend",
  "company": "NanoFile",
  "raw_text": "Texte brut...",
  "cv_data": null
}
```

Réponse : `{"data": {...}, "missing": [{"path": "...", "question": "..."}]}`.

Limites : 12 appels/min/appareil, 5/jour/utilisateur, 1/jour/visiteur. Erreurs : `AI_DAILY_LIMIT_REACHED`, `AI_UNAVAILABLE`.

---

## 8. Événements

`POST /events` accepte un objet ou un tableau de 1 à 50 objets :

```json
[
  {"name": "tool_started", "props": {"tool": "compress", "files": 1}},
  {"name": "tool_run_failed", "props": {"tool": "compress", "code": "FILE_TOO_LARGE"}}
]
```

Réponse : `{"ok": true, "accepted": 2}`. Limite : 60 requêtes/min/appareil. Le nom est limité à 40 caractères.

---

## 9. Facturation

`GET /billing` renvoie l’état du paywall, des crédits et des plans. `PAYWALL_ENABLED=false` pendant les 3 mois gratuits.

`POST /billing/checkout` crée une session Stripe Checkout si `BILLING_ENABLED`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` et `STRIPE_PRICE_PRO` sont configurés. Réponse : `{checkout_url, session_id}`. Sinon : `BILLING_UNAVAILABLE`.

`POST /billing/webhook` est réservé à Stripe. Le webhook est signé HMAC-SHA256 (`Stripe-Signature`), idempotent, et met le compte en `pro` lors de `checkout.session.completed`, ou en `free` lors d’un `customer.subscription.deleted`/`invoice.payment_failed`.

Pour l’instant, l’admin peut aussi attribuer manuellement un plan ou des crédits.

---

## 10. Espace admin

Préfixe par défaut : `/api/control-room-7f3k` (variable `ADMIN_ROUTE`). Routes principales :

- `GET /dashboard`, `GET /users`, `GET /tool-runs`, `GET /events`, `GET /event-errors`, `GET /anonymous-usage`.
- `PATCH /users/{id}/admin` avec `{"enabled": true}`.
- `POST /users/{id}/credits` avec `{delta, reason}`.
- `POST /users/{id}/plan` avec `{plan: "free"|"pro", days?}`.
- `GET /settings`, `PUT /settings/{key}` (`tools_enabled`, `limits`, `compression`).
- `POST /announcements` avec `{title, body}` : uniquement aux comptes opt-in vérifiés, avec lien de désinscription.
- WebSocket : `/api/control-room-7f3k/live` avec cookie admin. Événements : `job.status`, `job.progress`, `job.completed`, `job.failed`, `tool_run.*`, `settings.updated`.

---

## 11. Pages légales côté frontend

Le backend fournit uniquement l’endpoint de désinscription. Le frontend doit héberger et lier :

- `/terms` — CGU, version `2026-11`.
- `/privacy` — politique de confidentialité.
- `/cookies` — politique cookies.
- `/legal` — mentions légales.
- `/billing/success` et `/billing/cancel` — retours Stripe.
- `/auth/verify` — page de callback du lien magique.
- `/d/{token}` — page de réception du lien de document (peut rediriger vers `GET /d/{token}`).

Cases à cocher explicites et non pré-cochées :

- `terms_accepted` obligatoire à l’inscription.
- `marketing_opt_in` facultatif, séparé, avec mention de désinscription.

---

## 12. Déploiement

- Front : `https://nanofile.tech`, `https://www.nanofile.tech`.
- API : `https://api.nanofile.tech`.
- Caddy force HTTPS/HSTS et limite le corps des requêtes à 450 Mo.
- L’API n’écoute que sur `127.0.0.1:8000` derrière Caddy.
- Base : Supabase PostgreSQL avec `sslmode=require`.
- `GET /healthz` et `GET /api/v1/healthz` renvoient l’état DB/disque.
- Documentation OpenAPI désactivée en production.
