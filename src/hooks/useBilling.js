import { createCheckout, getBillingStatus } from '@/api/billingApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : lit l'état de facturation et démarre une session Stripe.
export function useBilling() {
  const status = useApiAction(getBillingStatus)
  const checkout = useApiAction(createCheckout)

  return {
    data: status.data ?? checkout.data,
    status: status.data,
    checkoutUrl: checkout.data?.checkout_url ?? null,
    loading: status.loading || checkout.loading,
    error: status.error ?? checkout.error,
    getBillingStatus: status.run,
    createCheckout: checkout.run,
  }
}
