import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { CandidateProfilePage } from '../features/candidate-profile/pages/CandidateProfilePage'
import { AuthGuard } from './router/guards/AuthGuard'

export function App() {
  const path = window.location.pathname.replace(/\/$/, '')

  if (path === '/register' || path === '/dang-ky') {
    return <RegisterPage />
  }

  if (path === '/forgot-password' || path === '/quen-mat-khau') {
    return <ForgotPasswordPage />
  }

  if (path === '/profile' || path === '/ho-so') {
    return (
      <AuthGuard>
        <CandidateProfilePage />
      </AuthGuard>
    )
  }

  return <LoginPage />
}
