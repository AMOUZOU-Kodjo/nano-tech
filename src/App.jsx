import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { FiMonitor } from 'react-icons/fi'
import { LocaleProvider } from '@/contexts/LocaleContext.jsx'
import { MeProvider } from '@/contexts/MeContext.jsx'
import AdminSidebar from '@/components/AdminSidebar.jsx'
import Navbar from '@/components/Navbar.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import { TOOLS } from '@/config/tools.js'
import { useLocale } from '@/hooks/useLocale.js'
import { MESSAGES } from '@/i18n/messages.js'
import AccountPage from '@/pages/AccountPage.jsx'
import AdminPage from '@/pages/AdminPage.jsx'
import BillingPage from '@/pages/BillingPage.jsx'
import BillingReturnPage from '@/pages/BillingReturnPage.jsx'
import CataloguePage from '@/pages/CataloguePage.jsx'
import DashboardPage from '@/pages/DashboardPage.jsx'
import DocumentSharePage from '@/pages/DocumentSharePage.jsx'
import DocumentsPage from '@/pages/DocumentsPage.jsx'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx'
import HomePage from '@/pages/HomePage.jsx'
import JobsPage from '@/pages/JobsPage.jsx'
import LegalPage from '@/pages/LegalPage.jsx'
import LoginPage from '@/pages/LoginPage.jsx'
import ProfilePage from '@/pages/ProfilePage.jsx'
import RegisterPage from '@/pages/RegisterPage.jsx'
import ResetPasswordPage from '@/pages/ResetPasswordPage.jsx'
import StudioPage from '@/pages/StudioPage.jsx'
import ToolPage from '@/pages/ToolPage.jsx'
import UserAdminPage from '@/pages/UserAdminPage.jsx'
import VerifyEmailPage from '@/pages/VerifyEmailPage.jsx'

const AUTH_ROUTES = new Set(['/login', '/register'])

const MOBILE_DENIED = {
  label: { fr: 'Espace réservé', en: 'Restricted area' },
  title: { fr: 'Administration indisponible sur mobile', en: 'Admin unavailable on mobile' },
  description: {
    fr: 'Ouvrez le centre de contrôle sur un écran d’ordinateur de 1024 px ou plus.',
    en: 'Open the control room on a desktop screen of 1024px or wider.',
  },
}

const SITE_URL = 'https://nanofile.tech'

const SEO_PAGES = {
  '/': {
    fr: {
      title: 'NanoFile — Traitement de fichiers en ligne',
      description: 'Compressez, convertissez et réorganisez vos fichiers PDF, images et documents en ligne avec NanoFile.',
    },
    en: {
      title: 'NanoFile — Online file processing',
      description: 'Compress, convert and reorganize your PDF, image and document files online with NanoFile.',
    },
  },
  '/catalogue': {
    fr: {
      title: 'Catalogue des outils — NanoFile',
      description: 'Découvrez tous les outils NanoFile pour traiter vos fichiers PDF, images et documents.',
    },
    en: {
      title: 'Tool catalog — NanoFile',
      description: 'Explore all NanoFile tools to process your PDF, image and document files.',
    },
  },
  '/terms': {
    fr: { title: 'Conditions générales — NanoFile', description: 'Conditions générales d’utilisation de NanoFile.' },
    en: { title: 'Terms of service — NanoFile', description: 'NanoFile terms of service.' },
  },
  '/privacy': {
    fr: { title: 'Confidentialité — NanoFile', description: 'Politique de confidentialité de NanoFile.' },
    en: { title: 'Privacy — NanoFile', description: 'NanoFile privacy policy.' },
  },
  '/cookies': {
    fr: { title: 'Cookies — NanoFile', description: 'Politique de gestion des cookies de NanoFile.' },
    en: { title: 'Cookies — NanoFile', description: 'NanoFile cookie policy.' },
  },
  '/legal': {
    fr: { title: 'Mentions légales — NanoFile', description: 'Mentions légales de NanoFile.' },
    en: { title: 'Legal notice — NanoFile', description: 'NanoFile legal notice.' },
  },
}

const SEO_FALLBACK = {
  fr: {
    title: 'NanoFile — Traitement de fichiers en ligne',
    description: 'Compressez, convertissez et réorganisez vos fichiers PDF, images et documents en ligne avec NanoFile.',
  },
  en: {
    title: 'NanoFile — Online file processing',
    description: 'Compress, convert and reorganize your PDF, image and document files online with NanoFile.',
  },
}

function getSeoMetadata(pathname, locale) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const toolSlug = path.startsWith('/tools/') ? path.slice('/tools/'.length) : ''
  const tool = TOOLS.find((item) => item.tool === toolSlug)

  if (tool) {
    return {
      indexable: true,
      title: `${locale === 'en' ? tool.nameEn : tool.name} — NanoFile`,
      description: locale === 'en' ? tool.descriptionEn : tool.description,
    }
  }

  const page = SEO_PAGES[path]
  if (page) {
    return { indexable: true, ...page[locale] }
  }

  return { indexable: false, ...SEO_FALLBACK[locale] }
}

// Détecte un écran assez large pour afficher la sidebar administrative.
function useDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isDesktop
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale, t } = useLocale()
  const isDesktop = useDesktopViewport()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const hideFooter = AUTH_ROUTES.has(location.pathname) || isAdminRoute

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/'
    const seo = getSeoMetadata(location.pathname, locale)
    const canonicalUrl = `${SITE_URL}${path}`
    const setAttribute = (selector, attribute, value) => {
      const element = document.querySelector(selector)
      if (element) {
        element.setAttribute(attribute, value)
      }
    }

    document.title = seo.title
    document.documentElement.lang = locale
    setAttribute('meta[name="description"]', 'content', seo.description)
    setAttribute('meta[name="robots"]', 'content', seo.indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow')
    setAttribute('link[rel="canonical"]', 'href', canonicalUrl)
    setAttribute('meta[property="og:url"]', 'content', canonicalUrl)
    setAttribute('meta[property="og:title"]', 'content', seo.title)
    setAttribute('meta[property="og:description"]', 'content', seo.description)
    setAttribute('meta[property="og:locale"]', 'content', locale === 'en' ? 'en_US' : 'fr_FR')
  }, [location.pathname, locale])

  // Remet la vue en haut à chaque navigation, y compris sur un même chemin.
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.key, location.hash])

  if (isAdminRoute && !isDesktop) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
            <FiMonitor aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-600">{t(MOBILE_DENIED.label)}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{t(MOBILE_DENIED.title)}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(MOBILE_DENIED.description)}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {t(MESSAGES.common.home)}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && (
        <AdminSidebar
          activeTab={new URLSearchParams(location.search).get('tab')}
          onSelect={(id) => navigate(`/admin?tab=${id}`)}
        />
      )}
      <main
        key={location.pathname}
        className={`min-h-screen bg-white text-slate-900 animate-page-in ${isAdminRoute ? 'lg:pl-64' : ''}`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tools/:tool" element={<ToolPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users/:id" element={<UserAdminPage />} />
          <Route path="/auth/verify" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/success" element={<BillingReturnPage success />} />
          <Route path="/billing/cancel" element={<BillingReturnPage success={false} />} />
          <Route path="/d/:token" element={<DocumentSharePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/cookies" element={<LegalPage kind="cookies" />} />
          <Route path="/legal" element={<LegalPage kind="legal" />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        {!hideFooter && <SiteFooter />}
      </main>
    </>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <MeProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </MeProvider>
    </LocaleProvider>
  )
}
