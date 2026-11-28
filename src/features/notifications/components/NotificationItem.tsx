import type { AppNotification } from '../types/notification.types'
import { formatRelativeTime } from './notification-links'
import styles from './Notifications.module.css'

type NotificationItemProps = {
  notification: AppNotification
  onSelect: (notification: AppNotification) => void
}

function getFallbackTitle(notification: AppNotification): string {
  switch (notification.type) {
    case 'JOB_MATCH_DIGEST':
      return 'Việc làm phù hợp với bạn'
    case 'WELCOME':
      return 'Chào mừng bạn đến với JobBeacon'
    default:
      return 'Thông báo mới'
  }
}

export function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  const title = notification.title?.trim() || getFallbackTitle(notification)
  const body = notification.body?.trim()

  return (
    <button
      type="button"
      className={notification.read ? styles.item : `${styles.item} ${styles.itemUnread}`}
      onClick={() => onSelect(notification)}
    >
      <span className={styles.itemContent}>
        <span className={styles.itemTitle}>{title}</span>
        {body ? <span className={styles.itemBody}>{body}</span> : null}
        <time className={styles.itemTime} dateTime={notification.createdAt}>
          {formatRelativeTime(notification.createdAt)}
        </time>
      </span>
      {notification.read ? null : (
        <span className={styles.unreadDot}>
          <span className={styles.srOnly}>Chưa đọc</span>
        </span>
      )}
    </button>
  )
}
