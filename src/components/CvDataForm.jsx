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
  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900">
        {title}
        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{items.length}</span>
      </summary>
      <div className="space-y-4 border-t border-slate-200 p-4">
        {items.length === 0 && <p className="text-xs text-slate-500">Aucune entrée.</p>}
        {items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {renderItem(item, index)}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Retirer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, empty])}
          className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600"
        >
          Ajouter une entrée
        </button>
      </div>
    </details>
  )
}

export default function CvDataForm({ value, onChange }) {
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
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900">Identité</summary>
        <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-2">
          <TextField label="Nom complet" value={data.basics.full_name} onChange={(next) => updateBasics('full_name', next)} maxLength={160} />
          <TextField label="Titre" value={data.basics.headline} onChange={(next) => updateBasics('headline', next)} />
          <TextField label="Email" type="email" value={data.basics.email} onChange={(next) => updateBasics('email', next)} />
          <TextField label="Téléphone" value={data.basics.phone} onChange={(next) => updateBasics('phone', next)} />
          <TextField label="Localisation" value={data.basics.location} onChange={(next) => updateBasics('location', next)} />
          <TextField
            label="Photo"
            value={data.basics.photo_data_url ?? ''}
            onChange={(next) => updateBasics('photo_data_url', next || null)}
            placeholder="Données image ou URL"
          />
          <div className="sm:col-span-2">
            <ArraySection
              title="Liens"
              items={data.basics.links}
              empty={{ label: '', url: '' }}
              onChange={(links) => updateBasics('links', links)}
              renderItem={(link, index) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Libellé" value={link.label} onChange={(next) => updateLink(index, 'label', next)} />
                  <TextField label="URL" value={link.url} onChange={(next) => updateLink(index, 'url', next)} />
                </div>
              )}
            />
          </div>
        </div>
      </details>

      <TextAreaField label="Résumé" value={data.summary} onChange={(next) => commit({ ...data, summary: next })} />

      <ArraySection
        title="Expériences"
        items={data.experience}
        empty={{ role: '', org: '', location: '', start: '', end: '', current: false, context: '', bullets: [] }}
        onChange={(items) => updateArray('experience', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Poste" value={item.role} onChange={(next) => updateItem('experience', index, 'role', next)} />
            <TextField label="Entreprise" value={item.org} onChange={(next) => updateItem('experience', index, 'org', next)} />
            <TextField label="Lieu" value={item.location} onChange={(next) => updateItem('experience', index, 'location', next)} />
            <TextField label="Début" value={item.start} onChange={(next) => updateItem('experience', index, 'start', next)} />
            <TextField label="Fin" value={item.end} onChange={(next) => updateItem('experience', index, 'end', next)} />
            <CheckboxField label="En cours" value={item.current} onChange={(next) => updateItem('experience', index, 'current', next)} />
            <div className="sm:col-span-2">
              <TextAreaField label="Contexte" value={item.context} onChange={(next) => updateItem('experience', index, 'context', next)} />
            </div>
            <div className="sm:col-span-2">
              <StringListField
                label="Puces, une par ligne"
                value={item.bullets}
                onChange={(next) => updateItem('experience', index, 'bullets', next)}
              />
            </div>
          </div>
        )}
      />

      <ArraySection
        title="Formations"
        items={data.education}
        empty={{ degree: '', school: '', location: '', start: '', end: '', details: '' }}
        onChange={(items) => updateArray('education', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Diplôme" value={item.degree} onChange={(next) => updateItem('education', index, 'degree', next)} />
            <TextField label="Établissement" value={item.school} onChange={(next) => updateItem('education', index, 'school', next)} />
            <TextField label="Lieu" value={item.location} onChange={(next) => updateItem('education', index, 'location', next)} />
            <TextField label="Début" value={item.start} onChange={(next) => updateItem('education', index, 'start', next)} />
            <TextField label="Fin" value={item.end} onChange={(next) => updateItem('education', index, 'end', next)} />
            <div className="sm:col-span-2">
              <TextAreaField label="Détails" value={item.details} onChange={(next) => updateItem('education', index, 'details', next)} />
            </div>
          </div>
        )}
      />

      <ArraySection
        title="Compétences"
        items={data.skills}
        empty={{ group: '', items: [] }}
        onChange={(items) => updateArray('skills', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label="Groupe" value={item.group} onChange={(next) => updateItem('skills', index, 'group', next)} />
            <StringListField
              label="Compétences, une par ligne"
              value={item.items}
              onChange={(next) => updateItem('skills', index, 'items', next)}
            />
          </div>
        )}
      />

      <ArraySection
        title="Langues"
        items={data.languages}
        empty={{ name: '', level: '' }}
        onChange={(items) => updateArray('languages', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Langue" value={item.name} onChange={(next) => updateItem('languages', index, 'name', next)} />
            <TextField label="Niveau" value={item.level} onChange={(next) => updateItem('languages', index, 'level', next)} />
          </div>
        )}
      />

      <ArraySection
        title="Projets"
        items={data.projects}
        empty={{ name: '', description: '', url: '' }}
        onChange={(items) => updateArray('projects', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label="Nom" value={item.name} onChange={(next) => updateItem('projects', index, 'name', next)} />
            <TextAreaField label="Description" value={item.description} onChange={(next) => updateItem('projects', index, 'description', next)} />
            <TextField label="URL" value={item.url} onChange={(next) => updateItem('projects', index, 'url', next)} />
          </div>
        )}
      />

      <ArraySection
        title="Certifications"
        items={data.certifications}
        empty={{ name: '', issuer: '', year: '' }}
        onChange={(items) => updateArray('certifications', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField label="Nom" value={item.name} onChange={(next) => updateItem('certifications', index, 'name', next)} />
            <TextField label="Organisme" value={item.issuer} onChange={(next) => updateItem('certifications', index, 'issuer', next)} />
            <TextField label="Année" value={item.year} onChange={(next) => updateItem('certifications', index, 'year', next)} />
          </div>
        )}
      />

      <ArraySection
        title="Informations complémentaires"
        items={data.extra}
        empty={{ title: '', text: '' }}
        onChange={(items) => updateArray('extra', items)}
        renderItem={(item, index) => (
          <div className="grid gap-3">
            <TextField label="Titre" value={item.title} onChange={(next) => updateItem('extra', index, 'title', next)} />
            <TextAreaField label="Texte" value={item.text} onChange={(next) => updateItem('extra', index, 'text', next)} />
          </div>
        )}
      />
    </div>
  )
}
