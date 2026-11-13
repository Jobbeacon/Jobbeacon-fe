import { useContext } from 'react'
import { AuthStateContext } from '../../features/auth/store/auth.store'

export function useAdminAuthState() {
  const state = useContext(AuthStateContext)
  if (!state) {
    throw new Error('useAdminAuthState phải dùng bên trong AdminProviders.')
  }
  return state
}
