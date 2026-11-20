import { useCallback, useState } from 'react'
import { verifyEmail as verifyEmailRequest } from '@/api/authApi.js'

// Hook métier : vérifie l'email puis laisse l'appelant rafraîchir son profil.
export function useVerifyEmail({ onSuccess } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Soumet le token du lien ; onSuccess est appelé uniquement après un succès.
  const verifyEmail = useCallback(
    async (token) => {
      setLoading(true)
      setError(null)
      setData(null)

      try {
        const payload = await verifyEmailRequest(token)
        setData(payload)
        onSuccess?.()
        return payload
      } catch (caughtError) {
        setError(caughtError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [onSuccess],
  )

  return { data, loading, error, verifyEmail }
}
