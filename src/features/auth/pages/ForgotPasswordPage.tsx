import { AuthLayout } from '../../../app/layouts/AuthLayout'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <AuthLayout variant="login">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
