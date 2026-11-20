import { emailResend, emailStart, emailVerify, verifyEmailV1 } from '@/api/authApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : gère le lien magique et les deux routes de vérification d'email.
export function useEmailLink({ onSuccess } = {}) {
  const start = useApiAction(emailStart)
  const verify = useApiAction(emailVerify, { onSuccess })
  const resend = useApiAction(emailResend)
  const verifyV1 = useApiAction(verifyEmailV1, { onSuccess })

  return {
    data: verify.data ?? verifyV1.data ?? start.data,
    sent: start.success || resend.success,
    verified: verify.success || verifyV1.success,
    loading: start.loading || verify.loading || resend.loading || verifyV1.loading,
    error: start.error ?? verify.error ?? resend.error ?? verifyV1.error,
    emailStart: start.run,
    emailVerify: verify.run,
    emailResend: resend.run,
    verifyEmailV1: verifyV1.run,
  }
}
