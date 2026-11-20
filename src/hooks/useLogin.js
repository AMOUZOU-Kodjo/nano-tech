import { useCallback, useState } from 'react'
import { login as loginRequest } from '@/api/authApi.js'

// Hook métier : connecte l'utilisateur puis laisse l'appelant rafraîchir son profil.
export function useLogin({ onSuccess } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Soumet l'email et le mot de passe ; onSuccess est appelé uniquement après un succès.
  const login = useCallback(
    async (changes = {}) => {
      setLoading(true)
      setError(null)
      setData(null)

      try {
        const payload = await loginRequest(changes)
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

  return { data, loading, error, login }
}
