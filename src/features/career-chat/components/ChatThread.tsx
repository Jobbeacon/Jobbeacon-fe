import { useEffect, useRef, type UIEvent } from 'react'
import type { ChatMessage as ChatMessageModel } from '../types/career-chat.types'
import { ChatMessage } from './ChatMessage'
import styles from './CareerChat.module.css'

// Cách đáy dưới ngưỡng này thì coi như đang ở cuối thread.
const STICK_THRESHOLD = 80

type ChatThreadProps = {
  messages: ChatMessageModel[]
  onRetry?: (messageId: string) => void
  isStreaming?: boolean
}

export function ChatThread({ messages, onRetry, isStreaming = false }: ChatThreadProps) {
  const threadRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)
  const lastScrollTopRef = useRef(0)
  const messageCountRef = useRef(0)

  // Chỉ bỏ bám đáy khi user cuộn lên; smooth scroll xuống hoặc nội dung dài thêm không tính.
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    if (distanceToBottom <= STICK_THRESHOLD) {
      stickToBottomRef.current = true
    } else if (scrollTop < lastScrollTopRef.current) {
      stickToBottomRef.current = false
    }
    lastScrollTopRef.current = scrollTop
  }

  // Chạy cả khi nội dung tin cuối thay đổi (messages đổi identity mỗi lần flush delta).
  useEffect(() => {
    const thread = threadRef.current
    if (!thread) return

    const hasNewMessage = messages.length > messageCountRef.current
    messageCountRef.current = messages.length
    // Tin mới (user vừa gửi) thì luôn kéo xuống.
    if (hasNewMessage) stickToBottomRef.current = true
    if (!stickToBottomRef.current) return

    thread.scrollTo({ top: thread.scrollHeight, behavior: hasNewMessage ? 'smooth' : 'auto' })
  }, [messages])

  return (
    <div ref={threadRef} className={styles.thread} onScroll={handleScroll}>
      <div className={styles.threadInner}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onRetry={onRetry} isRetryDisabled={isStreaming} />
        ))}
      </div>
    </div>
  )
}
