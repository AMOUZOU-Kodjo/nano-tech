import { useLocale } from '@/hooks/useLocale.js'

const EMPTY_CV_DATA = {
  basics: {
    full_name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    photo_data_url: null,
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  extra: [],
}

const ARRAY_KEYS = [
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certifications',
  'extra',
]

const TEXT = {
  noEntry: { fr: 'Aucune entrée.', en: 'No entry.' },
  remove: { fr: 'Retirer', en: 'Remove' },
  addEntry: { fr: 'Ajouter une entrée', en: 'Add an entry' },
  identity: { fr: 'Identité', en: 'Identity' },
  fullName: { fr: 'Nom complet', en: 'Full name' },
  title: { fr: 'Titre', en: 'Title' },
  email: { fr: 'Email', en: 'Email' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  location: { fr: 'Localisation', en: 'Location' },
  photo: { fr: 'Photo', en: 'Photo' },
  photoPlaceholder: { fr: 'Données image ou URL', en: 'Image data or URL' },
  links: { fr: 'Liens', en: 'Links' },
  label: { fr: 'Libellé', en: 'Label' },
  url: { fr: 'URL', en: 'URL' },
  summary: { fr: 'Résumé', en: 'Summary' },
  experiences: { fr: 'Expériences', en: 'Experience' },
  role: { fr: 'Poste', en: 'Role' },
  company: { fr: 'Entreprise', en: 'Company' },
  place: { fr: 'Lieu', en: 'Location' },
  start: { fr: 'Début', en: 'Start' },
  end: { fr: 'Fin', en: 'End' },
  current: { fr: 'En cours', en: 'Current' },
  context: { fr: 'Contexte', en: 'Context' },
  bulletsOnePerLine: { fr: 'Puces, une par ligne', en: 'Bullets, one per line' },
  education: { fr: 'Formations', en: 'Education' },
  degree: { fr: 'Diplôme', en: 'Degree' },
  school: { fr: 'Établissement', en: 'School' },
  details: { fr: 'Détails', en: 'Details' },
  skills: { fr: 'Compétences', en: 'Skills' },
  group: { fr: 'Groupe', en: 'Group' },
  skillsOnePerLine: { fr: 'Compétences, une par ligne', en: 'Skills, one per line' },
  languages: { fr: 'Langues', en: 'Languages' },
  language: { fr: 'Langue', en: 'Language' },
  level: { fr: 'Niveau', en: 'Level' },
  projects: { fr: 'Projets', en: 'Projects' },
  name: { fr: 'Nom', en: 'Name' },
  description: { fr: 'Description', en: 'Description' },
  certifications: { fr: 'Certifications', en: 'Certifications' },
  issuer: { fr: 'Organisme', en: 'Issuer' },
  year: { fr: 'Année', en: 'Year' },
  extraInfo: { fr: 'Informations complémentaires', en: 'Additional information' },
  text: { fr: 'Texte', en: 'Text' },
}

function normalizeCvData(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const sourceBasics = source.basics && typeof source.basics === 'object' && !Array.isArray(source.basics) ? source.basics : {}
  const normalized = {
    ...EMPTY_CV_DATA,
    ...source,
    basics: {
      ...EMPTY_CV_DATA.basics,
      ...sourceBasics,
      full_name: typeof sourceBasics.full_name === 'string' ? sourceBasics.full_name.slice(0, 160) : '',
      links: Array.isArray(sourceBasics.links) ? sourceBasics.links : [],
    },
  }

  for (const key of ARRAY_KEYS) {
    normalized[key] = Array.isArray(source[key]) ? source[key] : []
  }

  return normalized
}

function TextField({ label, value, onChange, type = 'text', placeholder = '', maxLength }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      />
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 3, placeholder = '' }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      />
    </label>
  )
}

function StringListField({ label, value, onChange, placeholder = '' }) {
  const lines = Array.isArray(value) ? value.join('\n') : ''

  return (
    <TextAreaField
      label={label}
      value={lines}
      onChange={(text) => onChange(text.split('\n').map((line) => line.trim()).filter(Boolean))}
      placeholder={placeholder}
    />
  )
}

function CheckboxField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 bg-white"
      />
      {label}
    </label>
  )
}

function ArraySection({ title, items, empty, onChange, renderItem }) {
  const { t } = useLocale()

  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900">
        {title}
        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{items.length}</span>
      </summary>
      <div className="space-y-4 border-t border-slate-200 p-4">
        {items.length === 0 && <p className="text-xs text-slate-500">{t(TEXT.noEntry)}</p>}
        {items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {renderItem(item, index)}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {t(TEXT.remove)}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, empty])}
          className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600"
        >
          {t(TEXT.addEntry)}
        </button>
      </div>
    </details>
  )
}

export default function CvDataForm({ value, onChange }) {
  const { t } = useLocale()
  const data = normalizeCvData(value)

  function commit(next) {
    onChange(next)
  }

  function updateBasics(field, fieldValue) {
    commit({ ...data, basics: { ...data.basics, [field]: fieldValue } })
  }

  function updateLink(index, field, fieldValue) {
    const links = data.basics.links.map((link, linkIndex) =>
      linkIndex === index ? { ...link, [field]: fieldValue } : link,
    )
    updateBasics('links', links)
  }

  function updateArray(key, items) {
    commit({ ...data, [key]: items })
  }

  function updateItem(key, index, field, fieldValue) {
    const items = data[key].map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: fieldValue } : item,
    )
    updateArray(key, items)
  }

  return (
    <div className="space-y-4">
      <details open className="rounded-xl border border-slate-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900">{t(TEXT.identity)}</summary>
        <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-2">
          <TextField label={t(TEXT.fullName)} value={data.basics.full_name} onChange={(next) => updateBasics('full_name', next)} maxLength={160} />
          <TextField label={t(TEXT.title)} value={data.basics.headline} onChange={(next) => updateBasics('headline', next)} />
          <TextField label={t(TEXT.email)} type="email" value={data.basics.email} onChange={(next) => updateBasics('email', next)} />
          <TextField label={t(TEXT.phone)} value={data.basics.phone} onChange={(next) => updateBasics('phone', next)} />
          <TextField label={t(TEXT.location)} value={data.basics.location} onChange={(next) => updateBasics('location', next)} />
          <TextField
            label={t(TEXT.photo)}
            value={data.basics.photo_data_url ?? ''}
            onChange={(next) => updateBasics('photo_data_url', next || null)}
            placeholder={t(TEXT.photoPlaceholder)}
          />
          <div className="sm:col-span-2">
            <ArraySection
              title={t(TEXT.links)}
              items={data.basics.links}
              empty={{ label: '', url: '' }}
              onChange={(links) => updateBasics('links', links)}
              renderItem={(link, index) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label={t(TEXT.label)} value={link.label} onChange={(next) => updateLink(index, 'label', next)} />
                  <TextField label={t(TEXT.url)} value={link.url} onChange={(next) => updateLink(index, 'url', next)} />
                </div>
              )}
            />
          </div>
        </div>
      </details>

      <TextAreaField label={t(TEXT.summary)} value={data.summary} onChange={(next) => commit({ ...data, summary: next })} />

      <ArraySection
        title={t(TEXT.experiences)}
        items={data.experience}
        empty={{ role: '', org: '', location: '', start: '', end: '', current: false, context: '', bullets: [] }}
        onChange={(items) => updateArray('experience', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label={t(TEXT.role)} value={item.role} onChange={(next) => updateItem('experience', index, 'role', next)} />
            <TextField label={t(TEXT.company)} value={item.org} onChange={(next) => updateItem('experience', index, 'org', next)} />
            <TextField label={t(TEXT.place)} value={item.location} onChange={(next) => updateItem('experience', index, 'location', next)} />
            <TextField label={t(TEXT.start)} value={item.start} onChange={(next) => updateItem('experience', index, 'start', next)} />
            <TextField label={t(TEXT.end)} value={item.end} onChange={(next) => updateItem('experience', index, 'end', next)} />
            <CheckboxField label={t(TEXT.current)} value={item.current} onChange={(next) => updateItem('experience', index, 'current', next)} />
            <div className="sm:col-span-2">
              <TextAreaField label={t(TEXT.context)} value={item.context} onChange={(next) => updateItem('experience', index, 'context', next)} />
            </div>
            <div className="sm:col-span-2">
              <StringListField
                label={t(TEXT.bulletsOnePerLine)}
                value={item.bullets}
                onChange={(next) => updateItem('experience', index, 'bullets', next)}
              />
            </div>
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.education)}
        items={data.education}
        empty={{ degree: '', school: '', location: '', start: '', end: '', details: '' }}
        onChange={(items) => updateArray('education', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label={t(TEXT.degree)} value={item.degree} onChange={(next) => updateItem('education', index, 'degree', next)} />
            <TextField label={t(TEXT.school)} value={item.school} onChange={(next) => updateItem('education', index, 'school', next)} />
            <TextField label={t(TEXT.place)} value={item.location} onChange={(next) => updateItem('education', index, 'location', next)} />
            <TextField label={t(TEXT.start)} value={item.start} onChange={(next) => updateItem('education', index, 'start', next)} />
            <TextField label={t(TEXT.end)} value={item.end} onChange={(next) => updateItem('education', index, 'end', next)} />
            <div className="sm:col-span-2">
              <TextAreaField label={t(TEXT.details)} value={item.details} onChange={(next) => updateItem('education', index, 'details', next)} />
            </div>
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.skills)}
        items={data.skills}
        empty={{ group: '', items: [] }}
        onChange={(items) => updateArray('skills', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label={t(TEXT.group)} value={item.group} onChange={(next) => updateItem('skills', index, 'group', next)} />
            <StringListField
              label={t(TEXT.skillsOnePerLine)}
              value={item.items}
              onChange={(next) => updateItem('skills', index, 'items', next)}
            />
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.languages)}
        items={data.languages}
        empty={{ name: '', level: '' }}
        onChange={(items) => updateArray('languages', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label={t(TEXT.language)} value={item.name} onChange={(next) => updateItem('languages', index, 'name', next)} />
            <TextField label={t(TEXT.level)} value={item.level} onChange={(next) => updateItem('languages', index, 'level', next)} />
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.projects)}
        items={data.projects}
        empty={{ name: '', description: '', url: '' }}
        onChange={(items) => updateArray('projects', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label={t(TEXT.name)} value={item.name} onChange={(next) => updateItem('projects', index, 'name', next)} />
            <TextAreaField label={t(TEXT.description)} value={item.description} onChange={(next) => updateItem('projects', index, 'description', next)} />
            <TextField label={t(TEXT.url)} value={item.url} onChange={(next) => updateItem('projects', index, 'url', next)} />
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.certifications)}
        items={data.certifications}
        empty={{ name: '', issuer: '', year: '' }}
        onChange={(items) => updateArray('certifications', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField label={t(TEXT.name)} value={item.name} onChange={(next) => updateItem('certifications', index, 'name', next)} />
            <TextField label={t(TEXT.issuer)} value={item.issuer} onChange={(next) => updateItem('certifications', index, 'issuer', next)} />
            <TextField label={t(TEXT.year)} value={item.year} onChange={(next) => updateItem('certifications', index, 'year', next)} />
          </div>
        )}
      />

      <ArraySection
        title={t(TEXT.extraInfo)}
        items={data.extra}
        empty={{ title: '', text: '' }}
        onChange={(items) => updateArray('extra', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label={t(TEXT.title)} value={item.title} onChange={(next) => updateItem('extra', index, 'title', next)} />
            <TextAreaField label={t(TEXT.text)} value={item.text} onChange={(next) => updateItem('extra', index, 'text', next)} />
          </div>
        )}
      />
    </div>
  )
}
