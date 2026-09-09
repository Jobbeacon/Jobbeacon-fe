import { AuthLayout } from '../../../app/layouts/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <AuthLayout variant="register">
      <RegisterForm />
    </AuthLayout>
  )
}
