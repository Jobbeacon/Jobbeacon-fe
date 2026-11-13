import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getApiBaseUrl } from '../config/env'
import {
  getCurrentIdToken,
  subscribeToAuthState,
} from '../../features/auth/api/auth.api'
import {
  AuthStateContext,
  initialAuthState,
} from '../../features/auth/store/auth.store'
import type { AuthState } from '../../features/auth/types/auth.types'
import { SavedJobsProvider } from '../../features/saved-jobs/store/SavedJobsProvider'
import { configureApiClient } from '../../shared/api/api-client'

configureApiClient({
  baseUrl: getApiBaseUrl(),
  getAccessToken: getCurrentIdToken,
})

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState)

  useEffect(() => {
    return subscribeToAuthState(
      (user) => setAuthState({ user, isInitializing: false }),
      () => setAuthState({ user: null, isInitializing: false }),
    )
  }, [])

  return (
    <AuthStateContext.Provider value={authState}>
      <SavedJobsProvider>{children}</SavedJobsProvider>
    </AuthStateContext.Provider>
  )
}
