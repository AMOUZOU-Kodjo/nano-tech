import { sendEvent, sendEvents } from '@/api/eventsApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : envoie un événement simple ou un lot d'événements documenté en v1.
export function useEvents() {
  const legacy = useApiAction(sendEvent)
  const batch = useApiAction(sendEvents)

  return {
    data: batch.data ?? legacy.data,
    sent: batch.success || legacy.success,
    loading: batch.loading || legacy.loading,
    error: batch.error ?? legacy.error,
    sendEvent: legacy.run,
    sendEvents: batch.run,
  }
}
