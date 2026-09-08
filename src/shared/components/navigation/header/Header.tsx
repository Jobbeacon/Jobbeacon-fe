import { useState } from 'react'
import { BriefcaseBusiness, Building2, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../../../assets/logo/jobbeacon-logo.svg'
import styles from './Header.module.css'

const navigationItems = [
  { label: 'Việc làm', to: '/jobs', Icon: BriefcaseBusiness },
  { label: 'Công ty', to: '/companies', Icon: Building2 },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <span className={`${styles.backgroundShape} ${styles.backgroundShapeOne}`} aria-hidden="true" />
      <span className={`${styles.backgroundShape} ${styles.backgroundShapeTwo}`} aria-hidden="true" />
      <span className={styles.dotPattern} aria-hidden="true" />

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
          <NavLink className={styles.loginButton} to="/login">Đăng nhập</NavLink>
          <NavLink className={styles.registerButton} to="/register">Đăng ký</NavLink>
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
