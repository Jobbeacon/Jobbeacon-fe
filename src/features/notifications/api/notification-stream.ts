import { ApiError, authorizedFetch } from '../../../shared/api/api-client'
import { NOTIFICATION_ENDPOINTS } from '../../../shared/api/api-endpoints'
import { readSseEvents } from '../../../shared/api/sse'
import type { AppNotification } from '../types/notification.types'
import { toNotification, type NotificationViewApiDto } from './notifications.api'

const INITIAL_BACKOFF_MS = 1_000
const MAX_BACKOFF_MS = 30_000
// User chưa được đồng bộ sang service notification: chờ lâu hơn trước khi thử lại.
const USER_NOT_SYNCED_BACKOFF_MS = 60_000

export type NotificationStreamError = {
  status: number | null
  code: string | null
  // true khi đã dừng hẳn (vd. 401 sau khi đã retry token), không reconnect nữa.
  fatal: boolean
  cause?: unknown
}

export type NotificationStreamHandlers = {
  // Kết nối đã mở: người gọi nên refetch danh sách + unread-count.
  onOpen?: () => void
  onNotification?: (notification: AppNotification) => void
  onError?: (error: NotificationStreamError) => void
}

export type NotificationStreamHandle = {
  close: () => void
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function waitFor(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve()
    const onAbort = () => {
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

// Mở stream SSE thông báo, tự reconnect với backoff luỹ thừa; dừng qua close() hoặc signal.
export function openNotificationStream(
  handlers: NotificationStreamHandlers,
  signal?: AbortSignal,
): NotificationStreamHandle {
  const controller = new AbortController()
  const close = () => controller.abort()
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', close, { once: true })
  }
  const ownSignal = controller.signal

  const run = async () => {
    let backoff = INITIAL_BACKOFF_MS

    while (!ownSignal.aborted) {
      let delay = backoff
      try {
        const response = await authorizedFetch(NOTIFICATION_ENDPOINTS.stream, {
          headers: { Accept: 'text/event-stream' },
          signal: ownSignal,
        })

        if (!response.ok || !response.body) {
          response.body?.cancel().catch(() => undefined)
          const code = response.headers.get('X-Error-Code')
          if (response.status === 401) {
            // authorizedFetch đã retry với token mới mà vẫn 401: dừng hẳn.
            handlers.onError?.({ status: 401, code, fatal: true })
            return
          }
          if (response.status === 404 && code === 'user_not_synced') {
            delay = USER_NOT_SYNCED_BACKOFF_MS
          } else {
            backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
          }
          handlers.onError?.({ status: response.status, code, fatal: false })
        } else {
          // Mở thành công: reset backoff.
          backoff = INITIAL_BACKOFF_MS
          delay = backoff
          handlers.onOpen?.()

          // readSseEvents đã bỏ qua comment (:connected, :ping).
          for await (const sseEvent of readSseEvents(response.body, ownSignal)) {
            if (sseEvent.event !== 'notification.created') continue
            try {
              const dto = JSON.parse(sseEvent.data) as NotificationViewApiDto
              handlers.onNotification?.(toNotification(dto))
            } catch {
              // Bỏ qua event hỏng; DB vẫn là nguồn chính, refetch khi reconnect.
            }
          }
          // Server đóng stream: reconnect sau backoff ban đầu.
          backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
        }
      } catch (error) {
        if (ownSignal.aborted || isAbortError(error)) return
        if (error instanceof ApiError && error.status === 401) {
          // Không lấy được token (chưa đăng nhập): dừng hẳn.
          handlers.onError?.({ status: 401, code: null, fatal: true, cause: error })
          return
        }
        handlers.onError?.({ status: null, code: null, fatal: false, cause: error })
        backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
      }

      await waitFor(delay, ownSignal)
    }
  }

  void run().finally(() => signal?.removeEventListener('abort', close))

  return { close }
}
