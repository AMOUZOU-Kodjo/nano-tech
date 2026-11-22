import { Link } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'

const TEXT = {
  successTitle: { fr: 'Paiement terminé', en: 'Payment complete' },
  cancelledTitle: { fr: 'Paiement annulé', en: 'Payment cancelled' },
  successMessage: {
    fr: 'Le paiement a été confirmé. Le plan sera mis à jour après le webhook Stripe.',
    en: 'The payment was confirmed. The plan will be updated after the Stripe webhook.',
  },
  cancelledMessage: {
    fr: 'Aucun paiement n’a été effectué. Vous pouvez reprendre depuis la facturation.',
    en: 'No payment was made. You can continue from the billing page.',
  },
  seeBilling: { fr: 'Voir la facturation', en: 'View billing' },
}

// Page de retour Stripe : affiche uniquement le résultat du parcours, sans action inventée.
export default function BillingReturnPage({ success }) {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {t(success ? TEXT.successTitle : TEXT.cancelledTitle)}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {t(success ? TEXT.successMessage : TEXT.cancelledMessage)}
        </p>
        <Link
          to="/billing"
          className="mt-6 inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          {t(TEXT.seeBilling)}
        </Link>
      </div>
    </section>
  )
}
