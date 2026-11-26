import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChangePasswordForm from '@/components/ChangePasswordForm.jsx'
import LogoutButton from '@/components/LogoutButton.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useMeContext } from '@/hooks/useMeContext.js'
import { usePatchMe } from '@/hooks/usePatchMe.js'

const TEXT = {
  eyebrow: { fr: 'Votre compte', en: 'Your account' },
  title: { fr: 'Mon profil', en: 'My profile' },
  intro: {
    fr: 'Modifiez vos informations personnelles et gérez la sécurité de votre compte.',
    en: 'Update your personal information and manage your account security.',
  },
  accountLink: { fr: 'Voir mon compte →', en: 'View my account →' },
  personalInfo: { fr: 'Vos informations', en: 'Your details' },
  editableFields: {
    fr: 'Modifiez les informations associées à votre compte.',
    en: 'Update the information linked to your account.',
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
  saveProfile: { fr: 'Enregistrer mes informations', en: 'Save my details' },
  updated: { fr: 'Vos informations ont été mises à jour.', en: 'Your details have been updated.' },
  confirmEmail: {
    fr: ' Confirmez votre nouvelle adresse par email.',
    en: ' Please confirm your new email address.',
  },
  saveError: {
    fr: 'Une erreur est survenue. Réessayez dans quelques instants.',
    en: 'Something went wrong. Please try again shortly.',
  },
  loading: { fr: 'Chargement du profil…', en: 'Loading profile…' },
  loadError: { fr: 'Impossible d’afficher votre profil.', en: 'Unable to display your profile.' },
  retry: { fr: 'Réessayer', en: 'Try again' },
  signInToEdit: { fr: 'Connectez-vous pour modifier votre profil.', en: 'Sign in to edit your profile.' },
  signIn: { fr: 'Se connecter', en: 'Sign in' },
}

const CARD_CLASS = 'rounded-3xl bg-surface-muted/40 p-6 ring-1 ring-line/50 sm:p-8'
const FIELD_CLASS =
  'mt-2 w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line/60 transition focus:outline-none focus:ring-2 focus:ring-brand/40'
const LABEL_CLASS = 'block text-sm font-medium text-ink-muted'
const BUTTON_CLASS =
  'rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft disabled:opacity-50'

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
    <section className={CARD_CLASS}>
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{t(TEXT.personalInfo)}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.editableFields)}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="profile-email" className={LABEL_CLASS}>{t(TEXT.email)}</label>
          <input
            id="profile-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className={FIELD_CLASS}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-first-name" className={LABEL_CLASS}>{t(TEXT.firstName)}</label>
            <input
              id="profile-first-name"
              type="text"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(event) => setForm({ ...form, first_name: event.target.value })}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="profile-last-name" className={LABEL_CLASS}>{t(TEXT.lastName)}</label>
            <input
              id="profile-last-name"
              type="text"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(event) => setForm({ ...form, last_name: event.target.value })}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-profession" className={LABEL_CLASS}>{t(TEXT.profession)}</label>
            <input
              id="profile-profession"
              type="text"
              value={form.profession}
              onChange={(event) => setForm({ ...form, profession: event.target.value })}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="profile-display-name" className={LABEL_CLASS}>{t(TEXT.displayName)}</label>
            <input
              id="profile-display-name"
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-line/60 pt-5">
          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={form.terms_accepted}
              onChange={(event) => setForm({ ...form, terms_accepted: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-line bg-surface text-brand focus:ring-brand/40"
            />
            <span>{t(TEXT.acceptTerms)}</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={form.marketing_opt_in}
              onChange={(event) => setForm({ ...form, marketing_opt_in: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-line bg-surface text-brand focus:ring-brand/40"
            />
            <span>{t(TEXT.receiveNews)}</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={patch.loading} className={BUTTON_CLASS}>
            {t(patch.loading ? TEXT.saving : TEXT.saveProfile)}
          </button>
        </div>
      </form>

      {patch.error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {t(TEXT.saveError)}
        </p>
      )}

      {patch.success && (
        <p role="status" className="mt-5 rounded-xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {t(TEXT.updated)}
          {patch.data?.email_verification_required ? t(TEXT.confirmEmail) : ''}
        </p>
      )}
    </section>
  )
}

// Page profil : données personnelles, mot de passe et déconnexion.
export default function ProfilePage() {
  const { t } = useLocale()
  const { user, loading, error, reload, isGuest } = useMeContext()

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{t(TEXT.eyebrow)}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t(TEXT.title)}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{t(TEXT.intro)}</p>
        </div>
        <Link
          to="/account"
          className="self-start rounded-xl bg-surface-muted/60 px-5 py-3 text-sm font-semibold text-ink ring-1 ring-line/50 transition hover:text-brand"
        >
          {t(TEXT.accountLink)}
        </Link>
      </div>

      {loading && (
        <div className={`${CARD_CLASS} mt-10`} role="status">
          <p className="text-sm text-ink-muted">{t(TEXT.loading)}</p>
        </div>
      )}

      {!loading && error && (
        <div className={`${CARD_CLASS} mt-10`} role="alert">
          <h2 className="text-lg font-semibold text-ink">{t(TEXT.loadError)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(TEXT.retry)}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-soft"
          >
            {t(TEXT.retry)}
          </button>
        </div>
      )}

      {!loading && !error && (isGuest || !user) && (
        <div className={`${CARD_CLASS} mt-10`}>
          <h2 className="text-lg font-semibold text-ink">{t(TEXT.signInToEdit)}</h2>
          <Link to="/login" className={`${BUTTON_CLASS} mt-5 inline-flex`}>
            {t(TEXT.signIn)}
          </Link>
        </div>
      )}

      {!loading && !error && !isGuest && user && (
        <div className="mt-10 space-y-6">
          <ProfileForm key={user.id ?? user.email ?? 'profile'} user={user} onSuccess={reload} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ChangePasswordForm />
            <LogoutButton onSuccess={reload} />
          </div>
        </div>
      )}
    </section>
  )
}
