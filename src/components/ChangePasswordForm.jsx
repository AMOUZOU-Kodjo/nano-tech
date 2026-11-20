import { useState } from 'react'
import { useChangePassword } from '@/hooks/useChangePassword.js'

// Formulaire de changement de mot de passe : envoie uniquement les trois champs validés.
export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const { data, loading, error, changePassword } = useChangePassword()

  // Met à jour le champ concerné sans toucher aux deux autres.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  // Soumet le formulaire et vide les champs uniquement si l'API a répondu positivement.
  async function handleSubmit(event) {
    event.preventDefault()
    const result = await changePassword(form)

    if (result !== null) {
      setForm({ current_password: '', password: '', password_confirmation: '' })
    }
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-slate-100">Modifier le mot de passe</h2>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Mot de passe actuel
          <input
            type="password"
            name="current_password"
            autoComplete="current-password"
            value={form.current_password}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Nouveau mot de passe
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Confirmer le nouveau mot de passe
          <input
            type="password"
            name="password_confirmation"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? 'Envoi…' : 'Modifier le mot de passe'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error.message}
        </p>
      )}

      {data !== null && !error && !loading && (
        <p className="mt-4 text-sm text-emerald-300" role="status">
          Mot de passe modifié.
        </p>
      )}
    </section>
  )
}
