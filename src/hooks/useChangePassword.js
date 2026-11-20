import { useCallback, useState } from 'react'
import { changePassword as changePasswordRequest } from '@/api/meApi.js'

// Hook métier : envoie la demande de changement de mot de passe et expose les états.
export function useChangePassword() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Soumet les trois champs validés ; les mises à jour d'état ont lieu dans le gestionnaire d'événement.
  const changePassword = useCallback(async (changes = {}) => {
    setLoading(true)
    setError(null)

    try {
      const payload = await changePasswordRequest(changes)
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, changePassword }
}
