import { apiFetch } from './client.js'

// Liste les modèles, éventuellement filtrés par type CV ou lettre.
export function listTemplates(kind) {
  const query = kind ? `?kind=${encodeURIComponent(kind)}` : ''
  return apiFetch(`/v1/templates${query}`)
}

// Récupère un aperçu SVG ; apiFetch renvoie le texte brut car le type n'est pas JSON.
export function getTemplatePreview(kind, templateId) {
  return apiFetch(
    `/v1/templates/${encodeURIComponent(kind)}/${encodeURIComponent(templateId)}/preview.svg`,
  )
}

// Récupère les pays et documents disponibles pour la photo d'identité.
export function getPhotoSpecs() {
  return apiFetch('/v1/photo-specs')
}

// Variante d'OpenAPI pour les spécifications photo, conservée pour compatibilité.
export function getPhotoSpecsAlternate() {
  return apiFetch('/v1/photo/specs')
}
