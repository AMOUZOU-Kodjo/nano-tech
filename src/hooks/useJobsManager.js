import { createJob, listJobs } from '@/api/jobsApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : crée un job et consulte l'historique avec pagination.
export function useJobsManager({ onSuccess } = {}) {
  const create = useApiAction(createJob, { onSuccess })
  const list = useApiAction(listJobs)

  return {
    data: create.data ?? list.data,
    jobs: list.data?.jobs ?? list.data ?? [],
    created: create.success,
    loading: create.loading || list.loading,
    error: create.error ?? list.error,
    createJob: create.run,
    listJobs: list.run,
  }
}
