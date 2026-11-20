import { apiFetch } from './client.js'

// Construit un chemin sûr pour un identifiant de fichier passé en paramètre de chemin.
function filePath(fileId) {
  return `/v1/files/${encodeURIComponent(fileId)}`
}

// Récupère les métadonnées d'un fichier de résultat.
export function getFile(fileId) {
  return apiFetch(filePath(fileId))
}

// Récupère un document public à partir de son jeton de partage.
export function downloadByToken(token) {
  return apiFetch(`/v1/d/${encodeURIComponent(token)}`)
}
