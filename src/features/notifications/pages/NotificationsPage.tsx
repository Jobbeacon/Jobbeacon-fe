import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications } from '../api/notifications.api'
import { NotificationList } from '../components/NotificationList'
import { getNotificationTarget, NOTIFICATIONS_PATH } from '../components/notification-links'
import { useNotifications } from '../hooks/useNotifications'
import type { AppNotification } from '../types/notification.types'
import { NotificationPreferenceSection } from './NotificationPreferenceSection'
import { getErrorMessage, isNotSyncedError } from './notification-page.utils'
import styles from './NotificationsPage.module.css'

const PAGE_SIZE = 20

type ListState = {
  items: AppNotification[]
  page: number
  totalPages: number
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  notSynced: boolean
}

const initialState: ListState = {
  items: [],
  page: 0,
  totalPages: 0,
  isLoading: true,
  isLoadingMore: false,
  error: null,
  notSynced: false,
}

// Gộp trang mới vào danh sách hiện có, bỏ trùng theo id
function mergeItems(head: AppNotification[], tail: AppNotification[]): AppNotification[] {
  const seen = new Set(head.map((item) => item.id))
  return [...head, ...tail.filter((item) => !seen.has(item.id))]
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { items: liveItems, markRead, markAllRead, notSynced: providerNotSynced } = useNotifications()
  const [state, setState] = useState<ListState>(initialState)
  const requestIdRef = useRef(0)
  const latestLiveId = liveItems[0]?.id ?? null
  const lastLiveIdRef = useRef<string | null>(latestLiveId)

  // mode 'reset': tải lại từ trang 1; 'more': trang kế tiếp; 'refresh': trang 1, giữ phần đã tải thêm
  const load = useCallback((page: number, mode: 'reset' | 'more' | 'refresh') => {
    // Cờ loading do nơi gọi đặt (không setState đồng bộ trong effect)
    const requestId = ++requestIdRef.current
    fetchNotifications(page, PAGE_SIZE)
      .then((result) => {
        if (requestIdRef.current !== requestId) return
        setState((current) => ({
          ...current,
          items:
            mode === 'reset'
              ? result.items
              : mode === 'more'
                ? mergeItems(current.items, result.items)
                : mergeItems(result.items, current.items),
          page: mode === 'refresh' ? Math.max(current.page, result.page) : result.page,
          totalPages: result.totalPages,
          isLoading: false,
          isLoadingMore: false,
          error: null,
          notSynced: false,
        }))
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) return
        setState((current) => ({
          ...current,
          isLoading: false,
          isLoadingMore: false,
          notSynced: isNotSyncedError(error),
          error: isNotSyncedError(error) ? null : getErrorMessage(error, 'Không tải được thông báo. Vui lòng thử lại.'),
        }))
      })
  }, [])

  useEffect(() => {
    load(1, 'reset')
    return () => {
      // Bỏ qua phản hồi đến muộn sau khi rời trang
      requestIdRef.current += 1
    }
  }, [load])

  // Có thông báo mới từ SSE (đầu danh sách của provider đổi) → tải lại trang 1 và gộp lên đầu
  useEffect(() => {
    if (latestLiveId === lastLiveIdRef.current) return
    lastLiveIdRef.current = latestLiveId
    if (latestLiveId === null) return
    load(1, 'refresh')
  }, [latestLiveId, load])

  const handleRetry = () => {
    setState((current) => ({ ...current, isLoading: true, isLoadingMore: false, error: null }))
    load(1, 'reset')
  }

  const handleLoadMore = () => {
    setState((current) => ({ ...current, isLoadingMore: true, error: null }))
    load(state.page + 1, 'more')
  }

  const handleSelect = async (notification: AppNotification) => {
    if (!notification.read) {
      const readAt = new Date().toISOString()
      setState((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === notification.id ? { ...item, read: true, readAt } : item)),
      }))
      try {
        await markRead(notification.id)
      } catch {
        // Provider đã rollback; khôi phục trên trang, không chặn điều hướng
        setState((current) => ({
          ...current,
          items: current.items.map((item) =>
            item.id === notification.id ? { ...item, read: false, readAt: null } : item,
          ),
        }))
      }
    }
    const target = getNotificationTarget(notification)
    if (target !== NOTIFICATIONS_PATH) navigate(target)
  }

  const handleMarkAllRead = async () => {
    const readAt = new Date().toISOString()
    const unreadIds = new Set(state.items.filter((item) => !item.read).map((item) => item.id))
    setState((current) => ({
      ...current,
      items: current.items.map((item) => (item.read ? item : { ...item, read: true, readAt })),
    }))
    try {
      await markAllRead()
    } catch {
      // Provider tự rollback; khôi phục trạng thái chưa đọc trên trang
      setState((current) => ({
        ...current,
        items: current.items.map((item) => (unreadIds.has(item.id) ? { ...item, read: false, readAt: null } : item)),
      }))
    }
  }

  const notSynced = state.notSynced || providerNotSynced
  const hasUnread = state.items.some((item) => !item.read)
  const hasMore = state.page > 0 && state.page < state.totalPages

  let content
  if (notSynced) {
    content = <p className={styles.state}>Tài khoản đang được khởi tạo. Vui lòng quay lại sau.</p>
  } else if (state.isLoading && state.items.length === 0) {
    content = <p className={styles.state}>Đang tải thông báo...</p>
  } else if (state.error && state.items.length === 0) {
    content = (
      <div className={styles.state}>
        <p className={styles.error}>{state.error}</p>
        <button type="button" className={styles.button} onClick={handleRetry}>
          Thử lại
        </button>
      </div>
    )
  } else if (state.items.length === 0) {
    content = <p className={styles.state}>Bạn chưa có thông báo nào.</p>
  } else {
    content = (
      <>
        <NotificationList
          items={state.items}
          className={styles.list}
          onSelect={(notification) => void handleSelect(notification)}
        />
        {state.error ? <p className={`${styles.message} ${styles.error}`}>{state.error}</p> : null}
        {hasMore ? (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.button}
              disabled={state.isLoadingMore}
              onClick={handleLoadMore}
            >
              {state.isLoadingMore ? 'Đang tải...' : 'Tải thêm'}
            </button>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thông báo</h1>
        <button
          type="button"
          className={styles.button}
          disabled={!hasUnread || notSynced}
          onClick={() => void handleMarkAllRead()}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      <section className={styles.card} aria-label="Danh sách thông báo">
        {content}
      </section>
      <NotificationPreferenceSection />
    </div>
  )
}

export default NotificationsPage
