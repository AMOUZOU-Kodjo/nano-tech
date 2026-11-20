import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments.js'
import { useFiles } from '@/hooks/useFiles.js'
import { useMeContext } from '@/hooks/useMeContext.js'

// Affiche une réponse API non typée sous forme JSON, sans invention de champs.
function JsonBlock({ value }) {
  return <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// Normalise une liste non typée pour afficher au minimum un identifiant cliquable.
function normalizeDocuments(payload) {
  const raw = Array.isArray(payload)
    ? payload
    : (payload?.documents ?? payload?.data ?? [])

  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const id = item.id ?? item.document_id
      return {
        id: id === undefined || id === null ? '' : String(id),
        title: item.name ?? item.title ?? item.filename ?? String(id ?? 'Document'),
        type: item.type ?? item.kind ?? '',
      }
    })
    .filter((item) => item.id)
}

// Formulaire d'édition remonté quand le document affiché change.
function DocumentEditor({ detail, disabled, onSave, onDownload, onSend, onDelete }) {
  const [dataText, setDataText] = useState(JSON.stringify(detail?.data ?? {}, null, 2))
  const [templateId, setTemplateId] = useState(detail?.template_id ?? '')
  const [localError, setLocalError] = useState(null)

  function handleSave() {
    setLocalError(null)

    let parsed
    try {
      parsed = JSON.parse(dataText)
    } catch {
      setLocalError('Les données doivent être un JSON valide.')
      return
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setLocalError('Les données doivent être un objet JSON.')
      return
    }

    const changes = { data: parsed }
    if (templateId.trim()) {
      changes.template_id = templateId.trim()
    }
    onSave(changes)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Modifier le document</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="document-template" className="block text-sm font-medium text-slate-700">
            Identifiant du modèle
          </label>
          <input
            id="document-template"
            type="text"
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          />
        </div>

        <div>
          <label htmlFor="document-data" className="block text-sm font-medium text-slate-700">
            Données du document
          </label>
          <textarea
            id="document-data"
            rows="10"
            value={dataText}
            onChange={(event) => setDataText(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          />
        </div>
      </div>

      {localError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {localError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
        >
          Télécharger
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
        >
          Envoyer par email
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

// Page documents : liste, édition des données, actions et accès aux fichiers.
export default function DocumentsPage() {
  const { isGuest, loading: meLoading } = useMeContext()
  const documents = useDocuments()
  const files = useFiles()
  const {
    documents: listed,
    data: documentData,
    sentEmail,
    loading: documentsLoading,
    error: documentsError,
    listDocuments: fetchDocuments,
    getDocument: fetchDocument,
    updateDocumentData: updateDocument,
    deleteDocument: removeDocument,
    downloadDocument: downloadDocument,
    sendDocumentEmail: sendEmail,
  } = documents
  const { data: fileData, loading: filesLoading, error: filesError, getFile, downloadByToken } = files
  const [selected, setSelected] = useState('')
  const [fileId, setFileId] = useState('')
  const [shareToken, setShareToken] = useState('')
  const [localError, setLocalError] = useState(null)

  // Diffère les chargements pour ne pas modifier l'état pendant l'effet lui-même.
  useEffect(() => {
    if (meLoading || isGuest) {
      return undefined
    }

    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return fetchDocuments()
      }
      return null
    })

    return () => {
      active = false
    }
  }, [fetchDocuments, isGuest, meLoading])

  useEffect(() => {
    if (!selected || isGuest) {
      return undefined
    }

    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return fetchDocument(selected)
      }
      return null
    })

    return () => {
      active = false
    }
  }, [selected, fetchDocument, isGuest])

  const items = normalizeDocuments(listed)

  function handleSave(changes) {
    setLocalError(null)
    updateDocument(selected, changes)
  }

  async function handleDelete() {
    setLocalError(null)
    await removeDocument(selected)
    setSelected('')
    fetchDocuments()
  }

  async function handleDownloadDocument() {
    setLocalError(null)

    const payload = await downloadDocument(selected)
    if (!(payload instanceof Blob)) {
      setLocalError('Le document n’a pas pu être téléchargé.')
      return
    }

    const name = documentData?.filename ?? documentData?.name ?? `document-${selected}`
    const url = URL.createObjectURL(payload)
    const link = document.createElement('a')

    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  function handleGetFile() {
    setLocalError(null)
    if (!fileId.trim()) {
      setLocalError('Saisissez un identifiant de fichier.')
      return
    }
    getFile(fileId.trim())
  }

  function handleDownloadByToken() {
    setLocalError(null)
    if (!shareToken.trim()) {
      setLocalError('Saisissez un jeton de partage.')
      return
    }
    downloadByToken(shareToken.trim())
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
      <p className="mt-2 text-sm text-slate-600">CV et lettres générés, puis fichiers associés.</p>

      {!meLoading && isGuest && (
        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          Vous consultez en invité. <Link to="/login" className="text-sky-600 hover:text-sky-700">Connectez-vous</Link> pour gérer vos documents.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Mes documents</h2>
          {documentsLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Chargement…</p>}
          {!documentsLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Aucun document disponible.</p>}
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                className={`block w-full rounded-lg border p-3 text-left text-sm transition ${
                  selected === item.id
                    ? 'border-sky-500 bg-sky-50 text-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="block font-medium">{item.title}</span>
                {item.type && <span className="mt-1 block text-xs text-slate-500">{item.type}</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          {selected && documentData && (
            <DocumentEditor
              key={`${selected}-${documentData?.updated_at ?? ''}`}
              detail={documentData}
              disabled={documentsLoading}
              onSave={handleSave}
              onDownload={handleDownloadDocument}
              onSend={() => sendEmail(selected)}
              onDelete={handleDelete}
            />
          )}
          {selected && !documentData && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement du document…</p>}
          {!selected && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Sélectionnez un document pour l’éditer.</p>}
        </div>
      </div>

      {sentEmail && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Document envoyé par email.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Fichier par identifiant</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              type="text"
              value={fileId}
              onChange={(event) => setFileId(event.target.value)}
              placeholder="Identifiant du fichier"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
            <button
              type="button"
              onClick={handleGetFile}
              disabled={filesLoading}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
            >
              Récupérer
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Fichier public par jeton</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              type="text"
              value={shareToken}
              onChange={(event) => setShareToken(event.target.value)}
              placeholder="Jeton de partage"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
            <button
              type="button"
              onClick={handleDownloadByToken}
              disabled={filesLoading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
            >
              Ouvrir
            </button>
          </div>
        </div>
      </div>

      {fileData && !(fileData instanceof Blob) && <JsonBlock value={fileData} />}
      {fileData instanceof Blob && (
        <a
          href={URL.createObjectURL(fileData)}
          download={fileData.name || 'fichier'}
          className="mt-6 inline-block text-sm text-sky-600 hover:text-sky-700"
        >
          Télécharger le fichier récupéré
        </a>
      )}

      {(localError || documentsError || filesError) && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {localError ?? documentsError?.message ?? filesError?.message}
        </p>
      )}
    </section>
  )
}
