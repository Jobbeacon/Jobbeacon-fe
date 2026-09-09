import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { LoadingState } from '../../../shared/components/common/LoadingState'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isInitializing } = useAuth()

  useEffect(() => {
    if (!isInitializing && !user) {
      window.location.replace('/login')
    }
  }, [isInitializing, user])

  if (isInitializing || !user) {
    return (
      <main className="route-loading">
        <LoadingState label="Đang kiểm tra phiên đăng nhập..." />
      </main>
    )
  }

  return children
}
