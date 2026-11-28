import type { AppNotification } from '../types/notification.types'
import { NotificationItem } from './NotificationItem'
import styles from './Notifications.module.css'

type NotificationListProps = {
  items: AppNotification[]
  onSelect: (notification: AppNotification) => void
  className?: string
}

// Danh sách thông báo dùng chung (dropdown, trang /notifications)
export function NotificationList({ items, onSelect, className }: NotificationListProps) {
  return (
    <ul className={className ?? styles.list}>
      {items.map((notification) => (
        <li key={notification.id}>
          <NotificationItem notification={notification} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}
