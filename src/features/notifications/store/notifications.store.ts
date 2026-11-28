import { createContext } from 'react'
import type { AppNotification } from '../types/notification.types'

export type NotificationsContextValue = {
  // true khi đã đăng nhập và provider đang hoạt động
  isActive: boolean
  // trang đầu (mới nhất) của danh sách thông báo
  items: AppNotification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  // user chưa được đồng bộ sang service notification → UI hiện trạng thái rỗng
  notSynced: boolean
  refresh: () => void
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)
