import { useEffect, useRef, useState } from 'react'
import {
  fetchNotificationPreference,
  updateNotificationPreference,
} from '../api/notifications.api'
import { getErrorMessage, isNotSyncedError } from './notification-page.utils'
import styles from './NotificationsPage.module.css'

const NOT_SYNCED_MESSAGE = 'Tài khoản đang được khởi tạo, chưa thể thay đổi cài đặt. Vui lòng quay lại sau.'

// Cài đặt nhận email gợi ý việc làm (job_match_enabled)
export function NotificationPreferenceSection() {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [notSynced, setNotSynced] = useState(false)
  const requestIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const requestId = ++requestIdRef.current
    fetchNotificationPreference()
      .then((preference) => {
        if (requestIdRef.current !== requestId) return
        setEnabled(preference.jobMatchEnabled)
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) return
        if (isNotSyncedError(error)) {
          setNotSynced(true)
          setEnabled(true)
          return
        }
        setMessage(getErrorMessage(error, 'Không tải được cài đặt thông báo.'))
      })
    return () => {
      mountedRef.current = false
      // Bỏ qua mọi phản hồi đến sau khi rời trang
      requestIdRef.current += 1
    }
  }, [])

  const handleToggle = async (next: boolean) => {
    if (enabled === null || isSaving) return
    const previous = enabled
    const requestId = ++requestIdRef.current
    setEnabled(next)
    setIsSaving(true)
    setMessage(null)
    try {
      const saved = await updateNotificationPreference({ jobMatchEnabled: next })
      if (requestIdRef.current !== requestId) return
      setEnabled(saved.jobMatchEnabled)
      setNotSynced(false)
    } catch (error) {
      if (requestIdRef.current !== requestId) return
      // Rollback khi lưu thất bại
      setEnabled(previous)
      if (isNotSyncedError(error)) {
        setNotSynced(true)
      } else {
        setMessage(getErrorMessage(error, 'Không lưu được cài đặt. Vui lòng thử lại.'))
      }
    } finally {
      if (mountedRef.current && requestIdRef.current === requestId) setIsSaving(false)
    }
  }

  return (
    <section className={styles.card} aria-labelledby="notification-settings-title">
      <h2 id="notification-settings-title" className={styles.sectionTitle}>
        Cài đặt thông báo
      </h2>
      <label className={styles.setting}>
        <span>
          Nhận email gợi ý việc làm
          <span className={styles.settingHint}>Gửi email khi có việc làm mới phù hợp với hồ sơ của bạn.</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          className={styles.toggle}
          checked={enabled ?? false}
          disabled={enabled === null || isSaving || notSynced}
          aria-busy={isSaving}
          onChange={(event) => void handleToggle(event.target.checked)}
        />
      </label>
      {notSynced ? <p className={styles.message}>{NOT_SYNCED_MESSAGE}</p> : null}
      {message ? <p className={`${styles.message} ${styles.error}`}>{message}</p> : null}
    </section>
  )
}
