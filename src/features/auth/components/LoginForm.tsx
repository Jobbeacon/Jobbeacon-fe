import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthFeedback } from './AuthFeedback'
import { PasswordField } from './PasswordField'

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.92A6.02 6.02 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.53l3.35-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.5 3.82 1.5l2.88-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"
      />
    </svg>
  )
}

export function LoginForm() {
  const { pendingAction, error, success, loginWithEmail, loginWithGoogle } = useAuth()
  const isPending = pendingAction !== null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const completed = await loginWithEmail({
      email: String(data.get('email') ?? ''),
      password: String(data.get('loginPassword') ?? ''),
    })

    if (completed) {
      window.location.assign('/profile')
    }
  }

  const handleGoogleLogin = async () => {
    const completed = await loginWithGoogle()
    if (completed) {
      window.location.assign('/profile')
    }
  }

  return (
    <div className="auth-content auth-content--login">
      {/* Logo JobBeacon sẽ được đặt vào vùng này sau. */}
      <div className="auth-logo-slot" aria-hidden="true" />

      <header className="auth-heading">
        <h1>Chào mừng bạn trở lại</h1>
      </header>

      <button
        className="google-button"
        type="button"
        onClick={() => void handleGoogleLogin()}
        disabled={isPending}
        aria-busy={pendingAction === 'login-google'}
      >
        <GoogleIcon />
        <span>{pendingAction === 'login-google' ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}</span>
      </button>

      <div className="auth-divider">
        <span>Hoặc đăng nhập bằng email</span>
      </div>

      <form className="auth-form auth-form--login" onSubmit={(event) => void handleSubmit(event)}>
        <AuthFeedback error={error} success={success} />

        <div className="form-field">
          <label htmlFor="loginEmail">Email</label>
          <input
            id="loginEmail"
            name="email"
            type="email"
            placeholder="Nhập email"
            autoComplete="email"
            disabled={isPending}
            required
          />
        </div>

        <PasswordField
          id="loginPassword"
          disabled={isPending}
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          minLength={1}
          headerAction={
            <a className="forgot-password-link" href="/forgot-password">
              Quên mật khẩu
            </a>
          }
        />

        <button
          className="primary-button"
          type="submit"
          disabled={isPending}
          aria-busy={pendingAction === 'login-email'}
        >
          <span>{pendingAction === 'login-email' ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </button>
      </form>

      <p className="auth-switch">
        Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  )
}
