import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { clearAgentSession, streamAgentMessage } from '../api/career-chat.api'
import type { AgentToolCallEvent, ChatMessage } from '../types/career-chat.types'

const FALLBACK_ERROR = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERN: 'Thực tập',
}

let messageSequence = 0

// Không dùng crypto.randomUUID vì không có trên trang http (không phải secure context).
function createId() {
  messageSequence += 1
  return `${Date.now().toString(36)}-${messageSequence}`
}

function toErrorMessage(error: unknown) {
  return error instanceof ApiError && error.message ? error.message : FALLBACK_ERROR
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError'
}

// Args do model sinh ra: đọc cả camelCase lẫn snake_case cho chắc.
function readArg(args: Record<string, unknown>, camelKey: string, snakeKey: string) {
  return args[camelKey] ?? args[snakeKey]
}

function toTextList(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value]
  return values
    .filter((item): item is string | number => typeof item === 'string' || typeof item === 'number')
    .map((item) => String(item).trim())
    .filter(Boolean)
}

function formatSalary(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return amount >= 1_000_000 ? `${Number((amount / 1_000_000).toFixed(1))} triệu` : amount.toLocaleString('vi-VN')
}

function describeSearchJobs(args: Record<string, unknown>) {
  const minSalary = formatSalary(readArg(args, 'minSalary', 'min_salary'))
  const maxSalary = formatSalary(readArg(args, 'maxSalary', 'max_salary'))
  const salary =
    minSalary && maxSalary
      ? `${minSalary} – ${maxSalary}`
      : minSalary
        ? `từ ${minSalary}`
        : maxSalary
          ? `đến ${maxSalary}`
          : null

  const parts = [
    ...toTextList(args.keywords),
    ...toTextList(args.skills),
    ...toTextList(args.province),
    ...toTextList(args.categories),
    ...toTextList(readArg(args, 'employmentTypes', 'employment_types')).map(
      (type) => EMPLOYMENT_TYPE_LABELS[type] ?? type,
    ),
    ...(salary ? [salary] : []),
  ]

  return parts.length > 0 ? `Đang tìm việc: ${[...new Set(parts)].join(' · ')}` : 'Đang tìm việc…'
}

function describeToolCall({ name, args }: AgentToolCallEvent) {
  switch (name) {
    case 'search_jobs':
      return describeSearchJobs(args)
    case 'get_job_detail':
      return 'Đang xem chi tiết tin tuyển dụng…'
    default:
      return 'Đang xử lý…'
  }
}

export function useCareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  // Tăng mỗi lần gửi/huỷ: callback của request cũ sẽ bị bỏ qua.
  const requestIdRef = useRef(0)
  const deltaBufferRef = useRef('')
  const frameRef = useRef<number | null>(null)
  // Đọc messages mới nhất trong retry mà không làm retry đổi identity (ChatMessage được memo).
  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  // Huỷ request đang chạy (nếu có) và bỏ mọi callback đến muộn.
  const abortActive = useCallback(() => {
    requestIdRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
    cancelFrame()
    deltaBufferRef.current = ''
    setIsStreaming(false)
  }, [cancelFrame])

  useEffect(() => {
    clearAgentSession().catch(() => undefined)
    return abortActive
  }, [abortActive])

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim()
      if (!text || controllerRef.current) return

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      const controller = new AbortController()
      controllerRef.current = controller
      const assistantId = createId()

      const isCurrent = () => requestIdRef.current === requestId
      const updateAssistant = (patch: (message: ChatMessage) => Partial<ChatMessage>) =>
        setMessages((current) =>
          current.map((message) => (message.id === assistantId ? { ...message, ...patch(message) } : message)),
        )

      // Gom delta và chỉ cập nhật state mỗi frame để không render Markdown theo từng chunk.
      const flushDeltas = () => {
        cancelFrame()
        const chunk = deltaBufferRef.current
        deltaBufferRef.current = ''
        if (chunk) updateAssistant((message) => ({ content: message.content + chunk, activity: undefined }))
      }

      setMessages((current) => [
        ...current,
        { id: createId(), role: 'user', content: text },
        { id: assistantId, role: 'assistant', content: '', status: 'streaming' },
      ])
      setIsStreaming(true)

      try {
        const { toolCalls } = await streamAgentMessage(text, {
          signal: controller.signal,
          onToolCall: (toolCall) => {
            if (!isCurrent() || controller.signal.aborted) return
            flushDeltas()
            updateAssistant(() => ({ activity: describeToolCall(toolCall) }))
          },
          onDelta: (delta) => {
            if (!isCurrent() || controller.signal.aborted) return
            deltaBufferRef.current += delta
            if (frameRef.current === null) {
              frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null
                flushDeltas()
              })
            }
          },
        })
        if (!isCurrent()) return
        flushDeltas()
        updateAssistant(() => ({ status: 'done', activity: undefined, toolCalls }))
      } catch (error) {
        if (!isCurrent()) return
        flushDeltas()
        if (isAbortError(error)) {
          updateAssistant(() => ({ status: 'stopped', activity: undefined }))
        } else {
          updateAssistant(() => ({
            status: 'error',
            isError: true,
            activity: undefined,
            errorMessage: toErrorMessage(error),
            retryOf: text,
          }))
        }
      } finally {
        if (isCurrent()) {
          controllerRef.current = null
          setIsStreaming(false)
        }
      }
    },
    [cancelFrame],
  )

  // Nút Dừng: abort request, tin assistant chuyển sang 'stopped' (xử lý trong sendMessage).
  const stop = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  // Gửi lại: bỏ cặp tin user + assistant lỗi (BE không lưu lượt lỗi) rồi gửi lại nội dung cũ.
  const retry = useCallback(
    (messageId: string) => {
      if (controllerRef.current) return
      const messages = messagesRef.current
      const index = messages.findIndex((message) => message.id === messageId)
      const failed = messages[index]
      if (!failed?.retryOf) return

      const previous = messages[index - 1]
      const removedIds = new Set([failed.id])
      if (previous?.role === 'user' && previous.content === failed.retryOf) removedIds.add(previous.id)
      setMessages((current) => current.filter((message) => !removedIds.has(message.id)))
      void sendMessage(failed.retryOf)
    },
    [sendMessage],
  )

  const resetConversation = useCallback(async () => {
    abortActive()
    setMessages([])
    await clearAgentSession().catch(() => undefined)
  }, [abortActive])

  // Gọi khi người dùng xác nhận rời trang: huỷ stream, xóa session trên server, lỗi cũng không chặn việc rời đi.
  const leaveConversation = useCallback(() => {
    abortActive()
    return clearAgentSession().catch(() => undefined)
  }, [abortActive])

  return {
    messages,
    isStreaming,
    sendMessage,
    stop,
    retry,
    resetConversation,
    leaveConversation,
  }
}
