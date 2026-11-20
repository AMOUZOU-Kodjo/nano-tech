import { useCallback, useEffect, useRef, useState } from 'react'
import { googleAuth } from '@/api/authApi.js'

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  '223256695224-7vgdsrm6h2rjfhbj1qjku2m0o1j955n6.apps.googleusercontent.com'

function loadGoogleIdentityServices() {
  if (globalThis.google?.accounts?.oauth2) {
    return Promise.resolve(globalThis.google)
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('google-identity-services')

    if (existing) {
      existing.addEventListener('load', () => resolve(globalThis.google), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google Identity Services indisponible.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-services'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(globalThis.google)
    script.onerror = () => reject(new Error('Google Identity Services indisponible.'))
    document.head.appendChild(script)
  })
}

export default function GoogleAuthButton({
  termsAccepted = true,
  marketingOptIn = false,
  onSuccess,
  onError,
}) {
  const buttonRef = useRef(null)
  const callbackRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)

  const handleCredential = useCallback(
    async (credential) => {
      setLoading(true)
      setLocalError(null)

      try {
        const payload = await googleAuth({
          credential,
          terms_accepted: termsAccepted,
          marketing_opt_in: marketingOptIn,
        })
        await onSuccess?.(payload)
      } catch (error) {
        setLocalError(error.message)
        await onError?.(error)
      } finally {
        setLoading(false)
      }
    },
    [marketingOptIn, onError, onSuccess, termsAccepted],
  )

  useEffect(() => {
    callbackRef.current = handleCredential
  }, [handleCredential])

  useEffect(() => {
    let cancelled = false

    loadGoogleIdentityServices()
      .then((google) => {
        if (cancelled || !buttonRef.current) {
          return
        }

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => callbackRef.current?.(response.credential),
        })
        google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 360,
        })
      })
      .catch((error) => setLocalError(error.message))

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div ref={buttonRef} aria-busy={loading} className="flex min-h-11 items-center justify-center" />
      {(loading || localError) && (
        <p className={`mt-2 text-xs ${localError ? 'text-red-700' : 'text-slate-500'}`} role={localError ? 'alert' : 'status'}>
          {localError ?? 'Connexion Google en cours…'}
        </p>
      )}
    </div>
  )
}
