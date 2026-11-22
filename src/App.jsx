import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MeProvider } from '@/contexts/MeContext.jsx'
import Navbar from '@/components/Navbar.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
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
import VerifyEmailPage from '@/pages/VerifyEmailPage.jsx'

const AUTH_ROUTES = new Set(['/login', '/register'])

function AppLayout() {
  const location = useLocation()
  const hideFooter = AUTH_ROUTES.has(location.pathname)

  // Remet la vue en haut à chaque navigation, y compris sur un même chemin.
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.key, location.hash])

  return (
    <>
      <Navbar />
      <main key={location.pathname} className="min-h-screen bg-white text-slate-900 animate-page-in">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tools/:tool" element={<ToolPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
    <MeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </MeProvider>
  )
}
