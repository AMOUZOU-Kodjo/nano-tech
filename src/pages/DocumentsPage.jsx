import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments.js'
import { useFiles } from '@/hooks/useFiles.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'

const TEXT = {
  document: { fr: 'Document', en: 'Document' },
  invalidJson: { fr: 'Les données doivent être un JSON valide.', en: 'Data must be valid JSON.' },
  invalidObject: { fr: 'Les données doivent être un objet JSON.', en: 'Data must be a JSON object.' },
  editDocument: { fr: 'Modifier le document', en: 'Edit the document' },
  templateId: { fr: 'Identifiant du modèle', en: 'Template ID' },
  documentData: { fr: 'Données du document', en: 'Document data' },
  save: { fr: 'Enregistrer', en: 'Save' },
  download: { fr: 'Télécharger', en: 'Download' },
  sendByEmail: { fr: 'Envoyer par email', en: 'Send by email' },
  remove: { fr: 'Supprimer', en: 'Delete' },
  downloadFailed: { fr: 'Le document n’a pas pu être téléchargé.', en: 'The document could not be downloaded.' },
  fileIdRequired: { fr: 'Saisissez un identifiant de fichier.', en: 'Enter a file ID.' },
  shareTokenRequired: { fr: 'Saisissez un jeton de partage.', en: 'Enter a share token.' },
  title: { fr: 'Documents', en: 'Documents' },
  subtitle: { fr: 'CV et lettres générés, puis fichiers associés.', en: 'Generated CVs and letters, then associated files.' },
  guestIntro: { fr: 'Vous consultez en invité.', en: 'You are browsing as a guest.' },
  guestLink: { fr: 'Connectez-vous', en: 'Sign in' },
  guestOutro: { fr: 'pour gérer vos documents.', en: 'to manage your documents.' },
  myDocuments: { fr: 'Mes documents', en: 'My documents' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  noDocument: { fr: 'Aucun document disponible.', en: 'No document available.' },
  loadingDocument: { fr: 'Chargement du document…', en: 'Loading document…' },
  selectDocument: { fr: 'Sélectionnez un document pour l’éditer.', en: 'Select a document to edit it.' },
  emailSent: { fr: 'Document envoyé par email.', en: 'Document sent by email.' },
  fileById: { fr: 'Fichier par identifiant', en: 'File by ID' },
  fileIdPlaceholder: { fr: 'Identifiant du fichier', en: 'File ID' },
  retrieve: { fr: 'Récupérer', en: 'Retrieve' },
  publicFileByToken: { fr: 'Fichier public par jeton', en: 'Public file by token' },
  shareTokenPlaceholder: { fr: 'Jeton de partage', en: 'Share token' },
  open: { fr: 'Ouvrir', en: 'Open' },
  fileFallback: { fr: 'fichier', en: 'file' },
  downloadRetrievedFile: { fr: 'Télécharger le fichier récupéré', en: 'Download the retrieved file' },
}

// Affiche une réponse API non typée sous forme JSON, sans invention de champs.
function JsonBlock({ value }) {
  return <pre className="mt-4 overflow-x-auto rounded-2xl bg-surface-muted/60 p-4 font-mono text-xs leading-relaxed text-ink-muted">{JSON.stringify(value, null, 2)}</pre>
}

// Normalise une liste non typée pour afficher au minimum un identifiant cliquable.
function normalizeDocuments(payload, t) {
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
        title: item.name ?? item.title ?? item.filename ?? String(id ?? t(TEXT.document)),
        type: item.type ?? item.kind ?? '',
      }
    })
    .filter((item) => item.id)
}

// Formulaire d'édition remonté quand le document affiché change.
function DocumentEditor({ detail, disabled, onSave, onDownload, onSend, onDelete }) {
  const { t } = useLocale()
  const [dataText, setDataText] = useState(JSON.stringify(detail?.data ?? {}, null, 2))
  const [templateId, setTemplateId] = useState(detail?.template_id ?? '')
  const [localError, setLocalError] = useState(null)

  function handleSave() {
    setLocalError(null)

    let parsed
    try {
      parsed = JSON.parse(dataText)
    } catch {
      setLocalError(t(TEXT.invalidJson))
      return
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setLocalError(t(TEXT.invalidObject))
      return
    }

    const changes = { data: parsed }
    if (templateId.trim()) {
      changes.template_id = templateId.trim()
    }
    onSave(changes)
  }

  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/50 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{t(TEXT.editDocument)}</h2>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="document-template" className="block text-sm font-medium text-ink-muted">
            {t(TEXT.templateId)}
          </label>
          <input
            id="document-template"
            type="text"
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-muted/60 px-4 py-3 text-sm text-ink transition placeholder:text-ink-faint focus:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </div>

        <div>
          <label htmlFor="document-data" className="block text-sm font-medium text-ink-muted">
            {t(TEXT.documentData)}
          </label>
          <textarea
            id="document-data"
            rows="10"
            value={dataText}
            onChange={(event) => setDataText(event.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-muted/60 p-4 font-mono text-xs leading-relaxed text-ink transition placeholder:text-ink-faint focus:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </div>
      </div>

      {localError && (
        <p role="alert" className="mt-5 rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {localError}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-soft disabled:opacity-50"
        >
          {t(TEXT.save)}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="rounded-xl bg-surface-muted/60 px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-strong hover:text-brand disabled:opacity-50"
        >
          {t(TEXT.download)}
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="rounded-xl bg-surface-muted/60 px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-strong hover:text-brand disabled:opacity-50"
        >
          {t(TEXT.sendByEmail)}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-500/20 dark:text-red-200 disabled:opacity-50"
        >
          {t(TEXT.remove)}
        </button>
      </div>
    </div>
  )
}

// Page documents : liste, édition des données, actions et accès aux fichiers.
export default function DocumentsPage() {
  const { t } = useLocale()
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

  const items = normalizeDocuments(listed, t)

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
      setLocalError(t(TEXT.downloadFailed))
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
      setLocalError(t(TEXT.fileIdRequired))
      return
    }
    getFile(fileId.trim())
  }

  function handleDownloadByToken() {
    setLocalError(null)
    if (!shareToken.trim()) {
      setLocalError(t(TEXT.shareTokenRequired))
      return
    }
    downloadByToken(shareToken.trim())
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.subtitle)}</p>

      {!meLoading && isGuest && (
        <p className="mt-6 rounded-2xl bg-brand-surface/70 px-5 py-4 text-sm text-ink-muted">
          {t(TEXT.guestIntro)} <Link to="/login" className="font-semibold text-brand transition hover:text-brand-soft">{t(TEXT.guestLink)}</Link> {t(TEXT.guestOutro)}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-3xl bg-surface-muted/60 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t(TEXT.myDocuments)}</h2>
          {documentsLoading && !items.length && <p className="mt-4 text-sm text-ink-faint">{t(TEXT.loading)}</p>}
          {!documentsLoading && !items.length && <p className="mt-4 text-sm text-ink-faint">{t(TEXT.noDocument)}</p>}
          <div className="mt-5 divide-y divide-line/60 overflow-hidden rounded-2xl bg-surface/70">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  selected === item.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-ink-muted hover:bg-surface-strong hover:text-ink'
                }`}
              >
                <span className="block break-all font-medium">{item.title}</span>
                {item.type && <span className={`mt-1 block text-xs ${selected === item.id ? 'text-white/70' : 'text-ink-faint'}`}>{item.type}</span>}
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
          {selected && !documentData && <p className="rounded-3xl bg-surface-muted/60 p-6 text-sm text-ink-faint sm:p-8">{t(TEXT.loadingDocument)}</p>}
          {!selected && <p className="rounded-3xl bg-surface-muted/60 p-6 text-sm text-ink-faint sm:p-8">{t(TEXT.selectDocument)}</p>}
        </div>
      </div>

      {sentEmail && (
        <p role="status" className="mt-6 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
          {t(TEXT.emailSent)}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-surface-muted/60 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t(TEXT.fileById)}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <input
              type="text"
              value={fileId}
              onChange={(event) => setFileId(event.target.value)}
              placeholder={t(TEXT.fileIdPlaceholder)}
              className="min-w-0 flex-1 rounded-xl bg-surface px-4 py-3 text-sm text-ink transition placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <button
              type="button"
              onClick={handleGetFile}
              disabled={filesLoading}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-soft disabled:opacity-50"
            >
              {t(TEXT.retrieve)}
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-muted/60 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t(TEXT.publicFileByToken)}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <input
              type="text"
              value={shareToken}
              onChange={(event) => setShareToken(event.target.value)}
              placeholder={t(TEXT.shareTokenPlaceholder)}
              className="min-w-0 flex-1 rounded-xl bg-surface px-4 py-3 text-sm text-ink transition placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <button
              type="button"
              onClick={handleDownloadByToken}
              disabled={filesLoading}
              className="rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-strong hover:text-brand disabled:opacity-50"
            >
              {t(TEXT.open)}
            </button>
          </div>
        </div>
      </div>

      {fileData && !(fileData instanceof Blob) && <JsonBlock value={fileData} />}
      {fileData instanceof Blob && (
        <a
          href={URL.createObjectURL(fileData)}
          download={fileData.name || t(TEXT.fileFallback)}
          className="mt-6 inline-flex text-sm font-semibold text-brand transition hover:text-brand-soft"
        >
          {t(TEXT.downloadRetrievedFile)}
        </a>
      )}

      {(localError || documentsError || filesError) && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {localError ?? documentsError?.message ?? filesError?.message}
        </p>
      )}
    </section>
  )
}
