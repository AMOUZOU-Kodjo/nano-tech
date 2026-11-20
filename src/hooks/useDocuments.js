import {
  deleteDocument,
  downloadDocument,
  getDocument,
  listDocuments,
  sendDocumentEmail,
  updateDocumentData,
} from '@/api/documentsApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : couvre le cycle de vie complet des documents CV et lettre.
export function useDocuments() {
  const list = useApiAction(listDocuments)
  const get = useApiAction(getDocument)
  const update = useApiAction(updateDocumentData)
  const remove = useApiAction(deleteDocument)
  const download = useApiAction(downloadDocument)
  const sendEmail = useApiAction(sendDocumentEmail)

  return {
    data: get.data ?? update.data ?? download.data ?? list.data,
    documents: list.data ?? [],
    sentEmail: sendEmail.success,
    loading:
      list.loading ||
      get.loading ||
      update.loading ||
      remove.loading ||
      download.loading ||
      sendEmail.loading,
    error:
      list.error ??
      get.error ??
      update.error ??
      remove.error ??
      download.error ??
      sendEmail.error,
    listDocuments: list.run,
    getDocument: get.run,
    updateDocumentData: update.run,
    deleteDocument: remove.run,
    downloadDocument: download.run,
    sendDocumentEmail: sendEmail.run,
  }
}
