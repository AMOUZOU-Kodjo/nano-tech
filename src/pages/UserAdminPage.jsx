import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi'
import { useLocale } from '@/hooks/useLocale.js'
import { useAdmin } from '@/hooks/useAdmin.js'

const TEXT = {
  back: { fr: 'Retour au centre de contrôle', en: 'Back to control room' },
  title: { fr: 'Gestion de l’utilisateur', en: 'User management' },
  intro: { fr: 'Actions administratives documentées par l’API.', en: 'Administrative actions documented by the API.' },
  profile: { fr: 'Profil', en: 'Profile' },
  profileHelp: { fr: 'Champs exposés par la liste administrative.', en: 'Fields exposed by the admin list.' },
  notFound: { fr: 'Utilisateur introuvable dans la liste administrative.', en: 'User not found in the admin list.' },
  adminStatus: { fr: 'Statut administrateur', en: 'Administrator status' },
  administrator: { fr: 'Administrateur', en: 'Administrator' },
  update: { fr: 'Mettre à jour', en: 'Update' },
  credits: { fr: 'Crédits utilisateur', en: 'User credits' },
  delta: { fr: 'Delta', en: 'Delta' },
  deltaPlaceholder: { fr: 'De -100000 à 100000', en: 'From -100000 to 100000' },
  reason: { fr: 'Motif', en: 'Reason' },
  reasonPlaceholder: {
    fr: '1 à 80 caractères (défaut : admin_adjustment)',
    en: '1 to 80 characters (default: admin_adjustment)',
  },
  adjust: { fr: 'Ajuster', en: 'Adjust' },
  plan: { fr: 'Plan utilisateur', en: 'User plan' },
  duration: { fr: 'Durée en jours', en: 'Duration in days' },
  durationPlaceholder: { fr: 'De 1 à 3660 (vide = null)', en: 'From 1 to 3660 (empty = null)' },
  apply: { fr: 'Appliquer', en: 'Apply' },
  loading: { fr: 'Chargement du compte…', en: 'Loading account…' },
  noValue: { fr: '—', en: '—' },
  deniedTitle: { fr: 'Espace réservé aux administrateurs', en: 'Administrators only' },
  deniedFallback: { fr: 'Votre session ne permet pas d’accéder au centre de contrôle.', en: 'Your session cannot access the control room.' },
  actionDenied: { fr: 'L’action administrative a été refusée.', en: 'The administrative action was denied.' },
  adminDone: { fr: 'Statut administrateur mis à jour.', en: 'Administrator status updated.' },
  creditsDone: { fr: 'Crédits mis à jour.', en: 'Credits updated.' },
  planDone: { fr: 'Plan mis à jour.', en: 'Plan updated.' },
  freePlan: { fr: 'Gratuit', en: 'Free' },
  proPlan: { fr: 'Pro', en: 'Pro' },
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
}

const PROFILE_LABELS = {
  id: { fr: 'Identifiant', en: 'ID' },
  user_id: { fr: 'Identifiant', en: 'ID' },
  email: { fr: 'E-mail', en: 'Email' },
  name: { fr: 'Nom', en: 'Name' },
  first_name: { fr: 'Prénom', en: 'First name' },
  last_name: { fr: 'Nom de famille', en: 'Last name' },
  is_admin: { fr: 'Administrateur', en: 'Administrator' },
  role: { fr: 'Rôle', en: 'Role' },
  plan: { fr: 'Plan', en: 'Plan' },
  credits: { fr: 'Crédits', en: 'Credits' },
  quota: { fr: 'Quota', en: 'Quota' },
  created_at: { fr: 'Créé le', en: 'Created at' },
  updated_at: { fr: 'Mis à jour le', en: 'Updated at' },
  terms_accepted: { fr: 'CGU acceptées', en: 'Terms accepted' },
  marketing_opt_in: { fr: 'Offres marketing', en: 'Marketing opt-in' },
  is_verified: { fr: 'Vérifié', en: 'Verified' },
}

const MOBILE_TABS = [
  { id: 'overview', label: { fr: 'Vue d’ensemble', en: 'Overview' } },
  { id: 'users', label: { fr: 'Utilisateurs', en: 'Users' } },
  { id: 'runs', label: { fr: 'Exécutions', en: 'Runs' } },
  { id: 'events', label: { fr: 'Événements', en: 'Events' } },
  { id: 'errors', label: { fr: 'Erreurs', en: 'Errors' } },
  { id: 'anonymous', label: { fr: 'Anonyme', en: 'Anonymous' } },
  { id: 'photo', label: { fr: 'Photo', en: 'Photo' } },
  { id: 'settings', label: { fr: 'Paramètres', en: 'Settings' } },
]

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

function formatCell(value, empty) {
  if (value === null || value === undefined || value === '') return empty
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function profileLabel(key, locale) {
  const label = PROFILE_LABELS[key]
  return label ? (locale === 'en' ? label.en : label.fr) : key.replaceAll('_', ' ')
}

function planLabel(value, t) {
  if (value === 'pro') return t(TEXT.proPlan)
  if (value === 'free') return t(TEXT.freePlan)
  return value
}

function formatProfileValue(value, locale, t, empty) {
  if (value === null || value === undefined || value === '') return empty
  if (typeof value === 'boolean') return value ? t(TEXT.yes) : t(TEXT.no)
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return `${new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(date)} UTC`
    }
  }
  return formatCell(value, empty)
}

function Panel({ title, description, children, badge }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
        {badge}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  )
}

// Les états des formulaires vivent ici : la clé du parent les réinitialise au changement de compte.
function UserActions({ id, user, loading, onAdmin, onCredits, onPlan }) {
  const { t } = useLocale()
  const [adminEnabled, setAdminEnabled] = useState(user.is_admin === true || user.role === 'admin')
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('')
  const [planName, setPlanName] = useState(user.plan === 'pro' ? 'pro' : 'free')
  const [days, setDays] = useState('')

  function handleAdmin(event) {
    event.preventDefault()
    onAdmin(Number(id), adminEnabled)
  }

  function handleCredits(event) {
    event.preventDefault()
    onCredits(Number(id), { delta: Number(delta), reason: reason.trim() || 'admin_adjustment' })
  }

  function handlePlan(event) {
    event.preventDefault()
    onPlan(Number(id), { plan: planName, days: days ? Number(days) : null })
  }

  return (
    <>
      <Panel title={t(TEXT.adminStatus)} badge={<FiUserCheck aria-hidden="true" className="h-5 w-5 text-violet-500" />}>
        <form onSubmit={handleAdmin} className="mt-5 flex flex-wrap items-end gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={adminEnabled}
              onChange={(event) => setAdminEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            {t(TEXT.administrator)}
          </label>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
            <FiUserCheck aria-hidden="true" className="h-4 w-4" />
            {t(TEXT.update)}
          </button>
        </form>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={t(TEXT.credits)} badge={<FiDollarSign aria-hidden="true" className="h-5 w-5 text-emerald-500" />}>
          <form onSubmit={handleCredits} className="mt-5 grid gap-3">
            <Field label={t(TEXT.delta)}>
              <input
                required
                type="number"
                min={-100000}
                max={100000}
                placeholder={t(TEXT.deltaPlaceholder)}
                value={delta}
                onChange={(event) => setDelta(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={t(TEXT.reason)}>
              <input
                maxLength={80}
                placeholder={t(TEXT.reasonPlaceholder)}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className={inputClass}
              />
            </Field>
            <button type="submit" disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50">
              <FiDollarSign aria-hidden="true" className="h-4 w-4" />
              {t(TEXT.adjust)}
            </button>
          </form>
        </Panel>

        <Panel title={t(TEXT.plan)} badge={<FiTrendingUp aria-hidden="true" className="h-5 w-5 text-violet-500" />}>
          <form onSubmit={handlePlan} className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label={t(TEXT.plan)}>
              <select value={planName} onChange={(event) => setPlanName(event.target.value)} className={inputClass}>
                <option value="free">{t(TEXT.freePlan)}</option>
                <option value="pro">{t(TEXT.proPlan)}</option>
              </select>
            </Field>
            <Field label={t(TEXT.duration)}>
              <input
                type="number"
                min="1"
                max="3660"
                placeholder={t(TEXT.durationPlaceholder)}
                value={days}
                onChange={(event) => setDays(event.target.value)}
                className={inputClass}
              />
            </Field>
            <button type="submit" disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 sm:col-span-2">
              <FiTrendingUp aria-hidden="true" className="h-4 w-4" />
              {t(TEXT.apply)}
            </button>
          </form>
        </Panel>
      </div>
    </>
  )
}

export default function UserAdminPage() {
  const { id } = useParams()
  const { t, locale } = useLocale()
  const {
    users,
    loading,
    error,
    updateUserAdmin,
    updateUserCredits,
    updateUserPlan,
    listAdminUsers,
  } = useAdmin()

  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  // La liste est la seule source documentée pour retrouver le compte ciblé.
  useEffect(() => {
    listAdminUsers()
  }, [listAdminUsers])

  const user = users.find((item) => String(item.id ?? item.user_id) === String(id))

  async function runAction(action, successMessage) {
    setFormError(null)
    setFormSuccess(null)

    const payload = await action()
    if (!payload) {
      setFormError(t(TEXT.actionDenied))
      return
    }

    setFormSuccess(successMessage)
    await listAdminUsers()
  }

  // Les actions utilisent les mêmes handlers que les formulaires intégrés.
  const actions = {
    admin: (userId, enabled) => runAction(() => updateUserAdmin(userId, enabled), t(TEXT.adminDone)),
    credits: (userId, payload) => runAction(() => updateUserCredits(userId, payload), t(TEXT.creditsDone)),
    plan: (userId, payload) => runAction(() => updateUserPlan(userId, payload), t(TEXT.planDone)),
  }

  if (error?.status === 401 || error?.status === 403) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-8 shadow-sm">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-100 text-red-600">
            <FiShield aria-hidden="true" className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-red-900">{t(TEXT.deniedTitle)}</h1>
          <p className="mt-3 text-sm leading-relaxed text-red-800">
            {error.message ?? t(TEXT.deniedFallback)}
          </p>
        </div>
      </section>
    )
  }

  const displayName = user
    ? user.name ?? [user.first_name, user.last_name].filter(Boolean).join(' ') ?? user.email ?? `#${id}`
    : `#${id}`
  const details = user
    ? Object.entries(user).filter(([key]) => !['first_name', 'last_name'].includes(key))
    : []

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-sky-700"
      >
        <FiArrowLeft aria-hidden="true" className="h-4 w-4" />
        {t(TEXT.back)}
      </Link>

      <nav aria-label={t(TEXT.title)} className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
        {MOBILE_TABS.map(({ id, label }) => (
          <Link
            key={id}
            to={`/admin?tab=${id}`}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
          >
            {t(label)}
          </Link>
        ))}
      </nav>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-violet-400 to-cyan-500" />
        <div className="flex flex-wrap items-center gap-4 p-5 lg:p-7">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-lg font-bold text-white shadow-sm">
            <FiUsers aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-600">{t(TEXT.title)}</span>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">{displayName}</h1>
            <p className="mt-1 text-sm text-slate-600">{t(TEXT.intro)}</p>
          </div>
        </div>
      </div>

      {loading && !user && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">
          <FiClock aria-hidden="true" className="h-4 w-4" />
          {t(TEXT.loading)}
        </p>
      )}
      {!loading && !user && (
        <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {t(TEXT.notFound)}
        </p>
      )}
      {formError && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}
      {formSuccess && (
        <p role="status" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <FiCheckCircle aria-hidden="true" className="h-4 w-4" />
          {formSuccess}
        </p>
      )}

      {user && (
        <div className="mt-6 grid gap-5">
          <Panel
            title={t(TEXT.profile)}
            description={t(TEXT.profileHelp)}
            badge={<FiUsers aria-hidden="true" className="h-5 w-5 text-sky-500" />}
          >
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{profileLabel(key, locale)}</dt>
                  <dd className="mt-1 truncate text-sm font-medium text-slate-800" title={formatCell(value, '')}>
                    {formatProfileValue(key === 'plan' ? planLabel(value, t) : value, locale, t, t(TEXT.noValue))}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <UserActions
            key={id}
            id={id}
            user={user}
            loading={loading}
            onAdmin={actions.admin}
            onCredits={actions.credits}
            onPlan={actions.plan}
          />
        </div>
      )}
    </section>
  )
}
