import { useLogout } from '@/hooks/useLogout.js'

// Bouton de déconnexion : délègue le rafraîchissement du profil à la prop onSuccess.
export default function LogoutButton({ onSuccess }) {
  const { loading, error, logout } = useLogout({ onSuccess })

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? 'Déconnexion…' : 'Se déconnecter'}
      </button>

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
