import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MeProvider } from '@/contexts/MeContext.jsx'
import Navbar from '@/components/Navbar.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'
import AccountPage from '@/pages/AccountPage.jsx'
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

// Composant racine : fournit le profil courant, active le routage puis affiche la page demandée.
export default function App() {
  return (
    <MeProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-white text-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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
          <SiteFooter />
        </main>
      </BrowserRouter>
    </MeProvider>
  )
}
