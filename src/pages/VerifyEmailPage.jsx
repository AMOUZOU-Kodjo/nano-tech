import { useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { useVerifyEmail } from '@/hooks/useVerifyEmail.js'

const TEXT = {
  title: { fr: 'Vérification de l’email', en: 'Email verification' },
  missingToken: {
    fr: 'Ce lien ne contient pas de jeton de vérification.',
    en: 'This link does not contain a verification token.',
  },
  checking: { fr: 'Vérification en cours…', en: 'Verifying…' },
  invalidLink: { fr: 'Lien invalide ou expiré.', en: 'Invalid or expired link.' },
  verified: {
    fr: 'Email vérifié. Votre session est active.',
    en: 'Email verified. Your session is active.',
  },
  continue: { fr: 'Continuer', en: 'Continue' },
  backToLogin: { fr: 'Retour à la connexion', en: 'Back to sign in' },
}

// N'autorise qu'une redirection locale afin d'éviter toute ouverture vers un site externe.
function safeReturnTo(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

// Page de callback du lien de vérification envoyé par email.
export default function VerifyEmailPage() {
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const { reload } = useMeContext()
  const token = searchParams.get('token') ?? ''
  const returnTo = safeReturnTo(searchParams.get('return_to'))

  const onSuccess = useCallback(() => {
    reload()
  }, [reload])

  const { verifyEmail, data, loading, error } = useVerifyEmail({ onSuccess })

  // Diffère l'appel pour ne pas modifier l'état directement pendant le rendu de l'effet.
  useEffect(() => {
    if (!token) {
      return undefined
    }

    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return verifyEmail(token)
      }
      return null
    })

    return () => {
      active = false
    }
  }, [token, verifyEmail])

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">{t(TEXT.title)}</h1>

        {!token && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {t(TEXT.missingToken)}
          </p>
        )}

        {token && loading && <p className="mt-4 text-sm text-slate-600">{t(TEXT.checking)}</p>}

        {token && error && !data && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {t(TEXT.invalidLink)} {error.message}
          </p>
        )}

        {data && (
          <div className="mt-4">
            <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              {t(TEXT.verified)}
            </p>
            <Link
              to={returnTo}
              className="mt-4 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            >
              {t(TEXT.continue)}
            </Link>
          </div>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          {t(TEXT.backToLogin)}
        </Link>
      </div>
    </section>
  )
}
