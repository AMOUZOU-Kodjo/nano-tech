import { useCallback, useState } from 'react'
import { resendEmail as resendEmailRequest } from '@/api/authApi.js'

// Hook métier : renvoie l'email de vérification et expose l'état de la requête.
export function useResendEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  // La réponse 200 est non typée : un état dédié indique que la demande a réussi.
  const resendEmail = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    setSent(false)

    try {
      await resendEmailRequest(email)
      setSent(true)
      return true
    } catch (caughtError) {
      setError(caughtError)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, sent, resendEmail }
}
