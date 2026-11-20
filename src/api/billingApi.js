import { apiFetch } from './client.js'

// Récupère l'état du paywall, des crédits et des plans.
export function getBillingStatus() {
  return apiFetch('/v1/billing')
}

// Crée une session Stripe Checkout ; l'OpenAPI ne documente aucun corps de requête.
export function createCheckout() {
  return apiFetch('/v1/billing/checkout', {
    method: 'POST',
  })
}
