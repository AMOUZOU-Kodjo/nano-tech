import { useCallback, useMemo } from 'react'
import { useMeContext } from '@/hooks/useMeContext.js'

const BYTES_PER_MB = 1024 * 1024

// Ne considère que les limites numériques positives renvoyées par l'API publique.
function positiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null
}

// Hook métier : lit les limites effectives du profil et valide une sélection de fichiers.
export function usePublicLimits() {
  const { quota } = useMeContext()
  const limits = quota?.limits ?? null

  const values = useMemo(() => {
    const maxFileMb = positiveNumber(limits?.max_file_mb)
    const maxTotalMb = positiveNumber(limits?.max_total_mb)

    return {
      maxFiles: positiveNumber(limits?.max_files),
      maxFileMb,
      maxTotalMb,
      maxFileBytes: maxFileMb ? maxFileMb * BYTES_PER_MB : null,
      maxTotalBytes: maxTotalMb ? maxTotalMb * BYTES_PER_MB : null,
      maxPdfPages: positiveNumber(limits?.max_pdf_pages),
      maxVideoMinutes: positiveNumber(limits?.max_video_minutes),
    }
  }, [limits])

  // Retourne un code d'erreur documenté plutôt qu'un message, pour traduction côté composant.
  const validateFiles = useCallback(
    (selected) => {
      const files = Array.from(selected ?? [])

      if (values.maxFiles && files.length > values.maxFiles) {
        return { files, error: 'max_files', value: values.maxFiles }
      }
      if (values.maxFileBytes && files.some((file) => file.size > values.maxFileBytes)) {
        return { files, error: 'max_file_mb', value: values.maxFileMb }
      }
      if (
        values.maxTotalBytes &&
        files.reduce((sum, file) => sum + file.size, 0) > values.maxTotalBytes
      ) {
        return { files, error: 'max_total_mb', value: values.maxTotalMb }
      }

      return { files, error: null, value: null }
    },
    [values],
  )

  return { limits: values, validateFiles }
}
