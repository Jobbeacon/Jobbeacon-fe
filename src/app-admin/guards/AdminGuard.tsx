import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/api/auth.api'
import { ApiError } from '../../shared/api/api-client'
import { ErrorState } from '../../shared/components/common/ErrorState'
import { LoadingState } from '../../shared/components/common/LoadingState'
import { getMe, isActiveAdmin } from '../api/me.api'
import type { CurrentUser } from '../api/me.api'
import { AdminSessionContext } from '../session/admin-session'
import { useAdminAuthState } from '../session/use-auth-state'

type SessionResult = { uid: string; attempt: number } & ({ me: CurrentUser } | { error: string })

// Chỉ cho admin (role ADMIN, status ACTIVE theo DB) vào; không phải admin → đăng xuất, về /login?denied=1.
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isInitializing } = useAdminAuthState()
  const navigate = useNavigate()
  const [result, setResult] = useState<SessionResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const uid = user?.uid ?? null

  useEffect(() => {
    if (!uid) {
      return
    }
    const controller = new AbortController()
    const deny = async () => {
      await logout().catch(() => undefined)
      navigate('/login?denied=1', { replace: true })
    }

    getMe(controller.signal)
      .then((me) => {
        if (controller.signal.aborted) return
        if (!isActiveAdmin(me)) {
          void deny()
          return
        }
        setResult({ uid, attempt, me })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof ApiError && error.status === 403) {
          void deny()
          return
        }
        const message = error instanceof Error ? error.message : 'Không thể kiểm tra quyền quản trị.'
        setResult({ uid, attempt, error: message })
      })

    return () => controller.abort()
  }, [uid, attempt, navigate])

  const signOut = useCallback(async () => {
    await logout()
    navigate('/login', { replace: true })
  }, [navigate])

  const me = result && result.uid === uid && result.attempt === attempt && 'me' in result ? result.me : null
  const session = useMemo(() => (me ? { me, signOut } : null), [me, signOut])

  if (isInitializing) {
    return <LoadingState label="Đang kiểm tra đăng nhập..." />
  }
  if (!uid) {
    return <Navigate to="/login" replace />
  }
  const current = result && result.uid === uid && result.attempt === attempt ? result : null
  if (current && 'error' in current) {
    return <ErrorState message={current.error} onRetry={() => setAttempt((value) => value + 1)} />
  }
  if (!session) {
    return <LoadingState label="Đang kiểm tra quyền quản trị..." />
  }

  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>
}
