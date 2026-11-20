import {
  render,
  renderCv,
  renderLetters,
  renderLetter,
  rewriteCv,
  rewriteLetters,
  rewriteLetter,
} from '@/api/renderApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : regroupe les routes de rendu et d'assistant texte.
export function useRender() {
  const any = useApiAction(render)
  const cv = useApiAction(renderCv)
  const letter = useApiAction(renderLetter)
  const letters = useApiAction(renderLetters)
  const rewriteCvAction = useApiAction(rewriteCv)
  const rewriteLetterAction = useApiAction(rewriteLetter)
  const rewriteLettersAction = useApiAction(rewriteLetters)

  return {
    data:
      any.data ??
      cv.data ??
      letter.data ??
      letters.data ??
      rewriteCvAction.data ??
      rewriteLetterAction.data ??
      rewriteLettersAction.data,
    rewritten:
      rewriteCvAction.success || rewriteLetterAction.success || rewriteLettersAction.success,
    loading:
      any.loading ||
      cv.loading ||
      letter.loading ||
      letters.loading ||
      rewriteCvAction.loading ||
      rewriteLetterAction.loading ||
      rewriteLettersAction.loading,
    error:
      any.error ??
      cv.error ??
      letter.error ??
      letters.error ??
      rewriteCvAction.error ??
      rewriteLetterAction.error ??
      rewriteLettersAction.error,
    render: any.run,
    renderCv: cv.run,
    renderLetter: letter.run,
    renderLetters: letters.run,
    rewriteCv: rewriteCvAction.run,
    rewriteLetter: rewriteLetterAction.run,
    rewriteLetters: rewriteLettersAction.run,
  }
}
