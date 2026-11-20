import { apiFetch } from './client.js'

// Envoie un événement ; la réponse 204 est renvoyée comme null par apiFetch.
export function sendEvent() {
  return apiFetch('/events', {
    method: 'POST',
  })
}

// Envoie un événement ou un lot d'événements via la route v1 documentée.
export function sendEvents(payload) {
  return apiFetch('/v1/events', {
    method: 'POST',
    body: payload,
  })
}
