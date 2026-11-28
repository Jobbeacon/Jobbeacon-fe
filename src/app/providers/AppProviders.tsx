import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getApiBaseUrl } from '../config/env'
import {
  getCurrentIdToken,
  subscribeToAuthState,
  syncCurrentUser,
} from '../../features/auth/api/auth.api'
import {
  AuthStateContext,
  initialAuthState,
} from '../../features/auth/store/auth.store'
import type { AuthState } from '../../features/auth/types/auth.types'
import { NotificationsProvider } from '../../features/notifications/store/NotificationsProvider'
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
    // Mỗi lần trạng thái đăng nhập đổi, chỉ kết quả của lần mới nhất được áp dụng.
    let latest = 0

    return subscribeToAuthState(
      (user) => {
        const current = ++latest
        if (!user) {
          setAuthState({ user: null, isInitializing: false })
          return
        }
        // Đồng bộ user với backend (cả khi khôi phục phiên lúc tải trang) trước khi các màn hình
        // gọi API cần đăng nhập. Lỗi đồng bộ không chặn đăng nhập: API sau đó sẽ báo lỗi riêng.
        setAuthState({ user: null, isInitializing: true })
        void syncCurrentUser()
          .catch(() => undefined)
          .finally(() => {
            if (current === latest) setAuthState({ user, isInitializing: false })
          })
      },
      () => {
        ++latest
        setAuthState({ user: null, isInitializing: false })
      },
    )
  }, [])

  return (
    <AuthStateContext.Provider value={authState}>
      <SavedJobsProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </SavedJobsProvider>
    </AuthStateContext.Provider>
  )
}
