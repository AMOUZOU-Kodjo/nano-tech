import { Link } from 'react-router-dom'
import HealthStatus from '@/components/HealthStatus.jsx'
import MeStatus from '@/components/MeStatus.jsx'

// Page dédiée au statut du service et au compte courant.
export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold text-sky-700">Espace utilisateur</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">État du service et du compte</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
        Consultez la disponibilité de l’API, les capacités détectées et votre quota courant.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <HealthStatus />
        <MeStatus />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/account" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          Gérer mon compte →
        </Link>
        <Link to="/jobs" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          Voir mes jobs →
        </Link>
      </div>
    </section>
  )
}
