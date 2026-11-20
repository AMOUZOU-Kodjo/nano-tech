import { useCallback, useEffect, useState } from 'react'
import { getHealth } from '@/api/healthApi.js'

// Hook métier : interroge /health et expose l'état de la requête ainsi que les champs observés.
export function useHealth() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Relance manuelle : les changements d'état ont lieu dans le gestionnaire d'événement.
  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = await getHealth()
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Chargement initial : la réponse est traitée dans un callback asynchrone, sans setState synchrone.
  useEffect(() => {
    let mounted = true

    getHealth().then(
      (payload) => {
        if (mounted) {
          setData(payload)
          setLoading(false)
        }
      },
      (caughtError) => {
        if (mounted) {
          setError(caughtError)
          setLoading(false)
        }
      },
    )

    return () => {
      mounted = false
    }
  }, [])

  return {
    data,
    ok: data?.ok ?? null,
    capabilities: data?.capabilities ?? null,
    loading,
    error,
    reload,
  }
}
