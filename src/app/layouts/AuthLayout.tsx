import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
  variant?: 'login' | 'register'
}

export function AuthLayout({ children, variant = 'login' }: AuthLayoutProps) {
  return (
    <main className={`auth-layout auth-layout--${variant}`}>
      <div className="auth-decoration" aria-hidden="true">
        <span className="auth-decoration__line auth-decoration__line--one" />
        <span className="auth-decoration__line auth-decoration__line--two" />
        <span className="auth-decoration__line auth-decoration__line--three" />
      </div>

      <section className="auth-card">{children}</section>

      <footer className="auth-footer">
        © 2026 JobBeacon. All rights reserved.
      </footer>
    </main>
  )
}
