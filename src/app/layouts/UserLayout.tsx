import type { ReactNode } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'

type UserLayoutProps = {
  children: ReactNode
}

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.trim() || 'U'
  const words = source.split(/\s+/).filter(Boolean)

  return words
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, pendingAction, logout } = useAuth()

  const handleLogout = async () => {
    const completed = await logout()
    if (completed) {
      window.location.assign('/login')
    }
  }

  return (
    <div className="user-layout">
      <header className="user-header">
        <div className="user-header__inner">
          {/* Logo JobBeacon sẽ được đặt vào vùng này sau. */}
          <a className="user-logo-slot" href="/profile" aria-label="Trang chủ JobBeacon" />

          <nav className="user-navigation" aria-label="Điều hướng chính">
            <a className="user-navigation__link user-navigation__link--active" href="/profile">
              Hồ sơ cá nhân
            </a>
          </nav>

          <div className="user-account">
            <span className="user-account__avatar" aria-hidden="true">
              {getInitials(user?.displayName ?? null, user?.email ?? null)}
            </span>
            <span className="user-account__name">
              {user?.displayName || user?.email || 'Người dùng'}
            </span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={pendingAction === 'logout'}
            >
              {pendingAction === 'logout' ? 'Đang thoát...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      </header>

      <main className="user-main">{children}</main>
    </div>
  )
}
