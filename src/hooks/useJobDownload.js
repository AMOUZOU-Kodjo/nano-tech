import { useCallback, useState } from 'react'
import { downloadJob as downloadJobRequest } from '@/api/jobsApi.js'

// Hook métier : récupère le résultat d'un job et expose les états de la requête.
export function useJobDownload() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lance le téléchargement ; la réponse 200 est documentée sans schéma détaillé.
  const download = useCallback(async (jobId) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const payload = await downloadJobRequest(jobId)
      setData(payload)
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, download }
}
