import { googleAuth, googleCallback, googleLogin } from '@/api/authApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : gère les trois flux Google et permet de rafraîchir le profil.
export function useGoogleAuth({ onSuccess } = {}) {
  const login = useApiAction(googleLogin, { onSuccess })
  const callback = useApiAction(googleCallback, { onSuccess })
  const auth = useApiAction(googleAuth, { onSuccess })

  return {
    data: auth.data ?? callback.data ?? login.data,
    success: auth.success || callback.success || login.success,
    loading: auth.loading || callback.loading || login.loading,
    error: auth.error ?? callback.error ?? login.error,
    googleLogin: login.run,
    googleCallback: callback.run,
    googleAuth: auth.run,
  }
}
