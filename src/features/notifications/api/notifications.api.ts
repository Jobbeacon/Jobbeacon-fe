import { apiClient } from '../../../shared/api/api-client'
import { NOTIFICATION_ENDPOINTS } from '../../../shared/api/api-endpoints'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  AppNotification,
  JobMatchDigestPayload,
  NotificationJobItem,
  NotificationPage,
  NotificationPreference,
  NotificationType,
} from '../types/notification.types'

export type NotificationViewApiDto = {
  id: string | number
  type: NotificationType
  title: string
  body: string
  payload: Record<string, unknown> | null
  read: boolean
  read_at: string | null
  created_at: string
}

type NotificationPageApiDto = {
  items: NotificationViewApiDto[] | null
  page: number
  size: number
  total_elements: number
  total_pages: number
}

type UnreadCountApiDto = { unread_count: number }
type ReadAllApiDto = { updated: number }
type NotificationPreferenceApiDto = { job_match_enabled: boolean }

function asString(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function toJobItem(raw: unknown): NotificationJobItem | null {
  if (!raw || typeof raw !== 'object') return null
  const job = raw as Record<string, unknown>
  const jobId = asString(job.job_id)
  if (!jobId) return null
  const url = asString(job.url)
  return {
    jobId,
    title: asString(job.title),
    company: asString(job.company),
    ...(url ? { url } : {}),
  }
}

function toDigest(type: NotificationType, payload: Record<string, unknown>): JobMatchDigestPayload | null {
  if (type !== 'JOB_MATCH_DIGEST') return null
  const jobs = Array.isArray(payload.jobs) ? payload.jobs : []
  return {
    digestKey: asString(payload.digest_key),
    jobs: jobs.map(toJobItem).filter((job): job is NotificationJobItem => job !== null),
  }
}

// Dùng chung cho REST và SSE (`notification.created`).
export function toNotification(dto: NotificationViewApiDto): AppNotification {
  const payload = dto.payload ?? {}
  return {
    id: String(dto.id),
    type: dto.type,
    title: dto.title,
    body: dto.body,
    payload,
    digest: toDigest(dto.type, payload),
    read: dto.read,
    readAt: dto.read_at,
    createdAt: dto.created_at,
  }
}

function toPreference(dto: NotificationPreferenceApiDto): NotificationPreference {
  return { jobMatchEnabled: dto.job_match_enabled }
}

// page bắt đầu từ 1, size tối đa 100.
export async function fetchNotifications(page = 1, size = 20): Promise<NotificationPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
  const response = await apiClient.get<ApiResponse<NotificationPageApiDto>>(
    `${NOTIFICATION_ENDPOINTS.list}?${query.toString()}`,
  )
  const data = response.data
  return {
    items: (data.items ?? []).map(toNotification),
    page: data.page,
    size: data.size,
    totalElements: data.total_elements,
    totalPages: data.total_pages,
  }
}

export async function fetchUnreadCount(): Promise<number> {
  const response = await apiClient.get<ApiResponse<UnreadCountApiDto>>(NOTIFICATION_ENDPOINTS.unreadCount)
  return response.data.unread_count
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  const response = await apiClient.patch<ApiResponse<NotificationViewApiDto>>(NOTIFICATION_ENDPOINTS.markRead(id))
  return toNotification(response.data)
}

export async function markAllNotificationsRead(): Promise<number> {
  const response = await apiClient.patch<ApiResponse<ReadAllApiDto>>(NOTIFICATION_ENDPOINTS.markAllRead)
  return response.data.updated
}

export async function fetchNotificationPreference(): Promise<NotificationPreference> {
  const response = await apiClient.get<ApiResponse<NotificationPreferenceApiDto>>(NOTIFICATION_ENDPOINTS.preferences)
  return toPreference(response.data)
}

export async function updateNotificationPreference(
  preference: NotificationPreference,
): Promise<NotificationPreference> {
  const response = await apiClient.put<ApiResponse<NotificationPreferenceApiDto>>(NOTIFICATION_ENDPOINTS.preferences, {
    job_match_enabled: preference.jobMatchEnabled,
  })
  return toPreference(response.data)
}
