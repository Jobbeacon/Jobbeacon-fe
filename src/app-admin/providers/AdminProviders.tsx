import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getApiBaseUrl } from '../../app/config/env'
import { getCurrentIdToken, subscribeToAuthState } from '../../features/auth/api/auth.api'
import { AuthStateContext, initialAuthState } from '../../features/auth/store/auth.store'
import type { AuthState } from '../../features/auth/types/auth.types'
import { configureApiClient } from '../../shared/api/api-client'
import { ConfirmProvider, ToastProvider } from '../../shared/components/admin'

configureApiClient({
  baseUrl: getApiBaseUrl(),
  getAccessToken: getCurrentIdToken,
})

export function AdminProviders({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState)

  useEffect(() => {
    return subscribeToAuthState(
      (user) => setAuthState({ user, isInitializing: false }),
      () => setAuthState({ user: null, isInitializing: false }),
    )
  }, [])

  return (
    <AuthStateContext.Provider value={authState}>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </AuthStateContext.Provider>
  )
}
