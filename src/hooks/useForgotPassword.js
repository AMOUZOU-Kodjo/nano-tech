import { useCallback, useState } from 'react'
import { forgotPassword as forgotPasswordRequest } from '@/api/authApi.js'

// Hook métier : demande un lien de réinitialisation et expose l'état d'envoi.
export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  // La réponse 204 est sans corps : un état dédié indique que la demande a réussi.
  const forgotPassword = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    setSent(false)

    try {
      await forgotPasswordRequest(email)
      setSent(true)
      return true
    } catch (caughtError) {
      setError(caughtError)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, sent, forgotPassword }
}
