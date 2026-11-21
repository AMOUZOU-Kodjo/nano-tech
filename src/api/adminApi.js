import { apiFetch } from './client.js'

// Préfixe administratif documenté ; VITE_API_URL contient déjà /api.
const ADMIN_ROUTE = '/control-room-7f3k'

// Construit un chemin administratif sûr à partir d'un suffixe documenté.
function adminPath(suffix) {
  return `${ADMIN_ROUTE}${suffix}`
}

// Construit le chemin sûr d'un utilisateur administré.
function userPath(userId, suffix = '') {
  return adminPath(`/users/${encodeURIComponent(userId)}${suffix}`)
}

// Récupère les indicateurs généraux du control-room.
export function getAdminDashboard() {
  return apiFetch(adminPath('/dashboard'))
}

// Liste les utilisateurs accessibles à l'administrateur.
export function listAdminUsers() {
  return apiFetch(adminPath('/users'))
}

// Crée une annonce avec les champs documentés title et body.
export function createAnnouncement({ title, body }) {
  return apiFetch(adminPath('/announcements'), {
    method: 'POST',
    body: { title, body },
  })
}

// Active ou désactive le statut admin ; l'OpenAPI exige enabled en paramètre de requête.
export function updateUserAdmin(userId, enabled) {
  const query = new URLSearchParams()
  query.set('enabled', enabled ? 'true' : 'false')
  return apiFetch(`${userPath(userId, '/admin')}?${query.toString()}`, {
    method: 'PATCH',
  })
}

// Ajuste le solde de crédits d'un utilisateur.
export function updateUserCredits(userId, { delta, reason = 'admin_adjustment' }) {
  return apiFetch(userPath(userId, '/credits'), {
    method: 'POST',
    body: { delta, reason },
  })
}

// Change le plan d'un utilisateur avec les champs documentés plan et days.
export function updateUserPlan(userId, { plan, days = null }) {
  return apiFetch(userPath(userId, '/plan'), {
    method: 'POST',
    body: { plan, days },
  })
}

// Liste les exécutions d'outils enregistrées par l'administration.
export function listToolRuns() {
  return apiFetch(adminPath('/tool-runs'))
}

// Liste les événements reçus par l'API.
export function listAdminEvents() {
  return apiFetch(adminPath('/events'))
}

// Liste les événements rejetés ou en erreur.
export function listEventErrors() {
  return apiFetch(adminPath('/event-errors'))
}

// Liste l'utilisation anonyme agrégée.
export function listAnonymousUsage() {
  return apiFetch(adminPath('/anonymous-usage'))
}

// Récupère les paramètres administratifs.
export function getAdminSettings() {
  return apiFetch(adminPath('/settings'))
}

// Met à jour un paramètre administratif identifié par sa clé.
export function updateAdminSetting(key, value) {
  return apiFetch(adminPath(`/settings/${encodeURIComponent(key)}`), {
    method: 'PUT',
    body: value,
  })
}
