import {
  getPhotoSpecs,
  getPhotoSpecsAlternate,
  getTemplatePreview,
  listTemplates,
} from '@/api/catalogApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : charge les modèles, les aperçus et les spécifications photo.
export function useCatalog() {
  const list = useApiAction(listTemplates)
  const preview = useApiAction(getTemplatePreview)
  const specs = useApiAction(getPhotoSpecs)
  const alternateSpecs = useApiAction(getPhotoSpecsAlternate)

  return {
    data: list.data ?? preview.data ?? specs.data ?? alternateSpecs.data,
    templates: list.data ?? [],
    preview: preview.data,
    photoSpecs: specs.data ?? alternateSpecs.data,
    loading: list.loading || preview.loading || specs.loading || alternateSpecs.loading,
    error: list.error ?? preview.error ?? specs.error ?? alternateSpecs.error,
    listTemplates: list.run,
    getTemplatePreview: preview.run,
    getPhotoSpecs: specs.run,
    getPhotoSpecsAlternate: alternateSpecs.run,
  }
}
