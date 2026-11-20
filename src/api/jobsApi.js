import { apiFetch } from './client.js'

// Construit un chemin sûr pour un identifiant de job passé en paramètre de chemin.
function jobPath(jobId, suffix = '') {
  return `/jobs/${encodeURIComponent(jobId)}${suffix}`
}

// Récupère le statut d'un job ; la route v1 est prioritaire, l'ancienne route sert de repli.
export async function getJob(jobId) {
  const id = encodeURIComponent(jobId)

  try {
    return await apiFetch(`/v1/jobs/${id}`)
  } catch (error) {
    if (error?.status !== 404) {
      throw error
    }

    return apiFetch(jobPath(jobId))
  }
}

function resultFileId(file) {
  if (file?.file_id) {
    return String(file.file_id)
  }

  const match = typeof file?.url === 'string' ? file.url.match(/\/files\/([^/?#]+)/) : null
  return match ? decodeURIComponent(match[1]) : null
}

// Récupère le résultat via le fichier documenté, avec repli sur l'ancien endpoint de téléchargement.
export async function downloadJob(jobId, file = null) {
  const resultFile = file ?? (await getJob(jobId))?.result?.files?.[0]
  const fileId = resultFileId(resultFile)

  if (fileId) {
    return apiFetch(`/v1/files/${encodeURIComponent(fileId)}`, { responseType: 'blob' })
  }

  return apiFetch(jobPath(jobId, '/download'), { responseType: 'blob' })
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
