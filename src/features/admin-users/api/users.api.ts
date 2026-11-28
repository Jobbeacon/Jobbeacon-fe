import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, snakeizeKeys, toQuery, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope, Page } from '../../../shared/api/case'
import type { UserDetail, UserQuery, UserRow, UserStats, UserUpdate } from '../types/user.types'

const BASE = '/api/v1/admin/users'

export async function getUserStats(signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}/stats`, { signal })
  return camelizeKeys<UserStats>(unwrap(response))
}

export async function getUsers(query: UserQuery, signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}${toQuery(query)}`, { signal })
  const page = camelizeKeys<Page<UserRow>>(unwrap(response))
  return { content: page?.content ?? [], amount: page?.amount ?? 0 } satisfies Page<UserRow>
}

export async function getUser(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}/${encodeURIComponent(id)}`, { signal })
  return camelizeKeys<UserDetail>(unwrap(response))
}

export async function updateUser(id: string, body: UserUpdate) {
  const response = await apiClient.put<ApiEnvelope<unknown>>(`${BASE}/${encodeURIComponent(id)}`, snakeizeKeys(body))
  return camelizeKeys<UserDetail>(unwrap(response))
}
