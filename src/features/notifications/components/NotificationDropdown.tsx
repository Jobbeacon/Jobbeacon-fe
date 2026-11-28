import { Link } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import type { AppNotification } from '../types/notification.types'
import { NotificationItem } from './NotificationItem'
import { NOTIFICATIONS_PATH } from './notification-links'
import styles from './Notifications.module.css'

const MAX_ITEMS = 6

type NotificationDropdownProps = {
  id: string
  onSelect: (notification: AppNotification) => void
  onClose: () => void
}

export function NotificationDropdown({ id, onSelect, onClose }: NotificationDropdownProps) {
  const { items, isLoading, error, notSynced, markAllRead } = useNotifications()
  const latest = items.slice(0, MAX_ITEMS)
  const hasUnread = items.some((item) => !item.read)

  let content
  if (notSynced) {
    content = <p className={styles.state}>Tài khoản đang được khởi tạo. Vui lòng quay lại sau.</p>
  } else if (isLoading && latest.length === 0) {
    content = <p className={styles.state}>Đang tải thông báo...</p>
  } else if (error && latest.length === 0) {
    content = <p className={styles.state}>Không tải được thông báo. Vui lòng thử lại.</p>
  } else if (latest.length === 0) {
    content = <p className={styles.state}>Bạn chưa có thông báo nào.</p>
  } else {
    content = (
      <ul className={styles.list}>
        {latest.map((notification) => (
          <li key={notification.id}>
            <NotificationItem notification={notification} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div id={id} className={styles.dropdown} role="dialog" aria-label="Thông báo">
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownTitle}>Thông báo</span>
        <button
          type="button"
          className={styles.linkButton}
          disabled={!hasUnread || notSynced}
          onClick={() => {
            markAllRead().catch(() => {
              // Provider đã rollback; không làm hỏng UI
            })
          }}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      {content}
      <div className={styles.dropdownFooter}>
        <Link to={NOTIFICATIONS_PATH} onClick={onClose}>
          Xem tất cả
        </Link>
      </div>
    </div>
  )
}
