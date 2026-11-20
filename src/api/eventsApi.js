import { apiFetch } from './client.js'

// Envoie un événement ; la réponse 204 est renvoyée comme null par apiFetch.
export function sendEvent() {
  return apiFetch('/events', {
    method: 'POST',
  })
}

function normalizeEvent(event) {
  const name = typeof event?.name === 'string' ? event.name.trim().slice(0, 40) : ''
  const props = event?.props && typeof event.props === 'object' && !Array.isArray(event.props) ? event.props : {}
  return { name, props }
}

// Envoie un événement ou un lot d'événements via la route v1 documentée.
export function sendEvents(payload) {
  const events = Array.isArray(payload) ? payload.map(normalizeEvent) : [normalizeEvent(payload)]

  if (events.some((event) => !event.name)) {
    throw new Error('Nom d’événement invalide.')
  }

  return apiFetch('/v1/events', {
    method: 'POST',
    body: Array.isArray(payload) ? events : events[0],
  })
}
