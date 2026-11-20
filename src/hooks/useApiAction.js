import { useCallback, useState } from 'react'

// Hook générique : exécute un appel API manuel et expose un état uniforme.
export function useApiAction(request, { onSuccess } = {}) {
  const [data, setData] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Réinitialise l'état puis met à jour les valeurs selon le résultat de la requête.
  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      setData(null)
      setSuccess(false)

      try {
        const payload = await request(...args)
        setData(payload)
        setSuccess(true)
        onSuccess?.(payload)
        return payload
      } catch (caughtError) {
        setError(caughtError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [request, onSuccess],
  )

  return { data, success, loading, error, run }
}
