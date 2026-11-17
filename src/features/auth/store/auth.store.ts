import { createContext } from 'react'
import type { AuthState } from '../types/auth.types'

export const initialAuthState: AuthState = {
  user: null,
  isInitializing: true,
}

export const AuthStateContext = createContext<AuthState | undefined>(undefined)
