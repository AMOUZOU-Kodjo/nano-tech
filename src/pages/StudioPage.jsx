import { useEffect, useState } from 'react'
import { buildApiUrl } from '@/api/client.js'
import CvDataForm from '@/components/CvDataForm.jsx'
import { useCatalog } from '@/hooks/useCatalog.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useRender } from '@/hooks/useRender.js'

const TEXT = {
  template: { fr: 'Modèle', en: 'Template' },
  renderPreviewTitle: { fr: 'Aperçu du document', en: 'Document preview' },
  renderResultTitle: { fr: 'Document généré', en: 'Generated document' },
  documentReady: { fr: 'Votre document est prêt.', en: 'Your document is ready.' },
  downloadDocument: { fr: 'Télécharger le document', en: 'Download the document' },
  downloadNamed: (name) => ({ fr: `Télécharger ${name}`, en: `Download ${name}` }),
  noDownloadLink: {
    fr: 'Le document n’est pas disponible pour le moment.',
    en: 'The document is not available right now.',
  },
  rewriteResultTitle: { fr: 'Votre texte réécrit', en: 'Your rewritten text' },
  rewriteReady: { fr: 'Votre texte a été réécrit.', en: 'Your text has been rewritten.' },
  missingHint: {
    fr: 'Quelques précisions peuvent améliorer le résultat :',
    en: 'A few details could improve the result:',
  },
  question: { fr: 'Question', en: 'Question' },
  invalidData: { fr: 'Vérifiez vos informations.', en: 'Please check your details.' },
  selectTemplate: { fr: 'Sélectionnez un modèle.', en: 'Select a template.' },
  sourceRequired: { fr: 'Ajoutez le texte à améliorer.', en: 'Add the text you want to improve.' },
  title: { fr: 'Studio CV et lettres', en: 'CV and cover letter studio' },
  subtitle: {
    fr: 'Créez vos CV et lettres à partir de modèles, puis améliorez votre texte avec l’assistant.',
    en: 'Create CVs and cover letters from templates, then improve your text with the assistant.',
  },
  templatesTab: { fr: 'Créer un document', en: 'Create a document' },
  rewriteTab: { fr: 'Améliorer un texte', en: 'Improve text' },
  stepOne: { fr: 'Étape 1 — Choisir un modèle', en: 'Step 1 — Choose a template' },
  stepTwo: { fr: 'Étape 2 — Compléter vos informations', en: 'Step 2 — Fill in your details' },
  templateCatalog: { fr: 'Choisissez le style de votre document.', en: 'Choose the style of your document.' },
  letter: { fr: 'Lettre', en: 'Letter' },
  loading: { fr: 'Chargement…', en: 'Loading…' },
  noTemplate: { fr: 'Aucun modèle disponible.', en: 'No template available.' },
  use: { fr: 'Choisir ce modèle', en: 'Choose this template' },
  preview: { fr: 'Voir l’aperçu', en: 'View preview' },
  templatePreview: { fr: 'Aperçu du modèle sélectionné', en: 'Selected template preview' },
  templatePreviewAlt: (id) => ({ fr: `Aperçu du modèle ${id}`, en: `Preview of template ${id}` }),
  renderTemplate: { fr: 'Générer le document', en: 'Generate the document' },
  renderIntro: {
    fr: 'Renseignez les informations qui apparaîtront dans votre document.',
    en: 'Fill in the details that will appear in your document.',
  },
  type: { fr: 'Type de document', en: 'Document type' },
  multipleLetters: { fr: 'Lettres multiples', en: 'Multiple letters' },
  selectedTemplate: { fr: 'Modèle choisi', en: 'Selected template' },
  noTemplateSelected: { fr: 'Aucun modèle choisi', en: 'No template selected' },
  changeTemplate: { fr: 'Choisissez un modèle à l’étape 1.', en: 'Choose a template in step 1.' },
  format: { fr: 'Format du document', en: 'Document format' },
  data: { fr: 'Informations du document', en: 'Document details' },
  dataHint: {
    fr: 'Renseignez vos informations ci-dessous.',
    en: 'Fill in your details below.',
  },
  rendering: { fr: 'Génération…', en: 'Generating…' },
  render: { fr: 'Générer', en: 'Generate' },
  rewritePanel: { fr: 'Améliorer mon texte', en: 'Improve my text' },
  rewriteIntro: {
    fr: 'Renseignez les informations nécessaires à la personnalisation.',
    en: 'Fill in the details needed to personalize your document.',
  },
  language: { fr: 'Langue', en: 'Language' },
  french: { fr: 'Français', en: 'French' },
  english: { fr: 'Anglais', en: 'English' },
  targetJob: { fr: 'Poste visé', en: 'Target job' },
  structuredCv: { fr: 'J’ai déjà un CV structuré', en: 'I already have a structured CV' },
  letterType: { fr: 'Type de lettre', en: 'Letter type' },
  jobTitle: { fr: 'Intitulé du poste', en: 'Job title' },
  company: { fr: 'Entreprise', en: 'Company' },
  fullName: { fr: 'Nom complet', en: 'Full name' },
  email: { fr: 'Email', en: 'Email' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  personalInfo: { fr: 'Vos informations', en: 'Your details' },
  letterText: { fr: 'Votre texte', en: 'Your text' },
  attachStructuredCv: { fr: 'Joindre un CV structuré', en: 'Attach a structured CV' },
  sourceText: { fr: 'Votre texte', en: 'Your text' },
  processing: { fr: 'Amélioration…', en: 'Improving…' },
  rewrite: { fr: 'Améliorer le texte', en: 'Improve text' },
  rewriteDone: { fr: 'Votre texte est prêt.', en: 'Your text is ready.' },
  error: {
    fr: 'Une erreur est survenue. Réessayez dans quelques instants.',
    en: 'Something went wrong. Please try again shortly.',
  },
}

// Normalise la liste des modèles pour afficher un titre lisible.
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

function resolveUrl(value) {
  if (typeof value !== 'string' || !value) {
    return null
  }
  return /^https?:\/\//i.test(value) ? value : buildApiUrl(value)
}

function emptyRenderData(kind) {
  if (kind === 'cv') {
    return {
      basics: { full_name: '', email: '', phone: '', links: [], photo_data_url: null },
    }
  }

  return {
    basics: { full_name: '', email: '', phone: '' },
    kind: '',
    job_title: '',
    company: '',
    raw_text: '',
  }
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

  return (
    <div className="mt-8 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.renderResultTitle)}</h2>
      <p className="mt-3 text-sm text-ink-muted">{t(TEXT.documentReady)}</p>
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
    </div>
  )
}

function RewriteResult({ data, t }) {
  const rewrittenText = [
    data?.data?.rewritten_text,
    data?.data?.text,
    data?.data?.content,
    data?.rewritten_text,
    data?.text,
    data?.content,
  ].find((value) => typeof value === 'string' && value.trim())
  const questions = Array.isArray(data?.missing)
    ? data.missing
      .map((item) => item?.question)
      .filter((value) => typeof value === 'string' && value.trim())
    : []

  return (
    <div className="mt-8 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.rewriteResultTitle)}</h2>
      {rewrittenText ? (
        <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-surface p-5 text-sm leading-relaxed text-ink ring-1 ring-line/50">
          {rewrittenText}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">{t(TEXT.rewriteReady)}</p>
      )}
      {questions.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink">{t(TEXT.missingHint)}</p>
          <ul className="mt-3 space-y-3 text-sm text-ink-muted">
            {questions.map((question, index) => (
              <li key={`${question}-${index}`} className="rounded-xl bg-amber-50/80 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Page studio : création de documents et amélioration du texte.
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
  const [previewId, setPreviewId] = useState('')
  const [lastAction, setLastAction] = useState(null)
  const [renderForm, setRenderForm] = useState({ kind: 'cv', template_id: '', format: 'html', data: emptyRenderData('cv') })
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

  const templateKind = renderForm.kind === 'cv' ? 'cv' : 'letter'

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
  const selectedTemplate = items.find((item) => item.id === renderForm.template_id)
  const previewUrl = previewId
    ? buildApiUrl(`/v1/templates/${encodeURIComponent(templateKind)}/${encodeURIComponent(previewId)}/preview.svg`)
    : null

  function changeRenderKind(kind) {
    setRenderForm((current) => ({
      ...current,
      kind,
      template_id: '',
      data: emptyRenderData(kind),
    }))
    setPreviewId('')
  }

  function updateRenderData(field, value) {
    setRenderForm((current) => ({
      ...current,
      data: { ...current.data, [field]: value },
    }))
  }

  function updateRenderBasics(field, value) {
    setRenderForm((current) => ({
      ...current,
      data: {
        ...current.data,
        basics: { ...current.data.basics, [field]: value },
      },
    }))
  }

  function handleRender(event) {
    event.preventDefault()
    setLocalError(null)

    if (!renderForm.template_id.trim()) {
      setLocalError(t(TEXT.selectTemplate))
      return
    }

    if (!renderForm.data || typeof renderForm.data !== 'object' || Array.isArray(renderForm.data)) {
      setLocalError(t(TEXT.invalidData))
      return
    }

    const changes = {
      template_id: renderForm.template_id.trim(),
      format: renderForm.format,
      data: renderForm.data,
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
          <section className="mt-10 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t(TEXT.stepOne)}</p>
                <h2 className="mt-2 text-lg font-semibold text-ink sm:text-xl">{t(TEXT.templateCatalog)}</h2>
              </div>
              <select
                aria-label={t(TEXT.type)}
                value={renderForm.kind}
                onChange={(event) => changeRenderKind(event.target.value)}
                className="w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40 sm:w-56"
              >
                <option value="cv">CV</option>
                <option value="letter">{t(TEXT.letter)}</option>
                <option value="letters">{t(TEXT.multipleLetters)}</option>
              </select>
            </div>

            {catalogLoading && !items.length && <p className="mt-5 text-sm text-ink-muted">{t(TEXT.loading)}</p>}
            {!catalogLoading && !items.length && <p className="mt-5 text-sm text-ink-muted">{t(TEXT.noTemplate)}</p>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const selected = item.id === renderForm.template_id

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between gap-4 rounded-2xl p-4 ring-1 transition ${
                      selected ? 'bg-surface ring-brand/60' : 'bg-surface/70 ring-line/50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setRenderForm((current) => ({ ...current, template_id: item.id }))
                          setPreviewId(item.id)
                        }}
                        className="flex-1 rounded-xl bg-brand px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-brand-soft sm:text-xs"
                      >
                        {t(TEXT.use)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewId(item.id)}
                        className="flex-1 rounded-xl bg-surface-muted px-3 py-2 text-[11px] font-semibold text-ink-muted transition hover:text-brand sm:text-xs"
                      >
                        {t(TEXT.preview)}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {previewUrl && (
              <div className="mt-6 grid items-center gap-4 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/50 lg:grid-cols-[minmax(0,1fr)_240px]">
                <img
                  src={previewUrl}
                  alt={t(TEXT.templatePreviewAlt(previewId))}
                  className="max-h-64 w-full rounded-xl bg-surface object-contain p-2 ring-1 ring-line/50"
                />
                <div>
                  <p className="text-sm font-medium text-ink">{t(TEXT.templatePreview)}</p>
                  <p className="mt-1 text-xs text-ink-muted">{selectedTemplate?.title ?? previewId}</p>
                </div>
              </div>
            )}
          </section>

          <form onSubmit={handleRender} className="mt-6 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t(TEXT.stepTwo)}</p>
              <h2 className="mt-2 text-lg font-semibold text-ink sm:text-xl">{t(TEXT.renderTemplate)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.renderIntro)}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className={labelClassName}>{t(TEXT.selectedTemplate)}</p>
                <div className="mt-2 rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60">
                  {selectedTemplate ? selectedTemplate.title : t(TEXT.noTemplateSelected)}
                </div>
                <p className="mt-1 text-xs text-ink-faint">{t(TEXT.changeTemplate)}</p>
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
            </div>

            <div className="mt-8 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/50 sm:p-5">
              <p className={labelClassName}>{t(TEXT.data)}</p>
              <p className="mt-1 text-xs text-ink-faint">{t(TEXT.dataHint)}</p>
              <div className="mt-4">
                {renderForm.kind === 'cv' ? (
                  <CvDataForm
                    value={renderForm.data}
                    onChange={(next) => setRenderForm((current) => ({ ...current, data: next }))}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-ink">{t(TEXT.personalInfo)}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="render-full-name" className={labelClassName}>{t(TEXT.fullName)}</label>
                        <input
                          id="render-full-name"
                          type="text"
                          value={renderForm.data?.basics?.full_name ?? ''}
                          onChange={(event) => updateRenderBasics('full_name', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="render-email" className={labelClassName}>{t(TEXT.email)}</label>
                        <input
                          id="render-email"
                          type="email"
                          value={renderForm.data?.basics?.email ?? ''}
                          onChange={(event) => updateRenderBasics('email', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="render-phone" className={labelClassName}>{t(TEXT.phone)}</label>
                        <input
                          id="render-phone"
                          type="text"
                          value={renderForm.data?.basics?.phone ?? ''}
                          onChange={(event) => updateRenderBasics('phone', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="render-letter-kind" className={labelClassName}>{t(TEXT.letterType)}</label>
                        <input
                          id="render-letter-kind"
                          type="text"
                          value={renderForm.data?.kind ?? ''}
                          onChange={(event) => updateRenderData('kind', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="render-job" className={labelClassName}>{t(TEXT.jobTitle)}</label>
                        <input
                          id="render-job"
                          type="text"
                          value={renderForm.data?.job_title ?? ''}
                          onChange={(event) => updateRenderData('job_title', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="render-company" className={labelClassName}>{t(TEXT.company)}</label>
                        <input
                          id="render-company"
                          type="text"
                          value={renderForm.data?.company ?? ''}
                          onChange={(event) => updateRenderData('company', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="render-letter-text" className={labelClassName}>{t(TEXT.letterText)}</label>
                        <textarea
                          id="render-letter-text"
                          rows="6"
                          value={renderForm.data?.raw_text ?? ''}
                          onChange={(event) => updateRenderData('raw_text', event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={renderLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50 sm:w-auto"
              >
                {t(renderLoading ? TEXT.rendering : TEXT.render)}
              </button>
            </div>
          </form>
          {lastAction === 'render' && renderData && <RenderResult data={renderData} t={t} />}
        </>
      )}

      {activeTab === 'rewrite' && (
        <>
          <form onSubmit={handleRewrite} className="mt-10 rounded-3xl bg-surface-muted/40 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.rewritePanel)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.rewriteIntro)}</p>

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

      {localError ? (
        <p role="alert" className="mt-6 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {localError}
        </p>
      ) : (
        (catalogError || renderError) && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {t(TEXT.error)}
          </p>
        )
      )}
    </section>
  )
}
