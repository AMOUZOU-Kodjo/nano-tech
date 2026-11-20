import { useCallback, useState } from 'react'
import { resetPassword as resetPasswordRequest } from '@/api/authApi.js'

// Hook métier : réinitialise le mot de passe et expose les états de la requête.
export function useResetPassword() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Soumet le token et les deux mots de passe validés ; la réponse 200 est non typée.
  const resetPassword = useCallback(async (changes = {}) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const payload = await resetPasswordRequest(changes)
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, resetPassword }
}
