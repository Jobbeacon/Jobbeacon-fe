import { useNotificationsContext } from './useNotificationsContext'

// Trang thông báo mới nhất + trạng thái tải và các thao tác đánh dấu đã đọc
export function useNotifications() {
  const { isActive, items, isLoading, error, notSynced, refresh, markRead, markAllRead } =
    useNotificationsContext()
  return { isActive, items, isLoading, error, notSynced, refresh, markRead, markAllRead }
}
