import { useCallback, useEffect, useRef, useState } from 'react'
import { googleAuth } from '@/api/authApi.js'
import { useLocale } from '@/hooks/useLocale.js'

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  '223256695224-7vgdsrm6h2rjfhbj1qjku2m0o1j955n6.apps.googleusercontent.com'

const TEXT = {
  unavailable: { fr: 'Google Identity Services indisponible.', en: 'Google Identity Services unavailable.' },
  loading: { fr: 'Connexion Google en cours…', en: 'Signing in with Google…' },
}

function loadGoogleIdentityServices(unavailableMessage) {
  if (globalThis.google?.accounts?.oauth2) {
    return Promise.resolve(globalThis.google)
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('google-identity-services')

    if (existing) {
      existing.addEventListener('load', () => resolve(globalThis.google), { once: true })
      existing.addEventListener('error', () => reject(new Error(unavailableMessage)), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-services'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(globalThis.google)
    script.onerror = () => reject(new Error(unavailableMessage))
    document.head.appendChild(script)
  })
}

export default function GoogleAuthButton({
  termsAccepted = true,
  marketingOptIn = false,
  onSuccess,
  onError,
}) {
  const { locale, t } = useLocale()
  const buttonRef = useRef(null)
  const callbackRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [buttonWidth, setButtonWidth] = useState(360)

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
    const element = buttonRef.current
    if (!element) {
      return undefined
    }

    const updateWidth = () => {
      const available = (element.parentElement?.clientWidth ?? element.clientWidth) - 8
      setButtonWidth(Math.max(200, Math.min(360, available || 360)))
    }

    updateWidth()

    if (typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    loadGoogleIdentityServices(t(TEXT.unavailable))
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
          width: buttonWidth,
          locale: locale === 'fr' ? 'fr' : 'en',
        })
      })
      .catch((error) => setLocalError(error.message))

    return () => {
      cancelled = true
    }
  }, [buttonWidth, locale, t])

  return (
    <div className="w-full min-w-0 max-w-full transform-gpu overflow-hidden [&_iframe]:max-w-full">
      <div
        ref={buttonRef}
        aria-busy={loading}
        className="flex min-h-11 w-full max-w-full items-center justify-center overflow-hidden"
      />
      {(loading || localError) && (
        <p className={`mt-2 text-xs ${localError ? 'text-red-700' : 'text-slate-500'}`} role={localError ? 'alert' : 'status'}>
          {localError ?? t(TEXT.loading)}
        </p>
      )}
    </div>
  )
}
