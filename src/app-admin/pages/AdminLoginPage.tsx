import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { getAuthErrorMessage, loginWithEmail, loginWithGoogle, logout } from '../../features/auth/api/auth.api'
import { ApiError } from '../../shared/api/api-client'
import logoUrl from '../assets/logo.svg'
import { DENIED_MESSAGE, getMe, isActiveAdmin } from '../api/me.api'
import { useAdminAuthState } from '../session/use-auth-state'

type Verdict = { uid: string; admin: boolean; error?: string }

export function AdminLoginPage() {
  const { user, isInitializing } = useAdminAuthState()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(searchParams.get('denied') ? DENIED_MESSAGE : '')
  const [submitting, setSubmitting] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const uid = user?.uid ?? null

  // Đã đăng nhập Firebase → hỏi backend xem có phải admin không.
  useEffect(() => {
    if (!uid) {
      return
    }
    const controller = new AbortController()
    getMe(controller.signal)
      .then((me) => {
        if (controller.signal.aborted) return
        const admin = isActiveAdmin(me)
        setVerdict({ uid, admin })
        if (!admin) {
          setError(DENIED_MESSAGE)
          void logout().catch(() => undefined)
        }
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        const denied = reason instanceof ApiError && reason.status === 403
        const message = denied
          ? DENIED_MESSAGE
          : reason instanceof Error
            ? reason.message
            : 'Không thể kiểm tra quyền quản trị.'
        setVerdict({ uid, admin: false, error: message })
        setError(message)
        void logout().catch(() => undefined)
      })
    return () => controller.abort()
  }, [uid])

  const checking = isInitializing || (uid !== null && verdict?.uid !== uid)
  const busy = submitting || checking

  if (uid && verdict?.uid === uid && verdict.admin) {
    return <Navigate to="/" replace />
  }

  const run = async (action: () => Promise<unknown>) => {
    setError('')
    setSubmitting(true)
    try {
      await action()
    } catch (reason) {
      setError(getAuthErrorMessage(reason))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(() => loginWithEmail({ email, password }))
  }

  return (
    <div className="gate">
      <main className="gate-card">
        <div className="gate-brand">
          <img className="brand-logo" src={logoUrl} alt="JobBeacon" />
          <span className="brand-tag">Admin</span>
        </div>
        <h1>Quản trị</h1>
        <p className="lead">Vào bảng vận hành nền tảng. Đây không phải cửa đăng nhập của người tìm việc.</p>
        <form onSubmit={handleSubmit} onInput={() => setError('')}>
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="ten@jobbeacon.vn"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Mật khẩu</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <p className="form-error" role="alert">
            {error}
          </p>
          <button className="btn" type="submit" disabled={busy}>
            {checking && !submitting ? 'Đang kiểm tra...' : 'Vào bảng điều khiển'}
          </button>
          <button className="btn ghost" type="button" disabled={busy} onClick={() => void run(loginWithGoogle)}>
            Đăng nhập với Google
          </button>
        </form>
      </main>
    </div>
  )
}
