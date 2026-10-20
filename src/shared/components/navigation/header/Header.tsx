import { useState } from 'react'
import { Bot, BriefcaseBusiness, Building2, Menu, UserRound, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../../../assets/logo/jobbeacon-logo.svg'
import { useAuth } from '../../../../features/auth/hooks/useAuth'
import styles from './Header.module.css'

const navigationItems = [
  { label: 'Việc làm', to: '/jobs', Icon: BriefcaseBusiness },
  { label: 'Công ty', to: '/companies', Icon: Building2 },
  { label: 'JobBeacon Agent', to: '/agent', Icon: Bot },
]

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.trim() || 'U'
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isInitializing, pendingAction, logout } = useAuth()

  const handleLogout = async () => {
    const completed = await logout()
    if (completed) {
      window.location.assign('/login')
    }
  }

  return (
    <>
      <header className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <span className={styles.backgroundClip} aria-hidden="true">
        <span className={`${styles.backgroundShape} ${styles.backgroundShapeOne}`} />
        <span className={`${styles.backgroundShape} ${styles.backgroundShapeTwo}`} />
        <span className={styles.dotPattern} />
      </span>

      <div className={styles.container}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <NavLink className={styles.logoLink} to="/" aria-label="JobBeacon - Trang chủ">
          <img className={styles.logoImage} src={logo} alt="JobBeacon" />
        </NavLink>

        <nav className={styles.navigation} aria-label="Điều hướng chính">
          {navigationItems.map((item) => (
            <NavLink key={item.to} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} to={item.to}>
              <span className={styles.navIcon}><item.Icon aria-hidden="true" /></span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.accountActions}>
          {user ? (
            <div className={styles.userChip}>
              <button className={styles.userChipTrigger} type="button" aria-haspopup="menu">
                {user.photoUrl ? (
                  <img className={styles.avatar} src={user.photoUrl} alt="" />
                ) : (
                  <span className={styles.avatar} aria-hidden="true">
                    {getInitials(user.displayName, user.email)}
                  </span>
                )}
                <strong>{user.displayName || user.email || 'Người dùng'}</strong>
              </button>
              <div className={styles.userMenu} role="menu">
                <NavLink to="/profile" role="menuitem">Hồ sơ của tôi</NavLink>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void handleLogout()}
                  disabled={pendingAction === 'logout'}
                >
                  {pendingAction === 'logout' ? 'Đang thoát...' : 'Đăng xuất'}
                </button>
              </div>
            </div>
          ) : isInitializing ? null : (
            <>
              <NavLink className={styles.loginButton} to="/login">Đăng nhập</NavLink>
              <NavLink className={styles.registerButton} to="/register">Đăng ký</NavLink>
            </>
          )}
        </div>
      </div>

      <nav id="mobile-navigation" className={styles.mobileNavigation} aria-label="Điều hướng trên thiết bị di động">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
            to={item.to}
            onClick={() => setIsMenuOpen(false)}
          >
            <item.Icon aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {user ? (
          <NavLink
            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserRound aria-hidden="true" />
            <span>Hồ sơ</span>
          </NavLink>
        ) : null}
      </nav>
      <button
        className={styles.menuBackdrop}
        type="button"
        aria-label="Đóng menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={() => setIsMenuOpen(false)}
      />
      </header>
      <div className={styles.headerSpacer} aria-hidden="true" />
    </>
  )
}
