import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../features/home/pages/HomePage'
import { JobDetailPage } from '../features/jobs/pages/JobDetailPage'
import { JobSearchPage } from '../features/jobs/pages/JobSearchPage'
import { CompaniesPage } from '../features/companies/pages/CompaniesPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { CandidateProfilePage } from '../features/candidate-profile/pages/CandidateProfilePage'
import { AuthGuard } from './router/guards/AuthGuard'
import { MainLayout } from './layouts/MainLayout'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <CandidateProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/ho-so"
          element={
            <AuthGuard>
              <CandidateProfilePage />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
