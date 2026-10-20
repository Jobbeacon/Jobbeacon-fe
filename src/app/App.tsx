import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import HomePage from '../features/home/pages/HomePage'
import { JobDetailPage } from '../features/jobs/pages/JobDetailPage'
import { JobSearchPage } from '../features/jobs/pages/JobSearchPage'
import { CompaniesPage } from '../features/companies/pages/CompaniesPage'
import { CompanyDetailPage } from '../features/companies/pages/CompanyDetailPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { CandidateProfilePage } from '../features/candidate-profile/pages/CandidateProfilePage'
import { CareerChatPage } from '../features/career-chat/pages/CareerChatPage'
import { AuthGuard } from './router/guards/AuthGuard'
import { MainLayout } from './layouts/MainLayout'

// Data router (thay cho BrowserRouter) để các trang dùng được useBlocker — xem trang JobBeacon Agent.
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      <Route element={<MainLayout showFooter={false} />}>
        <Route path="/agent" element={<CareerChatPage />} />
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
      <Route path="*" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
    </>,
  ),
)

export function App() {
  return <RouterProvider router={router} />
}

export default App
