import { BriefcaseBusiness, Building2, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../../../assets/logo/jobbeacon-logo.svg'
import styles from './Header.module.css'

const navigationItems = [
  { label: 'Việc làm', to: '/jobs', Icon: BriefcaseBusiness },
  { label: 'Công ty', to: '/companies', Icon: Building2 },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={`${styles.backgroundShape} ${styles.backgroundShapeOne}`} aria-hidden="true" />
      <span className={`${styles.backgroundShape} ${styles.backgroundShapeTwo}`} aria-hidden="true" />
      <span className={styles.dotPattern} aria-hidden="true" />

      <div className={styles.container}>
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
    </header>
  )
}
