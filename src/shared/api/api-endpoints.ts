// Đường dẫn API của notification service (đi qua gateway).
const NOTIFICATION_BASE = '/jobbeacon-notification/api/v1/me'

export const NOTIFICATION_ENDPOINTS = {
  list: `${NOTIFICATION_BASE}/notifications`,
  unreadCount: `${NOTIFICATION_BASE}/notifications/unread-count`,
  markRead: (id: string | number) => `${NOTIFICATION_BASE}/notifications/${encodeURIComponent(String(id))}/read`,
  markAllRead: `${NOTIFICATION_BASE}/notifications/read-all`,
  stream: `${NOTIFICATION_BASE}/notifications/stream`,
  preferences: `${NOTIFICATION_BASE}/notification-preferences`,
} as const
