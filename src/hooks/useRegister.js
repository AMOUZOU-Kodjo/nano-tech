import { useCallback, useState } from 'react'
import { register as registerRequest } from '@/api/authApi.js'

// Hook métier : crée un compte et expose les états de la requête.
export function useRegister() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Soumet les six champs validés ; la réponse 201 est documentée sans schéma détaillé.
  const register = useCallback(async (changes = {}) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const payload = await registerRequest(changes)
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, register }
}
