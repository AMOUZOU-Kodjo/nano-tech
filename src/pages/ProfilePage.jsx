import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChangePasswordForm from '@/components/ChangePasswordForm.jsx'
import LogoutButton from '@/components/LogoutButton.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { usePatchMe } from '@/hooks/usePatchMe.js'

const TEXT = {
  personalInfo: { fr: 'Informations personnelles', en: 'Personal information' },
  editableFields: {
    fr: 'Seuls les champs acceptés par l’API sont modifiables.',
    en: 'Only fields accepted by the API can be changed.',
  },
  email: { fr: 'Email', en: 'Email' },
  firstName: { fr: 'Prénom', en: 'First name' },
  lastName: { fr: 'Nom', en: 'Last name' },
  profession: { fr: 'Profession', en: 'Profession' },
  displayName: { fr: 'Nom affiché', en: 'Display name' },
  acceptTerms: { fr: 'J’accepte les conditions d’utilisation.', en: 'I accept the terms of use.' },
  receiveNews: {
    fr: 'Je souhaite recevoir les actualités par email.',
    en: 'I would like to receive news by email.',
  },
  saving: { fr: 'Enregistrement…', en: 'Saving…' },
  saveProfile: { fr: 'Enregistrer le profil', en: 'Save the profile' },
  updated: { fr: 'Profil mis à jour.', en: 'Profile updated.' },
  confirmEmail: {
    fr: ' Confirmez votre nouvelle adresse par email.',
    en: ' Confirm your new email address.',
  },
  title: { fr: 'Mon profil', en: 'My profile' },
  loading: { fr: 'Chargement du profil…', en: 'Loading profile…' },
  loadError: { fr: 'Impossible de charger le profil.', en: 'Unable to load the profile.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  signInToEdit: { fr: 'Connectez-vous pour modifier votre profil.', en: 'Sign in to edit your profile.' },
  signIn: { fr: 'Se connecter', en: 'Sign in' },
}

// Formulaire interne remonté quand le profil change, sans effet de synchronisation d'état.
function ProfileForm({ user, onSuccess }) {
  const { t } = useLocale()
  const [form, setForm] = useState({
    email: user.email ?? '',
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    profession: user.profession ?? '',
    name: user.name ?? '',
    terms_accepted: Boolean(user.terms_accepted_at ?? user.terms_accepted),
    marketing_opt_in: Boolean(user.marketing_opt_in),
  })
  const patch = usePatchMe({ onSuccess })

  function handleSubmit(event) {
    event.preventDefault()

    patch.patchMe({
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      profession: form.profession,
      name: form.name,
      terms_accepted: form.terms_accepted,
      marketing_opt_in: form.marketing_opt_in,
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-900">{t(TEXT.personalInfo)}</h2>
      <p className="mt-2 text-sm text-slate-600">{t(TEXT.editableFields)}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700">
            {t(TEXT.email)}
          </label>
          <input
            id="profile-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-first-name" className="block text-sm font-medium text-slate-700">
              {t(TEXT.firstName)}
            </label>
            <input
              id="profile-first-name"
              type="text"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(event) => setForm({ ...form, first_name: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="profile-last-name" className="block text-sm font-medium text-slate-700">
              {t(TEXT.lastName)}
            </label>
            <input
              id="profile-last-name"
              type="text"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(event) => setForm({ ...form, last_name: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-profession" className="block text-sm font-medium text-slate-700">
              {t(TEXT.profession)}
            </label>
            <input
              id="profile-profession"
              type="text"
              value={form.profession}
              onChange={(event) => setForm({ ...form, profession: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>

          <div>
            <label htmlFor="profile-display-name" className="block text-sm font-medium text-slate-700">
              {t(TEXT.displayName)}
            </label>
            <input
              id="profile-display-name"
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.terms_accepted}
            onChange={(event) => setForm({ ...form, terms_accepted: event.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-300 bg-white"
          />
          <span>{t(TEXT.acceptTerms)}</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.marketing_opt_in}
            onChange={(event) => setForm({ ...form, marketing_opt_in: event.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-300 bg-white"
          />
          <span>{t(TEXT.receiveNews)}</span>
        </label>

        <button
          type="submit"
          disabled={patch.loading}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
        >
          {t(patch.loading ? TEXT.saving : TEXT.saveProfile)}
        </button>
      </form>

      {patch.error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {patch.error.message}
        </p>
      )}

      {patch.success && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {t(TEXT.updated)}
          {patch.data?.email_verification_required ? t(TEXT.confirmEmail) : ''}
        </p>
      )}
    </div>
  )
}

// Page profil : données personnelles, mot de passe et déconnexion.
export default function ProfilePage() {
  const { t } = useLocale()
  const { user, loading, error, reload, isGuest } = useMeContext()

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{t(TEXT.title)}</h1>

      {loading && <p className="mt-6 text-sm text-slate-600">{t(TEXT.loading)}</p>}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <p role="alert" className="text-sm text-red-700">
            {t(TEXT.loadError)} {error.message}
          </p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-300"
          >
            {t(TEXT.retry)}
          </button>
        </div>
      )}

      {!loading && !error && (isGuest || !user) && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">{t(TEXT.signInToEdit)}</p>
          <Link to="/login" className="mt-4 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
            {t(TEXT.signIn)}
          </Link>
        </div>
      )}

      {!loading && !error && !isGuest && user && (
        <>
          <div className="mt-6">
            <ProfileForm key={user.id ?? user.email ?? 'profile'} user={user} onSuccess={reload} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ChangePasswordForm />
            <LogoutButton onSuccess={reload} />
          </div>
        </>
      )}
    </section>
  )
}
