import { useNotificationsContext } from './useNotificationsContext'

// Số thông báo chưa đọc (0 khi chưa đăng nhập hoặc chưa đồng bộ)
export function useUnreadCount() {
  return useNotificationsContext().unreadCount
}
