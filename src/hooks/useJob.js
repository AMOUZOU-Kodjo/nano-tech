import { useCallback, useEffect, useState } from 'react'
import { getJob } from '@/api/jobsApi.js'

// Hook métier : charge le statut d'un job et expose les états de la requête.
export function useJob(jobId) {
  const [state, setState] = useState({
    jobId: jobId ?? null,
    data: null,
    loading: Boolean(jobId),
    error: null,
  })

  // Recharge manuellement le job courant ; les changements d'état ont lieu dans le gestionnaire.
  const reload = useCallback(async () => {
    if (!jobId) {
      return null
    }

    setState((previous) => ({ ...previous, jobId, loading: true, error: null }))

    try {
      const payload = await getJob(jobId)
      setState({ jobId, data: payload, loading: false, error: null })
      return payload
    } catch (caughtError) {
      setState({ jobId, data: null, loading: false, error: caughtError })
      return null
    }
  }, [jobId])

  // Chargement initial : la réponse est traitée dans un callback asynchrone, sans setState synchrone.
  useEffect(() => {
    if (!jobId) {
      return undefined
    }

    let active = true

    getJob(jobId).then(
      (payload) => {
        if (active) {
          setState({ jobId, data: payload, loading: false, error: null })
        }
      },
      (caughtError) => {
        if (active) {
          setState({ jobId, data: null, loading: false, error: caughtError })
        }
      },
    )

    return () => {
      active = false
    }
  }, [jobId])

  const isCurrent = state.jobId === (jobId ?? null)

  return {
    data: isCurrent ? state.data : null,
    loading: isCurrent ? state.loading : Boolean(jobId),
    error: isCurrent ? state.error : null,
    reload,
  }
}
