import { useEffect, useState } from 'react'
import { downloadJob } from '@/api/jobsApi.js'

// Hook métier : prépare une URL locale pour prévisualiser le premier fichier de résultat.
export function useJobPreview(jobId, file) {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileKey = file?.file_id ?? file?.url ?? file?.name ?? null

  useEffect(() => {
    if (!jobId || !fileKey) return undefined

    let active = true
    let objectUrl = null

    Promise.resolve()
      .then(() => {
        if (active) setLoading(true)
        return downloadJob(jobId, file)
      })
      .then((blob) => {
        if (!active || !(blob instanceof Blob)) return null
        objectUrl = URL.createObjectURL(blob)
        const next = { url: objectUrl, type: blob.type || '' }
        if (active) setPreview(next)
        return next
      })
      .catch(() => {
        if (active) setPreview(null)
        return null
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [jobId, fileKey, file])

  return { preview, loading }
}
