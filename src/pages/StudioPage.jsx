import { useEffect, useState } from 'react'
import { buildApiUrl } from '@/api/client.js'
import CvDataForm from '@/components/CvDataForm.jsx'
import { useCatalog } from '@/hooks/useCatalog.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useRender } from '@/hooks/useRender.js'

const TEXT = {
  template: { fr: 'Modèle', en: 'Template' },
  noExtraInfo: { fr: 'Aucune information supplémentaire.', en: 'No additional information.' },
  yes: { fr: 'oui', en: 'yes' },
  no: { fr: 'non', en: 'no' },
  renderPreviewTitle: { fr: 'Aperçu du rendu', en: 'Render preview' },
  renderResultTitle: { fr: 'Résultat du rendu', en: 'Render result' },
  downloadDocument: { fr: 'Télécharger le document', en: 'Download the document' },
  downloadNamed: (name) => ({ fr: `Télécharger ${name}`, en: `Download ${name}` }),
  noDownloadLink: { fr: 'Aucun lien de téléchargement renvoyé.', en: 'No download link returned.' },
  rewriteResultTitle: { fr: 'Résultat de la réécriture', en: 'Rewrite result' },
  missingInfo: { fr: 'Informations manquantes', en: 'Missing information' },
  question: { fr: 'Question', en: 'Question' },
  invalidJson: (label) => ({ fr: `${label} doit être un JSON valide.`, en: `${label} must be valid JSON.` }),
  invalidObject: (label) => ({ fr: `${label} doit être un objet JSON.`, en: `${label} must be a JSON object.` }),
  selectTemplate: { fr: 'Sélectionnez un modèle.', en: 'Select a template.' },
  dataRequired: { fr: 'Les données', en: 'The data' },
  sourceRequired: { fr: 'Le texte source est obligatoire.', en: 'Source text is required.' },
  title: { fr: 'Studio CV et lettres', en: 'CV and cover letter studio' },
  subtitle: {
    fr: 'Modèles, rendu et réécriture assistée documentés par l’API.',
    en: 'Templates, rendering and assisted rewriting documented by the API.',
  },
  templatesTab: { fr: 'Modèles et rendu', en: 'Templates and rendering' },
  rewriteTab: { fr: 'Réécriture assistée', en: 'Assisted rewriting' },
  templateCatalog: { fr: 'Catalogue de modèles', en: 'Template catalog' },
  letter: { fr: 'Lettre', en: 'Letter' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  noTemplate: { fr: 'Aucun modèle disponible.', en: 'No template available.' },
  use: { fr: 'Utiliser', en: 'Use' },
  preview: { fr: 'Aperçu', en: 'Preview' },
  templatePreview: { fr: 'Aperçu du modèle', en: 'Template preview' },
  templatePreviewAlt: (id) => ({ fr: `Aperçu du modèle ${id}`, en: `Preview of template ${id}` }),
  renderTemplate: { fr: 'Rendre un modèle', en: 'Render a template' },
  type: { fr: 'Type', en: 'Type' },
  multipleLetters: { fr: 'Lettres multiples', en: 'Multiple letters' },
  templateId: { fr: 'Identifiant du modèle', en: 'Template ID' },
  format: { fr: 'Format', en: 'Format' },
  data: { fr: 'Données', en: 'Data' },
  rendering: { fr: 'Rendu…', en: 'Rendering…' },
  render: { fr: 'Rendre', en: 'Render' },
  rewritePanel: { fr: 'Réécriture assistée', en: 'Assisted rewriting' },
  validatedFields: {
    fr: 'Uniquement les champs validés pour chaque endpoint.',
    en: 'Only fields validated for each endpoint.',
  },
  language: { fr: 'Langue', en: 'Language' },
  french: { fr: 'Français', en: 'French' },
  english: { fr: 'Anglais', en: 'English' },
  targetJob: { fr: 'Poste visé', en: 'Target job' },
  structuredCv: { fr: 'Fournir un CV déjà structuré', en: 'Provide an already structured CV' },
  letterType: { fr: 'Type de lettre', en: 'Letter type' },
  jobTitle: { fr: 'Intitulé du poste', en: 'Job title' },
  company: { fr: 'Entreprise', en: 'Company' },
  attachStructuredCv: { fr: 'Joindre un CV déjà structuré', en: 'Attach an already structured CV' },
  sourceText: { fr: 'Texte source', en: 'Source text' },
  processing: { fr: 'Traitement…', en: 'Processing…' },
  rewrite: { fr: 'Réécrire', en: 'Rewrite' },
  rewriteDone: { fr: 'Réécriture terminée.', en: 'Rewrite completed.' },
}

// Affiche une réponse API non typée sous forme JSON, sans interprétation hasardeuse.
function JsonBlock({ value }) {
  return <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>
}

// Normalise une liste non typée pour afficher au minimum un identifiant exploitable.
function normalizeTemplates(payload, t) {
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
        title: item.name ?? item.title ?? String(id ?? t(TEXT.template)),
      }
    })
    .filter((item) => item.id)
}

function formatValue(value, t) {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return t(value ? TEXT.yes : TEXT.no)
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '—'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function ValueRows({ value, t }) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const rows = Object.entries(value).filter(([, item]) => item !== null && item !== undefined)
  if (!rows.length) {
    return <p className="mt-4 text-sm text-ink-muted">{t(TEXT.noExtraInfo)}</p>
  }

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {rows.map(([key, item]) => (
        <div key={key} className="rounded-xl bg-surface-muted/60 p-4">
          <dt className="break-all text-xs font-medium uppercase tracking-wide text-ink-faint">{key}</dt>
          <dd className="mt-1.5 break-all text-sm text-ink">{formatValue(item, t)}</dd>
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

function RenderResult({ data, t }) {
  if (typeof data === 'string') {
    return (
      <div className="mt-8 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.renderPreviewTitle)}</h2>
        <iframe
          srcDoc={data}
          sandbox=""
          title={t(TEXT.renderPreviewTitle)}
          className="mt-5 h-96 w-full rounded-2xl bg-surface ring-1 ring-line/60"
        />
      </div>
    )
  }

  const downloadUrl = resolveUrl(data?.download_url ?? data?.document?.download_url ?? data?.url)
  const fileName = data?.document?.filename ?? data?.document?.name
  const details = data?.document && typeof data.document === 'object' ? data.document : data
  const hasRows = details && typeof details === 'object' && !Array.isArray(details) && Object.keys(details).length > 0

  return (
    <div className="mt-8 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.renderResultTitle)}</h2>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft sm:w-auto"
        >
          {fileName ? t(TEXT.downloadNamed(fileName)) : t(TEXT.downloadDocument)}
        </a>
      ) : (
        <p className="mt-4 text-sm text-ink-muted">{t(TEXT.noDownloadLink)}</p>
      )}
      {hasRows ? <ValueRows value={details} t={t} /> : <JsonBlock value={data} />}
    </div>
  )
}

function RewriteResult({ data, t }) {
  const missing = Array.isArray(data?.missing) ? data.missing : []
  const hasRows = data?.data && typeof data.data === 'object' && !Array.isArray(data.data) && Object.keys(data.data).length > 0

  return (
    <div className="mt-8 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.rewriteResultTitle)}</h2>
      {hasRows && <ValueRows value={data.data} t={t} />}
      {missing.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">{t(TEXT.missingInfo)}</h3>
          <ul className="mt-3 space-y-3 text-sm text-ink-muted">
            {missing.map((item, index) => (
              <li key={`${item?.path ?? 'question'}-${index}`} className="rounded-xl bg-amber-50/80 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <span className="font-medium">{item?.path ?? t(TEXT.question)}</span>
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

function parseJson(value, label, t) {
  try {
    return { value: JSON.parse(value) }
  } catch {
    return { error: t(TEXT.invalidJson(label)) }
  }
}

// Analyse un champ JSON attendu comme objet ou retourne un message d'erreur local.
function parseRequiredObject(value, label, t) {
  const parsed = parseJson(value, label, t)
  if (parsed.error) {
    return parsed
  }
  if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    return { error: t(TEXT.invalidObject(label)) }
  }
  return { value: parsed.value }
}

// Page studio : catalogue, rendu de modèles et assistants de réécriture documentés.
export default function StudioPage() {
  const { t } = useLocale()
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
  const [activeTab, setActiveTab] = useState('studio')
  const [templateKind, setTemplateKind] = useState('cv')
  const [previewId, setPreviewId] = useState('')
  const [lastAction, setLastAction] = useState(null)
  const [renderForm, setRenderForm] = useState({ kind: 'cv', template_id: '', format: 'html', data: '{}' })
  const [rewriteForm, setRewriteForm] = useState({
    kind: 'cv',
    lang: 'fr',
    target_job: '',
    raw_text: '',
    existing_data: null,
    useStructuredCv: false,
    letter_kind: '',
    job_title: '',
    company: '',
    cv_data: null,
    useStructuredCvForLetter: false,
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

  const items = normalizeTemplates(templates, t)
  const previewUrl = previewId
    ? buildApiUrl(`/v1/templates/${encodeURIComponent(templateKind)}/${encodeURIComponent(previewId)}/preview.svg`)
    : null

  function handleRender(event) {
    event.preventDefault()
    setLocalError(null)

    if (!renderForm.template_id.trim()) {
      setLocalError(t(TEXT.selectTemplate))
      return
    }

    const parsed = parseRequiredObject(renderForm.data, t(TEXT.dataRequired), t)
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
      setLocalError(t(TEXT.sourceRequired))
      return
    }

    setLastAction('rewrite')

    if (rewriteForm.kind === 'cv') {
      rewriteCv({
        lang: rewriteForm.lang,
        target_job: rewriteForm.target_job,
        raw_text: rewriteForm.raw_text,
        existing_data: rewriteForm.useStructuredCv ? rewriteForm.existing_data : null,
      })
      return
    }

    const changes = {
      lang: rewriteForm.lang,
      kind: rewriteForm.letter_kind,
      job_title: rewriteForm.job_title,
      company: rewriteForm.company,
      raw_text: rewriteForm.raw_text,
      cv_data: rewriteForm.useStructuredCvForLetter ? rewriteForm.cv_data : null,
    }

    if (rewriteForm.kind === 'letter') {
      rewriteLetter(changes)
    } else {
      rewriteLetters(changes)
    }
  }

  const fieldClassName = 'mt-2 w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40'
  const labelClassName = 'block text-sm font-medium text-ink-muted'

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:mx-0">{t(TEXT.subtitle)}</p>
        </div>

        <div className="grid w-full grid-cols-2 self-stretch rounded-2xl bg-surface-muted/60 p-1.5 sm:inline-flex sm:w-auto sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            aria-pressed={activeTab === 'studio'}
            className={`rounded-xl px-3 py-2.5 text-[11px] font-semibold transition sm:px-5 sm:text-sm ${
              activeTab === 'studio' ? 'bg-surface text-ink shadow-sm' : 'text-ink-faint hover:text-ink'
            }`}
          >
            {t(TEXT.templatesTab)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rewrite')}
            aria-pressed={activeTab === 'rewrite'}
            className={`rounded-xl px-3 py-2.5 text-[11px] font-semibold transition sm:px-5 sm:text-sm ${
              activeTab === 'rewrite' ? 'bg-surface text-ink shadow-sm' : 'text-ink-faint hover:text-ink'
            }`}
          >
            {t(TEXT.rewriteTab)}
          </button>
        </div>
      </div>

      {activeTab === 'studio' && (
        <>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.templateCatalog)}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <select
              value={templateKind}
              onChange={(event) => {
                setTemplateKind(event.target.value)
                setPreviewId('')
              }}
              className="w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40 sm:w-auto"
            >
              <option value="cv">CV</option>
              <option value="letter">{t(TEXT.letter)}</option>
            </select>
          </div>

          {catalogLoading && !items.length && <p className="mt-5 text-sm text-ink-muted">{t(TEXT.loading)}</p>}
          {!catalogLoading && !items.length && <p className="mt-5 text-sm text-ink-muted">{t(TEXT.noTemplate)}</p>}

          <div className="mt-5 divide-y divide-line/60">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-ink">{item.title}</span>
                <div className="flex w-full gap-4 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setRenderForm((current) => ({ ...current, template_id: item.id }))}
                    className="flex-1 text-center text-sm font-medium text-brand transition hover:text-brand-soft sm:flex-none"
                  >
                    {t(TEXT.use)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewId(item.id)}
                    className="flex-1 text-center text-sm font-medium text-ink-muted transition hover:text-brand sm:flex-none"
                  >
                    {t(TEXT.preview)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {previewUrl && (
            <div className="mt-6">
              <p className="text-sm font-medium text-ink-muted">{t(TEXT.templatePreview)}</p>
              <img
                src={previewUrl}
                alt={t(TEXT.templatePreviewAlt(previewId))}
                className="mt-3 max-h-96 w-full rounded-2xl bg-surface object-contain p-2 ring-1 ring-line/60"
              />
            </div>
          )}
        </div>

        <form onSubmit={handleRender} className="rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.renderTemplate)}</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="render-kind" className={labelClassName}>{t(TEXT.type)}</label>
              <select
                id="render-kind"
                value={renderForm.kind}
                onChange={(event) => setRenderForm({ ...renderForm, kind: event.target.value })}
                className={fieldClassName}
              >
                <option value="cv">CV</option>
                <option value="letter">{t(TEXT.letter)}</option>
                <option value="letters">{t(TEXT.multipleLetters)}</option>
              </select>
            </div>

            <div>
              <label htmlFor="render-template" className={labelClassName}>
                {t(TEXT.templateId)}
              </label>
              <input
                id="render-template"
                type="text"
                list="render-templates"
                required
                value={renderForm.template_id}
                onChange={(event) => setRenderForm({ ...renderForm, template_id: event.target.value })}
                className={fieldClassName}
              />
              <datalist id="render-templates">
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="render-format" className={labelClassName}>{t(TEXT.format)}</label>
              <select
                id="render-format"
                value={renderForm.format}
                onChange={(event) => setRenderForm({ ...renderForm, format: event.target.value })}
                className={fieldClassName}
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </div>

            <div>
              <label htmlFor="render-data" className={labelClassName}>{t(TEXT.data)}</label>
              <textarea
                id="render-data"
                rows="6"
                required
                value={renderForm.data}
                onChange={(event) => setRenderForm({ ...renderForm, data: event.target.value })}
                className={`${fieldClassName} font-mono text-xs`}
              />
            </div>

            <button
              type="submit"
              disabled={renderLoading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50 sm:w-auto"
            >
              {t(renderLoading ? TEXT.rendering : TEXT.render)}
            </button>
          </div>
        </form>
        </div>
        {lastAction === 'render' && renderData && <RenderResult data={renderData} t={t} />}
        </>
      )}

      {activeTab === 'rewrite' && (
        <>
          <form onSubmit={handleRewrite} className="mt-10 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.rewritePanel)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.validatedFields)}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rewrite-kind" className={labelClassName}>{t(TEXT.type)}</label>
            <select
              id="rewrite-kind"
              value={rewriteForm.kind}
              onChange={(event) => setRewriteForm({ ...rewriteForm, kind: event.target.value })}
              className={fieldClassName}
            >
              <option value="cv">CV</option>
              <option value="letter">{t(TEXT.letter)}</option>
              <option value="letters">{t(TEXT.multipleLetters)}</option>
            </select>
          </div>

          <div>
            <label htmlFor="rewrite-lang" className={labelClassName}>{t(TEXT.language)}</label>
            <select
              id="rewrite-lang"
              value={rewriteForm.lang}
              onChange={(event) => setRewriteForm({ ...rewriteForm, lang: event.target.value })}
              className={fieldClassName}
            >
              <option value="fr">{t(TEXT.french)}</option>
              <option value="en">{t(TEXT.english)}</option>
            </select>
          </div>
        </div>

        {rewriteForm.kind === 'cv' ? (
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="rewrite-target" className={labelClassName}>{t(TEXT.targetJob)}</label>
              <input
                id="rewrite-target"
                type="text"
                maxLength={300}
                value={rewriteForm.target_job}
                onChange={(event) => setRewriteForm({ ...rewriteForm, target_job: event.target.value })}
                className={fieldClassName}
              />
            </div>
            <div>
              <label className="flex items-center gap-3 text-sm font-medium text-ink-muted">
                <input
                  type="checkbox"
                  checked={rewriteForm.useStructuredCv}
                  onChange={(event) => setRewriteForm({ ...rewriteForm, useStructuredCv: event.target.checked })}
                  className="h-4 w-4 rounded border-line bg-surface text-brand focus:ring-brand/40"
                />
                {t(TEXT.structuredCv)}
              </label>
              {rewriteForm.useStructuredCv && (
                <div className="mt-4 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/50 sm:p-5">
                  <CvDataForm
                    value={rewriteForm.existing_data}
                    onChange={(next) => setRewriteForm((current) => ({ ...current, existing_data: next }))}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="rewrite-letter-kind" className={labelClassName}>{t(TEXT.letterType)}</label>
              <input
                id="rewrite-letter-kind"
                type="text"
                value={rewriteForm.letter_kind}
                onChange={(event) => setRewriteForm({ ...rewriteForm, letter_kind: event.target.value })}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="rewrite-job" className={labelClassName}>{t(TEXT.jobTitle)}</label>
              <input
                id="rewrite-job"
                type="text"
                value={rewriteForm.job_title}
                onChange={(event) => setRewriteForm({ ...rewriteForm, job_title: event.target.value })}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="rewrite-company" className={labelClassName}>{t(TEXT.company)}</label>
              <input
                id="rewrite-company"
                type="text"
                value={rewriteForm.company}
                onChange={(event) => setRewriteForm({ ...rewriteForm, company: event.target.value })}
                className={fieldClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 text-sm font-medium text-ink-muted">
                <input
                  type="checkbox"
                  checked={rewriteForm.useStructuredCvForLetter}
                  onChange={(event) => setRewriteForm({ ...rewriteForm, useStructuredCvForLetter: event.target.checked })}
                  className="h-4 w-4 rounded border-line bg-surface text-brand focus:ring-brand/40"
                />
                {t(TEXT.attachStructuredCv)}
              </label>
              {rewriteForm.useStructuredCvForLetter && (
                <div className="mt-4 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/50 sm:p-5">
                  <CvDataForm
                    value={rewriteForm.cv_data}
                    onChange={(next) => setRewriteForm((current) => ({ ...current, cv_data: next }))}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="rewrite-raw" className={labelClassName}>{t(TEXT.sourceText)}</label>
          <textarea
            id="rewrite-raw"
            rows="6"
            required
            minLength={1}
            value={rewriteForm.raw_text}
            onChange={(event) => setRewriteForm({ ...rewriteForm, raw_text: event.target.value })}
            className={fieldClassName}
          />
        </div>

        <button
          type="submit"
          disabled={renderLoading}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50 sm:w-auto"
        >
          {t(renderLoading ? TEXT.processing : TEXT.rewrite)}
        </button>
      </form>

          {rewritten && (
            <p role="status" className="mt-6 rounded-xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              {t(TEXT.rewriteDone)}
            </p>
          )}
          {lastAction === 'rewrite' && renderData && <RewriteResult data={renderData} t={t} />}
        </>
      )}

      {(localError || catalogError || renderError) && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {localError ?? catalogError?.message ?? renderError?.message}
        </p>
      )}
    </section>
  )
}
