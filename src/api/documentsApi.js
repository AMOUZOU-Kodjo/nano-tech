import { apiFetch } from './client.js'

// Champs validés par FRONTEND.md pour la mise à jour des données d'un document.
const DATA_FIELDS = ['data', 'template_id']

// Construit un chemin sûr pour un identifiant de document passé en paramètre de chemin.
function documentPath(documentId, suffix = '') {
  return `/v1/documents/${encodeURIComponent(documentId)}${suffix}`
}

// Ne garde que les champs documentés afin de ne jamais envoyer de donnée inventée.
function pickDataFields(changes) {
  return Object.fromEntries(
    DATA_FIELDS.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Liste les documents du compte ; la réponse 200 est non typée dans l'OpenAPI.
export function listDocuments() {
  return apiFetch('/v1/documents')
}

// Récupère le détail d'un document, avec ses données lorsque celles-ci sont disponibles.
export function getDocument(documentId) {
  return apiFetch(documentPath(documentId))
}

// Met à jour les données d'un document et déclenche sa régénération.
export function updateDocumentData(documentId, changes = {}) {
  return apiFetch(documentPath(documentId, '/data'), {
    method: 'PUT',
    body: pickDataFields(changes),
  })
}

// Supprime un document ; la réponse 204 est renvoyée comme null par apiFetch.
export function deleteDocument(documentId) {
  return apiFetch(documentPath(documentId), {
    method: 'DELETE',
  })
}

// Télécharge un document privé ; la réponse 200 est non typée dans l'OpenAPI.
export function downloadDocument(documentId) {
  return apiFetch(documentPath(documentId, '/download'))
}

// Envoie un document par email ; la réponse 204 est renvoyée comme null par apiFetch.
export function sendDocumentEmail(documentId) {
  return apiFetch(documentPath(documentId, '/send-email'), {
    method: 'POST',
  })
}
