import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
  variant?: 'login' | 'register'
}

export function AuthLayout({ children, variant = 'login' }: AuthLayoutProps) {
  return (
    <main className={`auth-layout auth-layout--${variant}`}>
      <section className="auth-card">{children}</section>

      <footer className="auth-footer">
        © {new Date().getFullYear()} JobBeacon
      </footer>
    </main>
  )
}
