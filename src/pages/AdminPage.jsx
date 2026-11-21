import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin.js'

function JsonView({ value }) {
  const text = value === null || value === undefined ? 'Aucune donnée.' : typeof value === 'string' ? value : JSON.stringify(value, null, 2)

  return <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">{text}</pre>
}

function Panel({ title, description, action, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  )
}

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

export default function AdminPage() {
  const {
    dashboard,
    users,
    toolRuns,
    events,
    eventErrors,
    anonymousUsage,
    settings,
    loading,
    error,
    getAdminDashboard,
    listAdminUsers,
    createAnnouncement,
    updateUserAdmin,
    updateUserCredits,
    updateUserPlan,
    listToolRuns,
    listAdminEvents,
    listEventErrors,
    listAnonymousUsage,
    getAdminSettings,
    updateAdminSetting,
  } = useAdmin()

  const [announcement, setAnnouncement] = useState({ title: '', body: '' })
  const [adminChange, setAdminChange] = useState({ userId: '', enabled: true })
  const [credits, setCredits] = useState({ userId: '', delta: '', reason: 'admin_adjustment' })
  const [plan, setPlan] = useState({ userId: '', plan: 'free', days: '' })
  const [setting, setSetting] = useState({ key: '', value: '{}' })
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  useEffect(() => {
    getAdminDashboard()
    listAdminUsers()
    listToolRuns()
    listAdminEvents()
    listEventErrors()
    listAnonymousUsage()
    getAdminSettings()
  }, [
    getAdminDashboard,
    listAdminUsers,
    listToolRuns,
    listAdminEvents,
    listEventErrors,
    listAnonymousUsage,
    getAdminSettings,
  ])

  async function runAction(action, successMessage, afterSuccess) {
    setFormError(null)
    setFormSuccess(null)

    const payload = await action()
    if (!payload) {
      setFormError('L’action administrative a été refusée.')
      return
    }

    setFormSuccess(successMessage)
    await afterSuccess?.()
  }

  async function handleAnnouncement(event) {
    event.preventDefault()
    await runAction(
      () => createAnnouncement({ title: announcement.title.trim(), body: announcement.body.trim() }),
      'Annonce créée.',
    )
  }

  async function handleAdminChange(event) {
    event.preventDefault()
    await runAction(
      () => updateUserAdmin(Number(adminChange.userId), adminChange.enabled),
      'Statut administrateur mis à jour.',
      listAdminUsers,
    )
  }

  async function handleCredits(event) {
    event.preventDefault()
    await runAction(
      () => updateUserCredits(Number(credits.userId), {
        delta: Number(credits.delta),
        reason: credits.reason.trim(),
      }),
      'Crédits mis à jour.',
      listAdminUsers,
    )
  }

  async function handlePlan(event) {
    event.preventDefault()
    await runAction(
      () => updateUserPlan(Number(plan.userId), {
        plan: plan.plan,
        days: plan.days ? Number(plan.days) : null,
      }),
      'Plan mis à jour.',
      listAdminUsers,
    )
  }

  async function handleSetting(event) {
    event.preventDefault()
    let value

    try {
      value = JSON.parse(setting.value)
    } catch {
      setFormError('La valeur du paramètre doit être un JSON valide.')
      setFormSuccess(null)
      return
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      setFormError('La valeur du paramètre doit être un objet JSON.')
      setFormSuccess(null)
      return
    }

    await runAction(
      () => updateAdminSetting(setting.key.trim(), value),
      'Paramètre mis à jour.',
      getAdminSettings,
    )
  }

  const refreshActions = [
    ['Actualiser', getAdminDashboard],
    ['Utilisateurs', listAdminUsers],
    ['Exécutions', listToolRuns],
    ['Événements', listAdminEvents],
    ['Erreurs', listEventErrors],
    ['Anonyme', listAnonymousUsage],
    ['Paramètres', getAdminSettings],
  ]

  if (error?.status === 401 || error?.status === 403) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Accès refusé</p>
          <h1 className="mt-2 text-2xl font-bold text-red-900">Espace réservé aux administrateurs</h1>
          <p className="mt-3 text-sm leading-relaxed text-red-800">
            {error.message ?? 'Votre session ne permet pas d’accéder au control-room.'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Control-room</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Administration NanoFile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Ces outils utilisent les routes administratives documentées. Ils ne sont accessibles qu’avec une session autorisée.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {refreshActions.map(([label, action]) => (
            <button
              key={label}
              type="button"
              onClick={action}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-600">Chargement des données administratives…</p>}
      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}
      {formError && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}
      {formSuccess && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {formSuccess}
        </p>
      )}

      <div className="mt-8 grid gap-6">
        <Panel title="Vue d’ensemble" description="Indicateurs généraux renvoyés par le control-room.">
          <JsonView value={dashboard} />
        </Panel>

        <Panel title="Utilisateurs" description="Liste des comptes exposée par l’API administrative.">
          <JsonView value={users} />
        </Panel>

        <Panel title="Créer une annonce" description="Les champs title et body sont documentés par l’OpenAPI.">
          <form onSubmit={handleAnnouncement} className="mt-5 grid gap-3">
            <Field label="Titre">
              <input required maxLength={160} value={announcement.title} onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Message">
              <textarea required rows={4} maxLength={10000} value={announcement.body} onChange={(event) => setAnnouncement({ ...announcement, body: event.target.value })} className={inputClass} />
            </Field>
            <button type="submit" disabled={loading} className="justify-self-start rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50">
              Envoyer l’annonce
            </button>
          </form>
        </Panel>

        <Panel title="Statut administrateur" description="Le paramètre enabled est envoyé en query comme l’exige l’OpenAPI.">
          <form onSubmit={handleAdminChange} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <Field label="Identifiant utilisateur">
              <input required type="number" min="1" value={adminChange.userId} onChange={(event) => setAdminChange({ ...adminChange, userId: event.target.value })} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={adminChange.enabled} onChange={(event) => setAdminChange({ ...adminChange, enabled: event.target.checked })} className="h-4 w-4" />
              Administrateur
            </label>
            <button type="submit" disabled={loading} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50">
              Mettre à jour
            </button>
          </form>
        </Panel>

        <Panel title="Crédits utilisateur" description="Ajuste le solde avec delta et reason.">
          <form onSubmit={handleCredits} className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Identifiant utilisateur">
              <input required type="number" min="1" value={credits.userId} onChange={(event) => setCredits({ ...credits, userId: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Delta">
              <input required type="number" value={credits.delta} onChange={(event) => setCredits({ ...credits, delta: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Motif">
              <input required maxLength={80} value={credits.reason} onChange={(event) => setCredits({ ...credits, reason: event.target.value })} className={inputClass} />
            </Field>
            <button type="submit" disabled={loading} className="justify-self-start rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50 sm:self-end">
              Ajuster
            </button>
          </form>
        </Panel>

        <Panel title="Plan utilisateur" description="Applique un plan free ou pro avec une durée optionnelle.">
          <form onSubmit={handlePlan} className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Identifiant utilisateur">
              <input required type="number" min="1" value={plan.userId} onChange={(event) => setPlan({ ...plan, userId: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Plan">
              <select value={plan.plan} onChange={(event) => setPlan({ ...plan, plan: event.target.value })} className={inputClass}>
                <option value="free">free</option>
                <option value="pro">pro</option>
              </select>
            </Field>
            <Field label="Durée en jours">
              <input type="number" min="1" max="3660" value={plan.days} onChange={(event) => setPlan({ ...plan, days: event.target.value })} className={inputClass} />
            </Field>
            <button type="submit" disabled={loading} className="justify-self-start rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50 sm:self-end">
              Appliquer
            </button>
          </form>
        </Panel>

        <Panel title="Exécutions d’outils" description="Historique administrative des traitements.">
          <JsonView value={toolRuns} />
        </Panel>

        <Panel title="Événements" description="Événements reçus par l’API.">
          <JsonView value={events} />
        </Panel>

        <Panel title="Erreurs d’événements" description="Événements rejetés ou en erreur.">
          <JsonView value={eventErrors} />
        </Panel>

        <Panel title="Utilisation anonyme" description="Statistiques agrégées des visiteurs.">
          <JsonView value={anonymousUsage} />
        </Panel>

        <Panel title="Paramètres" description="Clés documentées : tools_enabled, limits, compression.">
          <JsonView value={settings} />
          <form onSubmit={handleSetting} className="mt-5 grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
            <Field label="Clé">
              <input required list="admin-setting-keys" value={setting.key} onChange={(event) => setSetting({ ...setting, key: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Valeur JSON">
              <textarea required rows={4} value={setting.value} onChange={(event) => setSetting({ ...setting, value: event.target.value })} className={inputClass} />
            </Field>
            <datalist id="admin-setting-keys">
              <option value="tools_enabled" />
              <option value="limits" />
              <option value="compression" />
            </datalist>
            <button type="submit" disabled={loading} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50">
              Enregistrer
            </button>
          </form>
        </Panel>
      </div>
    </section>
  )
}
