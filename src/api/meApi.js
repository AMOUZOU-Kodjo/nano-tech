import { apiFetch } from './client.js'

// Champs autorisés par FRONTEND.md pour PATCH /me ; toute autre clé est ignorée.
const UPDATABLE_FIELDS = [
  'email',
  'first_name',
  'last_name',
  'profession',
  'name',
  'terms_accepted',
  'marketing_opt_in',
]

// Champs validés pour POST /me/password ; l'OpenAPI ne documente pas ce corps.
const PASSWORD_FIELDS = ['current_password', 'password', 'password_confirmation']

// Récupère le profil et le quota courants ; « user » peut être null en mode invité.
export function getMe() {
  return apiFetch('/me')
}

// Ne garde que les champs documentés afin de ne jamais envoyer de donnée inventée.
function pickUpdatableFields(changes) {
  return Object.fromEntries(
    UPDATABLE_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Met à jour le profil courant avec les seuls champs acceptés par l'API.
export function patchMe(changes = {}) {
  return apiFetch('/me', {
    method: 'PATCH',
    body: pickUpdatableFields(changes),
  })
}

// Ne garde que les trois champs validés pour le changement de mot de passe.
function pickPasswordFields(changes) {
  return Object.fromEntries(
    PASSWORD_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Modifie le mot de passe courant ; une réponse 200 JSON non typée est attendue.
export function changePassword(changes = {}) {
  return apiFetch('/me/password', {
    method: 'POST',
    body: pickPasswordFields(changes),
  })
}

// Récupère la consommation détaillée ; la réponse 200 est non typée dans l'OpenAPI.
export function getUsage() {
  return apiFetch('/v1/usage')
}

// Exporte les données RGPD ; la réponse 200 est non typée dans l'OpenAPI.
export function exportMe() {
  return apiFetch('/v1/me/export')
}

// Supprime les données associées, et le compte si account vaut true.
export function deleteMyData(account = false) {
  return apiFetch(`/v1/me/data?account=${account ? 'true' : 'false'}`, {
    method: 'DELETE',
  })
}

// Déinscrit une adresse marketing ; la réponse peut être une page HTML.
export function unsubscribe(token) {
  return apiFetch(`/v1/email/unsubscribe?token=${encodeURIComponent(token)}`)
}
