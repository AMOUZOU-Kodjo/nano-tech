import { patchMe } from '@/api/meApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : met à jour le profil avec les seuls champs acceptés par l'API.
export function usePatchMe({ onSuccess } = {}) {
  const action = useApiAction(patchMe, { onSuccess })

  return {
    data: action.data,
    success: action.success,
    loading: action.loading,
    error: action.error,
    patchMe: action.run,
  }
}
