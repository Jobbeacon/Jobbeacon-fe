import { Bell } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import { useUnreadCount } from '../hooks/useUnreadCount'
import type { AppNotification } from '../types/notification.types'
import { NotificationDropdown } from './NotificationDropdown'
import { getNotificationTarget } from './notification-links'
import styles from './Notifications.module.css'

export function NotificationBell() {
  const unreadCount = useUnreadCount()
  const { markRead } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownId = useId()

  // Đóng dropdown khi bấm ra ngoài hoặc nhấn Escape
  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSelect = async (notification: AppNotification) => {
    setOpen(false)
    if (!notification.read) {
      try {
        await markRead(notification.id)
      } catch {
        // Lỗi đánh dấu đã đọc không chặn điều hướng
      }
    }
    navigate(getNotificationTarget(notification))
  }

  const badge = unreadCount > 99 ? '99+' : String(unreadCount)
  const label =
    unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : 'Thông báo'

  return (
    <div className={styles.bell} ref={containerRef}>
      <button
        type="button"
        className={styles.bellButton}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dropdownId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className={styles.badge} aria-hidden="true">
            {badge}
          </span>
        ) : null}
      </button>
      {open ? (
        <NotificationDropdown
          id={dropdownId}
          onSelect={(notification) => void handleSelect(notification)}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}
