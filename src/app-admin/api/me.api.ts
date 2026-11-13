import { apiClient } from '../../shared/api/api-client'
import { camelizeKeys, unwrap } from '../../shared/api/case'
import type { ApiEnvelope } from '../../shared/api/case'

export type AdminRole = 'ADMIN' | 'USER'
export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED'

// Người dùng hiện tại (GET /api/v1/users/me), đã đổi sang camelCase.
export type CurrentUser = {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  role?: AdminRole
  status: AdminUserStatus
}

export async function getMe(signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>('/api/v1/users/me', { signal })
  return camelizeKeys<CurrentUser>(unwrap(response))
}

// Quyền admin theo DB: role ADMIN và đang hoạt động.
export function isActiveAdmin(user: CurrentUser | null | undefined) {
  return user?.role === 'ADMIN' && user.status === 'ACTIVE'
}

export const DENIED_MESSAGE = 'Tài khoản không có quyền quản trị.'
