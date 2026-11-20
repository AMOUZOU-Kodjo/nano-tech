import { apiFetch } from './client.js'

// Vérifie la disponibilité de l'API ; la réponse 200 est documentée sans schéma détaillé.
export function getHealth() {
  return apiFetch('/health')
}
