import { apiFetch } from './client.js'

// Construit un chemin sûr pour un identifiant de job passé en paramètre de chemin.
function jobPath(jobId, suffix = '') {
  return `/jobs/${encodeURIComponent(jobId)}${suffix}`
}

// Récupère le statut d'un job ; la réponse 200 est documentée sans schéma détaillé.
export function getJob(jobId) {
  return apiFetch(jobPath(jobId))
}

// Récupère le résultat d'un job ; la réponse 200 est documentée sans schéma détaillé.
export function downloadJob(jobId) {
  return apiFetch(jobPath(jobId, '/download'))
}

// Crée un job v1 avec les fichiers et les options sérialisées attendues par l'API.
export function createJob(files, tool, options = {}) {
  const form = new FormData()
  for (const file of files) {
    form.append('files', file)
  }
  form.append('tool', tool)
  form.append('options', typeof options === 'string' ? options : JSON.stringify(options))
  return apiFetch('/v1/jobs', {
    method: 'POST',
    body: form,
  })
}

// Liste l'historique des jobs avec pagination ; la réponse 200 est non typée.
export function listJobs({ limit = 20, offset = 0 } = {}) {
  const search = new URLSearchParams()
  search.set('limit', String(limit))
  search.set('offset', String(offset))
  return apiFetch(`/v1/jobs?${search.toString()}`)
}
