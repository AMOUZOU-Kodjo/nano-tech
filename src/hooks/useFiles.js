import { downloadByToken, getFile } from '@/api/filesApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : récupère un fichier privé ou public à partir d'un jeton.
export function useFiles() {
  const file = useApiAction(getFile)
  const download = useApiAction(downloadByToken)

  return {
    data: file.data ?? download.data,
    loading: file.loading || download.loading,
    error: file.error ?? download.error,
    getFile: file.run,
    downloadByToken: download.run,
  }
}
