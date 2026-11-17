import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { validateRegisterForm } from '../schemas/auth.schema'
import { AuthFeedback } from './AuthFeedback'
import { PasswordField } from './PasswordField'

export function RegisterForm() {
  const { pendingAction, error, success, clearFeedback, registerWithEmail } = useAuth()
  const [validationError, setValidationError] = useState<string | null>(null)
  const isPending = pendingAction !== null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const values = {
      fullName: String(data.get('fullName') ?? ''),
      email: String(data.get('email') ?? ''),
      password: String(data.get('password') ?? ''),
      confirmPassword: String(data.get('confirmPassword') ?? ''),
    }
    const nextValidationError = validateRegisterForm(values)

    setValidationError(nextValidationError)
    clearFeedback()
    if (nextValidationError) {
      return
    }

    const completed = await registerWithEmail(values)
    if (completed) {
      window.location.assign('/profile')
    }
  }

  return (
    <div className="auth-content auth-content--register">
      {/* Logo JobBeacon sẽ được đặt vào vùng này sau. */}
      <div className="auth-logo-slot auth-logo-slot--register" aria-hidden="true" />

      <header className="auth-heading">
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản miễn phí và bắt đầu tìm kiếm cơ hội phù hợp.</p>
      </header>

      <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
        <AuthFeedback error={validationError ?? error} success={success} />

        <div className="form-field">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            autoComplete="name"
            disabled={isPending}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email"
            autoComplete="email"
            disabled={isPending}
            required
          />
        </div>

        <PasswordField
          id="password"
          disabled={isPending}
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          autoComplete="new-password"
        />
        <PasswordField
          id="confirmPassword"
          disabled={isPending}
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
        />

        <button
          className="primary-button"
          type="submit"
          disabled={isPending}
          aria-busy={pendingAction === 'register'}
        >
          <span>{pendingAction === 'register' ? 'Đang đăng ký...' : 'Đăng ký'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </button>
      </form>

      <p className="auth-switch">
        Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
      </p>
    </div>
  )
}
