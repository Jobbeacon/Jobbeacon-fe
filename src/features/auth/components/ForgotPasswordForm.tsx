import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthFeedback } from './AuthFeedback'

export function ForgotPasswordForm() {
  const { pendingAction, error, success, resetPassword } = useAuth()
  const isPending = pendingAction !== null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    void resetPassword(String(data.get('email') ?? ''))
  }

  return (
    <div className="auth-content auth-content--forgot">
      {/* Logo JobBeacon sẽ được đặt vào vùng này sau. */}
      <div className="auth-logo-slot" aria-hidden="true" />

      <header className="auth-heading">
        <h1>Quên mật khẩu?</h1>
        <p>Nhập email của bạn, JobBeacon sẽ gửi liên kết để đặt lại mật khẩu.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthFeedback error={error} success={success} />

        <div className="form-field">
          <label htmlFor="resetEmail">Email</label>
          <input
            id="resetEmail"
            name="email"
            type="email"
            placeholder="Nhập email"
            autoComplete="email"
            disabled={isPending}
            required
          />
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={isPending}
          aria-busy={pendingAction === 'reset-password'}
        >
          <span>{pendingAction === 'reset-password' ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </button>
      </form>

      <p className="auth-switch">
        <a href="/login">Quay lại đăng nhập</a>
      </p>
    </div>
  )
}
