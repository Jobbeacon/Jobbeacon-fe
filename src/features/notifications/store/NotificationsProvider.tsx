import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { AuthStateContext } from '../../auth/store/auth.store'
import { openNotificationStream } from '../api/notification-stream'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notifications.api'
import type { AppNotification } from '../types/notification.types'
import { NotificationsContext } from './notifications.store'
import type { NotificationsContextValue } from './notifications.store'

const PAGE_SIZE = 20
const USER_NOT_SYNCED = 'user_not_synced'

type NotificationsState = {
  userId: string | null
  items: AppNotification[]
  unreadCount: number
  loaded: boolean
  isLoading: boolean
  error: string | null
  notSynced: boolean
}

function emptyState(userId: string | null): NotificationsState {
  return { userId, items: [], unreadCount: 0, loaded: false, isLoading: false, error: null, notSynced: false }
}

// State rỗng dùng chung khi chưa đăng nhập (tham chiếu ổn định giữa các lần render)
const SIGNED_OUT_STATE: NotificationsState = emptyState(null)

function getLoadError(error: unknown) {
  if (error instanceof ApiError) return error.message
  return 'Không thể tải thông báo. Vui lòng thử lại.'
}

function isNotSynced(error: unknown) {
  return error instanceof ApiError && error.status === 404 && error.code === USER_NOT_SYNCED
}

// Giữ trang thông báo mới nhất + số chưa đọc của user hiện tại, cập nhật realtime qua SSE
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const authState = useContext(AuthStateContext)
  const user = authState?.user ?? null
  const userId = user?.uid ?? null
  const [state, setState] = useState<NotificationsState>(SIGNED_OUT_STATE)
  const requestIdRef = useRef(0)
  const userIdRef = useRef(userId)
  // bản state mới nhất để tính dữ liệu rollback đồng bộ (không dựa vào updater của setState)
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Chỉ cập nhật state khi vẫn là user hiện tại; đổi user thì bắt đầu từ state rỗng
  const update = useCallback((forUser: string, updater: (current: NotificationsState) => NotificationsState) => {
    if (userIdRef.current !== forUser) return
    setState((current) => updater(current.userId === forUser ? current : emptyState(forUser)))
  }, [])

  const load = useCallback(
    (forUser: string) => {
      const requestId = ++requestIdRef.current
      update(forUser, (current) => ({ ...current, isLoading: true, error: null }))
      Promise.all([fetchNotifications(1, PAGE_SIZE), fetchUnreadCount()])
        .then(([page, unreadCount]) => {
          if (requestId !== requestIdRef.current) return
          update(forUser, (current) => ({
            ...current,
            items: page.items,
            unreadCount,
            loaded: true,
            isLoading: false,
            error: null,
          }))
        })
        .catch((error: unknown) => {
          if (requestId !== requestIdRef.current) return
          update(forUser, (current) => ({
            ...current,
            isLoading: false,
            error: isNotSynced(error) ? null : getLoadError(error),
            notSynced: current.notSynced || isNotSynced(error),
          }))
        })
    },
    [update],
  )

  useEffect(() => {
    userIdRef.current = userId
    // đổi user / đăng xuất: bỏ mọi response đến muộn của user cũ
    requestIdRef.current += 1
  }, [userId])

  // Mở stream khi đã đăng nhập; mở lại khi user (kể cả token mới) thay đổi, kể cả sau lỗi 401
  useEffect(() => {
    if (!user) return
    const forUser = user.uid
    const controller = new AbortController()
    userIdRef.current = forUser
    load(forUser)

    openNotificationStream(
      {
        onOpen: () => {
          update(forUser, (current) => ({ ...current, notSynced: false }))
          load(forUser)
        },
        onNotification: (notification) => {
          update(forUser, (current) => {
            if (current.items.some((item) => item.id === notification.id)) return current
            return {
              ...current,
              items: [notification, ...current.items].slice(0, PAGE_SIZE),
              unreadCount: notification.read ? current.unreadCount : current.unreadCount + 1,
            }
          })
        },
        onError: (error) => {
          if (error.code === USER_NOT_SYNCED) {
            update(forUser, (current) => ({ ...current, notSynced: true }))
          }
          // lỗi fatal (401): stream tự dừng, effect sẽ mở lại khi auth user thay đổi
        },
      },
      controller.signal,
    )

    return () => controller.abort()
  }, [user, load, update])

  const refresh = useCallback(() => {
    if (userId) load(userId)
  }, [load, userId])

  const markRead = useCallback(
    async (id: string) => {
      if (!userId) return
      const forUser = userId
      const latest = stateRef.current
      const target = latest.userId === forUser ? latest.items.find((item) => item.id === id) : undefined
      const wasUnread = target !== undefined && !target.read
      update(forUser, (current) => {
        if (!wasUnread) return current
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === id ? { ...item, read: true, readAt: new Date().toISOString() } : item,
          ),
          unreadCount: Math.max(0, current.unreadCount - 1),
        }
      })
      try {
        const updated = await markNotificationRead(id)
        update(forUser, (current) => ({
          ...current,
          items: current.items.map((item) => (item.id === id ? updated : item)),
        }))
      } catch (error) {
        update(forUser, (current) => ({
          ...current,
          notSynced: current.notSynced || isNotSynced(error),
          items: wasUnread
            ? current.items.map((item) => (item.id === id ? { ...item, read: false, readAt: null } : item))
            : current.items,
          unreadCount: wasUnread ? current.unreadCount + 1 : current.unreadCount,
        }))
        throw error
      }
    },
    [update, userId],
  )

  const markAllRead = useCallback(async () => {
    if (!userId) return
    const forUser = userId
    const latest = stateRef.current
    const saved =
      latest.userId === forUser
        ? {
            unreadIds: new Set(latest.items.filter((item) => !item.read).map((item) => item.id)),
            unreadCount: latest.unreadCount,
          }
        : null
    if (saved && saved.unreadCount === 0 && saved.unreadIds.size === 0) return
    update(forUser, (current) => {
      const readAt = new Date().toISOString()
      return {
        ...current,
        items: current.items.map((item) => (item.read ? item : { ...item, read: true, readAt })),
        unreadCount: 0,
      }
    })
    try {
      await markAllNotificationsRead()
    } catch (error) {
      update(forUser, (current) => ({
        ...current,
        notSynced: current.notSynced || isNotSynced(error),
        items: saved
          ? current.items.map((item) =>
              saved.unreadIds.has(item.id) ? { ...item, read: false, readAt: null } : item,
            )
          : current.items,
        unreadCount: saved ? current.unreadCount + saved.unreadCount : current.unreadCount,
      }))
      throw error
    }
  }, [update, userId])

  const isCurrentUser = userId !== null && state.userId === userId
  const current = isCurrentUser ? state : userId === null ? SIGNED_OUT_STATE : emptyState(userId)

  const value = useMemo<NotificationsContextValue>(
    () => ({
      isActive: userId !== null,
      items: current.items,
      unreadCount: current.unreadCount,
      isLoading: userId !== null && (current.isLoading || (!current.loaded && !current.error && !current.notSynced)),
      error: current.error,
      notSynced: current.notSynced,
      refresh,
      markRead,
      markAllRead,
    }),
    [userId, current, refresh, markRead, markAllRead],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
