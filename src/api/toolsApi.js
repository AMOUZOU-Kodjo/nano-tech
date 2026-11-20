import { apiFetch } from './client.js'

// Lance un outil par son identifiant ; la réponse 202 est documentée sans schéma détaillé.
export function runTool(tool) {
  return apiFetch(`/tools/${encodeURIComponent(tool)}`, {
    method: 'POST',
  })
}
