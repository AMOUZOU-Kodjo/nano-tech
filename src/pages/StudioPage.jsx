import { useEffect, useState } from 'react'
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

// Analyse un champ JSON attendu comme objet ou retourne un message d'erreur local.
function parseObject(value, label) {
  let parsed

  try {
    parsed = JSON.parse(value || '{}')
  } catch {
    return { error: `${label} doit être un JSON valide.` }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { error: `${label} doit être un objet JSON.` }
  }

  return { value: parsed }
}

// Page studio : catalogue, rendu de modèles et assistants de réécriture documentés.
export default function StudioPage() {
  const catalog = useCatalog()
  const render = useRender()
  const {
    templates,
    preview,
    photoSpecs,
    loading: catalogLoading,
    error: catalogError,
    listTemplates: fetchTemplates,
    getTemplatePreview: fetchPreview,
    getPhotoSpecs: fetchPhotoSpecs,
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
  const [renderForm, setRenderForm] = useState({ kind: 'cv', template_id: '', format: '', data: '{}' })
  const [rewriteForm, setRewriteForm] = useState({
    kind: 'cv',
    lang: 'fr',
    target_job: '',
    raw_text: '',
    existing_data: '{}',
    letter_kind: '',
    job_title: '',
    company: '',
    cv_data: '{}',
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

  function handleRender(event) {
    event.preventDefault()
    setLocalError(null)

    const parsed = parseObject(renderForm.data, 'Les données')
    if (parsed.error) {
      setLocalError(parsed.error)
      return
    }

    const changes = { data: parsed.value }
    if (renderForm.template_id.trim()) {
      changes.template_id = renderForm.template_id.trim()
    }
    if (renderForm.format.trim()) {
      changes.format = renderForm.format.trim()
    }

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

    if (rewriteForm.kind === 'cv') {
      const parsed = parseObject(rewriteForm.existing_data, 'Les données existantes')
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

    const parsed = parseObject(rewriteForm.cv_data, 'Les données CV')
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
            <button
              type="button"
              onClick={fetchPhotoSpecs}
              disabled={catalogLoading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300 disabled:opacity-50"
            >
              Spécifications photo
            </button>
          </div>

          {catalogLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Chargement…</p>}
          {!catalogLoading && !items.length && <p className="mt-4 text-sm text-slate-600">Aucun modèle disponible.</p>}

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-700">{item.title}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewId(item.id)
                    fetchPreview(templateKind, item.id)
                  }}
                  className="text-sm text-sky-600 hover:text-sky-700"
                >
                  Aperçu
                </button>
              </div>
            ))}
          </div>

          {previewId && typeof preview === 'string' && (
            <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">{preview}</pre>
          )}
          {photoSpecs && <JsonBlock value={photoSpecs} />}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="render-template" className="block text-sm font-medium text-slate-700">
                  Identifiant du modèle
                </label>
                <input
                  id="render-template"
                  type="text"
                  value={renderForm.template_id}
                  onChange={(event) => setRenderForm({ ...renderForm, template_id: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="render-format" className="block text-sm font-medium text-slate-700">Format</label>
                <input
                  id="render-format"
                  type="text"
                  value={renderForm.format}
                  onChange={(event) => setRenderForm({ ...renderForm, format: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="render-data" className="block text-sm font-medium text-slate-700">Données</label>
              <textarea
                id="render-data"
                rows="6"
                value={renderForm.data}
                onChange={(event) => setRenderForm({ ...renderForm, data: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={renderLoading}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
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
            <input
              id="rewrite-lang"
              type="text"
              value={rewriteForm.lang}
              onChange={(event) => setRewriteForm({ ...rewriteForm, lang: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
            />
          </div>
        </div>

        {rewriteForm.kind === 'cv' ? (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="rewrite-target" className="block text-sm font-medium text-slate-700">Poste visé</label>
              <input
                id="rewrite-target"
                type="text"
                value={rewriteForm.target_job}
                onChange={(event) => setRewriteForm({ ...rewriteForm, target_job: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="rewrite-existing" className="block text-sm font-medium text-slate-700">Données existantes</label>
              <textarea
                id="rewrite-existing"
                rows="4"
                value={rewriteForm.existing_data}
                onChange={(event) => setRewriteForm({ ...rewriteForm, existing_data: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900"
              />
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
            value={rewriteForm.raw_text}
            onChange={(event) => setRewriteForm({ ...rewriteForm, raw_text: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={renderLoading}
          className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {renderLoading ? 'Traitement…' : 'Réécrire'}
        </button>
      </form>

      {rewritten && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Réécriture terminée.
        </p>
      )}
      {renderData && <JsonBlock value={renderData} />}

      {(localError || catalogError || renderError) && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {localError ?? catalogError?.message ?? renderError?.message}
        </p>
      )}
    </section>
  )
}
