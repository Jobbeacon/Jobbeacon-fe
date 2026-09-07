import { NavLink } from 'react-router-dom'
import logo from '../../../../assets/logo/jobbeacon-logo.svg'
import styles from './Header.module.css'

const navigationItems = [
  { label: 'Việc làm', to: '/jobs' },
  { label: 'Công ty', to: '/companies' },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink className={styles.logoLink} to="/" aria-label="JobBeacon - Trang chủ">
          <img className={styles.logoImage} src={logo} alt="JobBeacon" />
        </NavLink>

        <nav className={styles.navigation} aria-label="Điều hướng chính">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink className={styles.registerButton} to="/register">
          Đăng ký
        </NavLink>
      </div>
    </header>
  )
}
