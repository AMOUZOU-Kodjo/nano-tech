import { getUsage } from '@/api/meApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : charge la consommation détaillée du profil courant.
export function useUsage() {
  const usage = useApiAction(getUsage)

  return {
    data: usage.data,
    usage: usage.data,
    loading: usage.loading,
    error: usage.error,
    getUsage: usage.run,
  }
}
