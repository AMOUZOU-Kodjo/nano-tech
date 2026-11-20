import { apiFetch } from './client.js'

// Champs validés pour POST /auth/password/reset ; l'OpenAPI ne documente pas ce corps.
const RESET_FIELDS = ['token', 'password', 'password_confirmation']

// Champs validés pour POST /auth/register ; l'OpenAPI ne documente pas ce corps.
const REGISTER_FIELDS = [
  'email',
  'password',
  'password_confirmation',
  'terms_accepted',
  'marketing_opt_in',
  'name',
]

// Champs validés pour POST /auth/login ; l'OpenAPI ne documente pas ce corps.
const LOGIN_FIELDS = ['email', 'password']

// Champs validés pour POST /v1/auth/google ; l'OpenAPI ne documente pas ce corps.
const GOOGLE_FIELDS = ['credential', 'terms_accepted', 'marketing_opt_in']

// Champs validés pour POST /v1/auth/email/start ; l'OpenAPI ne documente pas ce corps.
const EMAIL_START_FIELDS = ['email', 'return_to']

// Paramètres de requête documentés pour GET /auth/google/callback.
const GOOGLE_CALLBACK_FIELDS = ['code', 'state', 'error']

// Déconnecte l'utilisateur courant ; la réponse 204 est renvoyée comme null par apiFetch.
export function logout() {
  return apiFetch('/auth/logout', {
    method: 'POST',
  })
}

// Demande un lien de réinitialisation ; le champ email vient de FRONTEND.md (corps non documenté par l'OpenAPI).
export function forgotPassword(email) {
  return apiFetch('/auth/password/forgot', {
    method: 'POST',
    body: { email },
  })
}

// Ne garde que les trois champs validés pour la réinitialisation.
function pickResetFields(changes) {
  return Object.fromEntries(
    RESET_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Réinitialise le mot de passe avec le token reçu par email ; la réponse 200 est non typée.
export function resetPassword(changes = {}) {
  return apiFetch('/auth/password/reset', {
    method: 'POST',
    body: pickResetFields(changes),
  })
}

// Ne garde que les champs validés pour l'inscription.
function pickRegisterFields(changes) {
  return Object.fromEntries(
    REGISTER_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Crée un compte ; la route /api est essayée en priorité, puis la route /v1 si elle refuse le corps validé.
export async function register(changes = {}) {
  const body = pickRegisterFields(changes)

  try {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body,
    })
  } catch (error) {
    if (error?.status !== 422) {
      throw error
    }

    return apiFetch('/v1/auth/register', {
      method: 'POST',
      body,
    })
  }
}

// Ne garde que les champs validés pour la connexion.
function pickLoginFields(changes) {
  return Object.fromEntries(
    LOGIN_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Connecte l'utilisateur ; la réponse 200 est documentée sans schéma détaillé.
export function login(changes = {}) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: pickLoginFields(changes),
  })
}

// Vérifie l'email avec le token du lien ; la réponse 200 est documentée sans schéma détaillé.
export function verifyEmail(token) {
  return apiFetch('/auth/verify', {
    method: 'POST',
    body: { token },
  })
}

// Renvoie l'email de vérification ; le champ email vient de FRONTEND.md (corps non documenté par l'OpenAPI).
export function resendEmail(email) {
  return apiFetch('/auth/resend', {
    method: 'POST',
    body: { email },
  })
}

// Ne garde que les champs autorisés pour Google et le lien magique.
function pickAuthFields(fields, changes) {
  return Object.fromEntries(
    fields.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Construit la query string du callback Google avec les seuls paramètres documentés.
function googleCallbackQuery(params) {
  const search = new URLSearchParams()
  for (const field of GOOGLE_CALLBACK_FIELDS) {
    if (params[field] !== undefined) {
      search.set(field, params[field])
    }
  }
  return search.toString()
}

// Obtient l'URL de connexion Google ; la réponse 200 est documentée sans schéma détaillé.
export function googleLogin() {
  return apiFetch('/auth/google/login')
}

// Traite le retour Google ; la réponse 200 est documentée sans schéma détaillé.
export function googleCallback(params = {}) {
  const query = googleCallbackQuery(params)
  return apiFetch(`/auth/google/callback${query ? `?${query}` : ''}`)
}

// Connecte avec un identifiant Google via la route v1 ; la réponse 200 est non typée.
export function googleAuth(changes = {}) {
  return apiFetch('/v1/auth/google', {
    method: 'POST',
    body: pickAuthFields(GOOGLE_FIELDS, changes),
  })
}

// Démarre une connexion par lien magique ; la réponse 204 est renvoyée comme null.
export function emailStart(changes = {}) {
  return apiFetch('/v1/auth/email/start', {
    method: 'POST',
    body: pickAuthFields(EMAIL_START_FIELDS, changes),
  })
}

// Vérifie un lien magique ; la réponse 200 contient le payload du profil.
export function emailVerify(token) {
  return apiFetch('/v1/auth/email/verify', {
    method: 'POST',
    body: { token },
  })
}

// Renvoie un lien magique ; la réponse 204 est renvoyée comme null.
export function emailResend(email) {
  return apiFetch('/v1/auth/email/resend', {
    method: 'POST',
    body: { email },
  })
}

// Vérifie l'email avec la route v1 stricte de FRONTEND.md.
export function verifyEmailV1(token) {
  return apiFetch('/v1/auth/verify-email', {
    method: 'POST',
    body: { token },
  })
}
