import { createContext, useContext } from 'react'
import type { CurrentUser } from '../api/me.api'

export type AdminSession = {
  me: CurrentUser
  signOut: () => Promise<void>
}

export const AdminSessionContext = createContext<AdminSession | null>(null)

// Thông tin admin đang đăng nhập (chỉ dùng bên trong AdminGuard).
export function useAdminSession() {
  const session = useContext(AdminSessionContext)
  if (!session) {
    throw new Error('useAdminSession phải dùng bên trong AdminGuard.')
  }
  return session
}
