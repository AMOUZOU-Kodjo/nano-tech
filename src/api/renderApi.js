import { apiFetch } from './client.js'

// Ne garde que les champs documentés du contrat de rendu.
const RENDER_FIELDS = ['template_id', 'data', 'format']

// Champs validés pour l'assistant CV ; l'OpenAPI ne documente pas ce corps.
const CV_REWRITE_FIELDS = ['lang', 'target_job', 'raw_text', 'existing_data']

// Champs validés pour l'assistant lettre ; l'OpenAPI attend un paramètre payload.
const LETTER_REWRITE_FIELDS = ['lang', 'kind', 'job_title', 'company', 'raw_text', 'cv_data']

// Filtre un objet selon une liste de champs autorisés.
function pickFields(fields, changes) {
  return Object.fromEntries(
    fields.filter((field) => field in changes).map((field) => [field, changes[field]]),
  )
}

// Rend un modèle pour le type demandé ; la réponse 200 est non typée dans l'OpenAPI.
export function render(kind, changes = {}) {
  return apiFetch(`/v1/render/${encodeURIComponent(kind)}`, {
    method: 'POST',
    body: pickFields(RENDER_FIELDS, changes),
  })
}

// Rend un CV avec la route dédiée.
export function renderCv(changes = {}) {
  return apiFetch('/v1/cv/render', {
    method: 'POST',
    body: pickFields(RENDER_FIELDS, changes),
  })
}

// Rend une lettre avec la route dédiée.
export function renderLetter(changes = {}) {
  return apiFetch('/v1/letter/render', {
    method: 'POST',
    body: pickFields(RENDER_FIELDS, changes),
  })
}

// Rend plusieurs lettres avec la route dédiée.
export function renderLetters(changes = {}) {
  return apiFetch('/v1/letters/render', {
    method: 'POST',
    body: pickFields(RENDER_FIELDS, changes),
  })
}

// Réécrit un CV à partir d'un texte brut.
export function rewriteCv(changes = {}) {
  return apiFetch('/v1/cv/rewrite', {
    method: 'POST',
    body: pickFields(CV_REWRITE_FIELDS, changes),
  })
}

// Réécrit une lettre avec le corps validé dans FRONTEND.md.
export function rewriteLetter(changes = {}) {
  return apiFetch('/v1/letter/rewrite', {
    method: 'POST',
    body: pickFields(LETTER_REWRITE_FIELDS, changes),
  })
}

// Réécrit plusieurs lettres avec le corps validé dans FRONTEND.md.
export function rewriteLetters(changes = {}) {
  return apiFetch('/v1/letters/rewrite', {
    method: 'POST',
    body: pickFields(LETTER_REWRITE_FIELDS, changes),
  })
}
