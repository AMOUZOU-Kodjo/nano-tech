import { Link } from 'react-router-dom'

// Page de retour Stripe : affiche uniquement le résultat du parcours, sans action inventée.
export default function BillingReturnPage({ success }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {success ? 'Paiement terminé' : 'Paiement annulé'}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {success
            ? 'Le paiement a été confirmé. Le plan sera mis à jour après le webhook Stripe.'
            : 'Aucun paiement n’a été effectué. Vous pouvez reprendre depuis la facturation.'}
        </p>
        <Link
          to="/billing"
          className="mt-6 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          Voir la facturation
        </Link>
      </div>
    </section>
  )
}
