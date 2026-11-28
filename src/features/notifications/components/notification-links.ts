import { ROUTE_PATHS } from '../../../app/router/route-paths'
import type { AppNotification } from '../types/notification.types'

// Đường dẫn trang danh sách thông báo
export const NOTIFICATIONS_PATH = ROUTE_PATHS.NOTIFICATIONS

// Chỉ chấp nhận đường dẫn nội bộ cùng origin (chặn '//evil.com', '/\\evil.com', URL tuyệt đối)
export function toInternalPath(url: string): string | null {
  if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) return null
  try {
    const origin = window.location.origin
    const parsed = new URL(url, origin)
    if (parsed.origin !== origin) return null
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return null
  }
}

// Đích điều hướng khi bấm một thông báo
export function getNotificationTarget(notification: AppNotification): string {
  switch (notification.type) {
    case 'JOB_MATCH_DIGEST': {
      const jobs = notification.digest?.jobs ?? []
      if (jobs.length === 1) {
        const job = jobs[0]
        const internal = job.url ? toInternalPath(job.url) : null
        if (internal) return internal
        if (job.jobId) return `/jobs/${encodeURIComponent(job.jobId)}`
      }
      return NOTIFICATIONS_PATH
    }
    default:
      return NOTIFICATIONS_PATH
  }
}

const relativeFormatter = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' })

// Thời gian tương đối tiếng Việt, ví dụ "5 phút trước"
export function formatRelativeTime(value: string, now: number = Date.now()): string {
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return ''
  const seconds = Math.round((time - now) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 60) return 'Vừa xong'
  if (abs < 3600) return relativeFormatter.format(Math.round(seconds / 60), 'minute')
  if (abs < 86400) return relativeFormatter.format(Math.round(seconds / 3600), 'hour')
  if (abs < 86400 * 30) return relativeFormatter.format(Math.round(seconds / 86400), 'day')
  return new Date(time).toLocaleDateString('vi-VN')
}
