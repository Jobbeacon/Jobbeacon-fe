import { Activity, BriefcaseBusiness, Building2, Layers, LayoutGrid, LogOut, Moon, Sun, Tag, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { MonoMark, useTheme, useToast } from '../../shared/components/admin'
import logoUrl from '../assets/logo.svg'
import { useAdminSession } from '../session/admin-session'

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutGrid },
  { to: '/jobs', label: 'Việc làm', icon: BriefcaseBusiness },
  { to: '/companies', label: 'Công ty', icon: Building2 },
  { to: '/users', label: 'Người dùng', icon: Users },
  { to: '/categories', label: 'Danh mục ngành', icon: Layers },
  { to: '/skills', label: 'Kỹ năng', icon: Tag },
  { to: '/monitoring', label: 'Giám sát hệ thống', icon: Activity },
]

export function AdminLayout() {
  const { me, signOut } = useAdminSession()
  const toast = useToast()
  const name = me.displayName?.trim() || me.email
  const { theme, setTheme } = useTheme()

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="sidebar-brand" to="/" aria-label="JobBeacon">
          <img className="brand-logo" src={logoUrl} alt="JobBeacon" />
          <span className="brand-tag">Admin</span>
        </Link>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            // NavLink tự gắn aria-current="page" khi đang ở trang đó.
            <NavLink key={to} to={to} end={to === '/'}>
              <Icon aria-hidden="true" strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <MonoMark name={name} avatarUrl={me.avatarUrl} />
          <div className="who">
            <span className="who-name" title={me.email}>
              {name}
            </span>
            <a
              className="signout"
              href="/login"
              onClick={(event) => {
                event.preventDefault()
                signOut().catch(() => toast('Không thể đăng xuất. Vui lòng thử lại.'))
              }}
            >
              <LogOut aria-hidden="true" strokeWidth={1.8} />
              Thoát
            </a>
          </div>
          <button
            type="button"
            className="theme-toggle"
            title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" strokeWidth={1.8} /> : <Moon aria-hidden="true" strokeWidth={1.8} />}
          </button>
        </div>
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}
