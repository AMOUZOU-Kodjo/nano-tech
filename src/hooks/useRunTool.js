import { useCallback, useState } from 'react'
import { runTool as runToolRequest } from '@/api/toolsApi.js'

// Hook métier : lance un outil et expose les états de la requête.
export function useRunTool() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lance l'outil ; la réponse 202 est documentée sans schéma détaillé.
  const runTool = useCallback(async (tool) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const payload = await runToolRequest(tool)
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, runTool }
}
