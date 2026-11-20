import { deleteMyData, exportMe, unsubscribe } from '@/api/meApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : regroupe export RGPD, suppression de données et désinscription.
export function useMeActions({ onSuccess } = {}) {
  const exportAction = useApiAction(exportMe)
  const deleteAction = useApiAction(deleteMyData, { onSuccess })
  const unsubscribeAction = useApiAction(unsubscribe)

  return {
    data: exportAction.data ?? deleteAction.data ?? unsubscribeAction.data,
    exportedData: exportAction.data,
    deleted: deleteAction.success,
    unsubscribed: unsubscribeAction.success,
    loading: exportAction.loading || deleteAction.loading || unsubscribeAction.loading,
    error: exportAction.error ?? deleteAction.error ?? unsubscribeAction.error,
    exportMe: exportAction.run,
    deleteMyData: deleteAction.run,
    unsubscribe: unsubscribeAction.run,
  }
}
