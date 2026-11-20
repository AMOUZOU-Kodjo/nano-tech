import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFiles } from '@/hooks/useFiles.js'

// Page de réception d'un lien de document public, équivalent front de /d/{token}.
export default function DocumentSharePage() {
  const { token } = useParams()
  const files = useFiles()
  const { data, loading, error, downloadByToken } = files

  // Diffère l'appel pour ne pas modifier l'état pendant l'effet lui-même.
  useEffect(() => {
    if (!token) {
      return undefined
    }

    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return downloadByToken(token)
      }
      return null
    })

    return () => {
      active = false
    }
  }, [token, downloadByToken])

  const fileUrl = useMemo(() => (data instanceof Blob ? URL.createObjectURL(data) : null), [data])

  useEffect(() => () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
  }, [fileUrl])

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">Document partagé</h1>
        {!token && <p className="mt-4 text-sm text-red-700">Ce lien ne contient pas de jeton.</p>}
        {token && loading && <p className="mt-4 text-sm text-slate-600">Chargement du document…</p>}
        {token && error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error.message}
          </p>
        )}
        {fileUrl && (
          <div className="mt-4">
            <a
              href={fileUrl}
              download={data.name || `document-${token}`}
              className="inline-flex rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Télécharger le document
            </a>
          </div>
        )}
        {data && !fileUrl && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <Link to="/" className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  )
}
