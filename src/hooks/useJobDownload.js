import { useCallback, useState } from 'react'
import { downloadJob as downloadJobRequest } from '@/api/jobsApi.js'

// Hook métier : récupère le résultat d'un job et expose les états de la requête.
export function useJobDownload() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lance le téléchargement du fichier choisi ou du premier résultat documenté.
  const download = useCallback(async (jobId, file = null) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const payload = await downloadJobRequest(jobId, file)
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
