import { useEffect, useState } from 'react'
import { buildApiUrl } from '@/api/client.js'
import { useCatalog } from '@/hooks/useCatalog.js'
import { useRender } from '@/hooks/useRender.js'

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  return <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// Normalise une liste non typée pour afficher au minimum un identifiant exploitable.
function normalizeTemplates(payload) {
  const raw = Array.isArray(payload) ? payload : (payload?.templates ?? payload?.data ?? [])
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const id = item.id ?? item.template_id
      return {
        id: id === undefined || id === null ? '' : String(id),
        title: item.name ?? item.title ?? String(id ?? 'Modèle'),
      }
    })
    .filter((item) => item.id)
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return value ? 'oui' : 'non'
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '—'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function ValueRows({ value }) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const rows = Object.entries(value).filter(([, item]) => item !== null && item !== undefined)
  if (!rows.length) {
    return <p className="mt-3 text-sm text-slate-600">Aucune information supplémentaire.</p>
  }

  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      {rows.map(([key, item]) => (
        <div key={key} className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">{key}</dt>
          <dd className="mt-1 text-sm text-slate-700">{formatValue(item)}</dd>
        </div>
      ))}
    </dl>
  )
}

function resolveUrl(value) {
  if (typeof value !== 'string' || !value) {
    return null
  }
  return /^https?:\/\//i.test(value) ? value : buildApiUrl(value)
}

function RenderResult({ data }) {
  if (typeof data === 'string') {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Aperçu du rendu</h2>
        <iframe
          srcDoc={data}
          sandbox=""
          title="Aperçu du rendu"
          className="mt-4 h-96 w-full rounded-lg border border-slate-200 bg-white"
        />
      </div>
    )
  }

  const downloadUrl = resolveUrl(data?.download_url ?? data?.document?.download_url ?? data?.url)
  const fileName = data?.document?.filename ?? data?.document?.name
  const details = data?.document && typeof data.document === 'object' ? data.document : data
  const hasRows = details && typeof details === 'object' && !Array.isArray(details) && Object.keys(details).length > 0

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Résultat du rendu</h2>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          className="mt-4 inline-block rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
        >
          {fileName ? `Télécharger ${fileName}` : 'Télécharger le document'}
        </a>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Aucun lien de téléchargement renvoyé.</p>
      )}
      {hasRows ? <ValueRows value={details} /> : <JsonBlock value={data} />}
    </div>
  )
}

function RewriteResult({ data }) {
  const missing = Array.isArray(data?.missing) ? data.missing : []
  const hasRows = data?.data && typeof data.data === 'object' && !Array.isArray(data.data) && Object.keys(data.data).length > 0

  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Résultat de la réécriture</h2>
      {hasRows && <ValueRows value={data.data} />}
      {missing.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-900">Informations manquantes</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {missing.map((item, index) => (
              <li key={`${item?.path ?? 'question'}-${index}`} className="rounded-lg bg-amber-50 p-3">
                <span className="font-medium text-amber-900">{item?.path ?? 'Question'}</span>
                {item?.question ? ` — ${item.question}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!hasRows && missing.length === 0 && <JsonBlock value={data} />}
    </div>
  )
}

function parseJson(value, label) {
  try {
    return { value: JSON.parse(value) }
  } catch {
    return { error: `${label} doit être un JSON valide.` }
  }
}

// Analyse un champ JSON attendu comme objet ou retourne un message d'erreur local.
function parseRequiredObject(value, label) {
  const parsed = parseJson(value, label)
  if (parsed.error) {
    return parsed
  }
  if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    return { error: `${label} doit être un objet JSON.` }
  }
  return { value: parsed.value }
}

function parseOptionalObject(value, label) {
  const raw = value.trim()
  if (!raw || raw === 'null') {
    return { value: null }
  }

  const parsed = parseJson(raw, label)
  if (parsed.error) {
    return parsed
  }
  if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    return { error: `${label} doit être un objet JSON ou null.` }
  }
  return { value: parsed.value }
}

// Page studio : catalogue, rendu de modèles et assistants de réécriture documentés.
export default function StudioPage() {
  const catalog = useCatalog()
  const render = useRender()
  const {
    templates,
    loading: catalogLoading,
    error: catalogError,
    listTemplates: fetchTemplates,
  } = catalog
  const {
    data: renderData,
    rewritten,
    loading: renderLoading,
    error: renderError,
    renderCv,
    renderLetter,
    renderLetters,
    rewriteCv,
    rewriteLetter,
    rewriteLetters,
  } = render
  const [templateKind, setTemplateKind] = useState('cv')
  const [previewId, setPreviewId] = useState('')
  const [lastAction, setLastAction] = useState(null)
  const [renderForm, setRenderForm] = useState({ kind: 'cv', template_id: '', format: 'html', data: '{}' })
  const [rewriteForm, setRewriteForm] = useState({
    kind: 'cv',
    lang: 'fr',
    target_job: '',
    raw_text: '',
    existing_data: 'null',
    letter_kind: '',
    job_title: '',
    company: '',
    cv_data: 'null',
  })
  const [localError, setLocalError] = useState(null)

  // Charge les modèles du type sélectionné sans modifier l'état pendant l'effet.
  useEffect(() => {
    let active = true

    Promise.resolve().then(() => {
      if (active) {
        return fetchTemplates(templateKind)
      }
      return null
    })

    return () => {
      active = false
    }
  }, [templateKind, fetchTemplates])

  const items = normalizeTemplates(templates)
  const previewUrl = previewId
    ? buildApiUrl(`/v1/templates/${encodeURIComponent(templateKind)}/${encodeURIComponent(previewId)}/preview.svg`)
    : null

  function handleRender(event) {
    event.preventDefault()
    setLocalError(null)

    if (!renderForm.template_id.trim()) {
      setLocalError('Sélectionnez un modèle.')
      return
    }

    const parsed = parseRequiredObject(renderForm.data, 'Les données')
    if (parsed.error) {
      setLocalError(parsed.error)
      return
    }

    const changes = {
      template_id: renderForm.template_id.trim(),
      format: renderForm.format,
      data: parsed.value,
    }

    setLastAction('render')
    if (renderForm.kind === 'cv') {
      renderCv(changes)
    } else if (renderForm.kind === 'letter') {
      renderLetter(changes)
    } else {
      renderLetters(changes)
    }
  }

  function handleRewrite(event) {
    event.preventDefault()
    setLocalError(null)

    if (!rewriteForm.raw_text.trim()) {
      setLocalError('Le texte source est obligatoire.')
      return
    }

    setLastAction('rewrite')

    if (rewriteForm.kind === 'cv') {
      const parsed = parseOptionalObject(rewriteForm.existing_data, 'Les données existantes')
      if (parsed.error) {
        setLocalError(parsed.error)
        return
      }
      rewriteCv({
        lang: rewriteForm.lang,
        target_job: rewriteForm.target_job,
        raw_text: rewriteForm.raw_text,
        existing_data: parsed.value,
      })
      return
    }

    const parsed = parseOptionalObject(rewriteForm.cv_data, 'Les données CV')
    if (parsed.error) {
      setLocalError(parsed.error)
      return
    }

    const changes = {
      lang: rewriteForm.lang,
      kind: rewriteForm.letter_kind,
      job_title: rewriteForm.job_title,
      company: rewriteForm.company,
      raw_text: rewriteForm.raw_text,
      cv_data: parsed.value,
    }

    if (rewriteForm.kind === 'letter') {
      rewriteLetter(changes)
    } else {
      rewriteLetters(changes)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Studio CV et lettres</h1>
      <p className="mt-2 text-sm text-slate-600">Modèles, rendu et réécriture assistée documentés par l’API.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Catalogue de modèles</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={templateKind}
              onChange={(event) => {
                setTemplateKind(event.target.value)
                setPreviewId('')
              }}
              className="rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
            >
              <option value="cv">CV</option>
              <option value="letter">Lettre</option>
            </select>
          </div>

          {catalogLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Chargement…</p>}
          {!catalogLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Aucun modèle disponible.</p>}

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-700">{item.title}</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRenderForm((current) => ({ ...current, template_id: item.id }))}
                    className="text-sm text-sky-700 hover:text-sky-800"
                  >
                    Utiliser
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewId(item.id)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Aperçu
                  </button>
                </div>
              </div>
            ))}
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700">Aperçu du modèle</p>
              <img
                src={previewUrl}
                alt={`Aperçu du modèle ${previewId}`}
                className="mt-2 max-h-96 w-full rounded-lg border border-slate-200 bg-white object-contain"
              />
            </div>
          )}
        </div>

        <form onSubmit={handleRender} className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Rendre un modèle</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="render-kind" className="block text-sm font-medium text-slate-700">Type</label>
              <select
                id="render-kind"
                value={renderForm.kind}
                onChange={(event) => setRenderForm({ ...renderForm, kind: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              >
                <option value="cv">CV</option>
                <option value="letter">Lettre</option>
                <option value="letters">Lettres multiples</option>
              </select>
            </div>

            <div>
              <label htmlFor="render-template" className="block text-sm font-medium text-slate-700">
                Identifiant du modèle
              </label>
              <input
                id="render-template"
                type="text"
                list="render-templates"
                required
                value={renderForm.template_id}
                onChange={(event) => setRenderForm({ ...renderForm, template_id: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
              <datalist id="render-templates">
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="render-format" className="block text-sm font-medium text-slate-700">Format</label>
              <select
                id="render-format"
                value={renderForm.format}
                onChange={(event) => setRenderForm({ ...renderForm, format: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </div>

            <div>
              <label htmlFor="render-data" className="block text-sm font-medium text-slate-700">Données</label>
              <textarea
                id="render-data"
                rows="6"
                required
                value={renderForm.data}
                onChange={(event) => setRenderForm({ ...renderForm, data: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={renderLoading}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
            >
              {renderLoading ? 'Rendu…' : 'Rendre'}
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={handleRewrite} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Réécriture assistée</h2>
        <p className="mt-2 text-sm text-slate-600">Uniquement les champs validés pour chaque endpoint.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rewrite-kind" className="block text-sm font-medium text-slate-700">Type</label>
            <select
              id="rewrite-kind"
              value={rewriteForm.kind}
              onChange={(event) => setRewriteForm({ ...rewriteForm, kind: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
            >
              <option value="cv">CV</option>
              <option value="letter">Lettre</option>
              <option value="letters">Lettres multiples</option>
            </select>
          </div>

          <div>
            <label htmlFor="rewrite-lang" className="block text-sm font-medium text-slate-700">Langue</label>
            <select
              id="rewrite-lang"
              value={rewriteForm.lang}
              onChange={(event) => setRewriteForm({ ...rewriteForm, lang: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </div>

        {rewriteForm.kind === 'cv' ? (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="rewrite-target" className="block text-sm font-medium text-slate-700">Poste visé</label>
              <input
                id="rewrite-target"
                type="text"
                maxLength={300}
                value={rewriteForm.target_job}
                onChange={(event) => setRewriteForm({ ...rewriteForm, target_job: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="rewrite-existing" className="block text-sm font-medium text-slate-700">
                Données existantes
              </label>
              <textarea
                id="rewrite-existing"
                rows="4"
                value={rewriteForm.existing_data}
                onChange={(event) => setRewriteForm({ ...rewriteForm, existing_data: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900"
              />
              <p className="mt-1 text-xs text-slate-500">Utilisez `null` si aucune donnée existante n’est disponible.</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rewrite-letter-kind" className="block text-sm font-medium text-slate-700">Type de lettre</label>
              <input
                id="rewrite-letter-kind"
                type="text"
                value={rewriteForm.letter_kind}
                onChange={(event) => setRewriteForm({ ...rewriteForm, letter_kind: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="rewrite-job" className="block text-sm font-medium text-slate-700">Intitulé du poste</label>
              <input
                id="rewrite-job"
                type="text"
                value={rewriteForm.job_title}
                onChange={(event) => setRewriteForm({ ...rewriteForm, job_title: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="rewrite-company" className="block text-sm font-medium text-slate-700">Entreprise</label>
              <input
                id="rewrite-company"
                type="text"
                value={rewriteForm.company}
                onChange={(event) => setRewriteForm({ ...rewriteForm, company: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="rewrite-cv-data" className="block text-sm font-medium text-slate-700">Données CV</label>
              <textarea
                id="rewrite-cv-data"
                rows="4"
                value={rewriteForm.cv_data}
                onChange={(event) => setRewriteForm({ ...rewriteForm, cv_data: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900"
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="rewrite-raw" className="block text-sm font-medium text-slate-700">Texte source</label>
          <textarea
            id="rewrite-raw"
            rows="6"
            required
            value={rewriteForm.raw_text}
            onChange={(event) => setRewriteForm({ ...rewriteForm, raw_text: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={renderLoading}
          className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
        >
          {renderLoading ? 'Traitement…' : 'Réécrire'}
        </button>
      </form>

      {rewritten && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Réécriture terminée.
        </p>
      )}
      {lastAction === 'rewrite' && renderData && <RewriteResult data={renderData} />}
      {lastAction === 'render' && renderData && <RenderResult data={renderData} />}

      {(localError || catalogError || renderError) && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {localError ?? catalogError?.message ?? renderError?.message}
        </p>
      )}
    </section>
  )
}
