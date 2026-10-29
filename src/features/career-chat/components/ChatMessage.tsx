import { memo } from 'react'
import { Bot, LoaderCircle, RotateCcw } from 'lucide-react'
import Markdown, { type Components } from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import type { ChatMessage as ChatMessageModel } from '../types/career-chat.types'
import styles from './CareerChat.module.css'

const markdownComponents: Components = {
  a: ({ href = '', children }) =>
    href.startsWith('/') ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
}

const remarkPlugins = [remarkGfm]

type ChatMessageProps = {
  message: ChatMessageModel
  onRetry?: (messageId: string) => void
  // Đang có tin khác stream: chưa cho gửi lại
  isRetryDisabled?: boolean
}

function TypingDots() {
  return (
    <div className={styles.typing} role="status" aria-label="JobBeacon Agent đang trả lời">
      <span />
      <span />
      <span />
    </div>
  )
}

// Memo để khi stream chỉ tin đang chạy render lại Markdown.
export const ChatMessage = memo(function ChatMessage({ message, onRetry, isRetryDisabled = false }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className={`${styles.messageRow} ${styles.userRow}`}>
        <div className={styles.userBubble}>{message.content}</div>
      </div>
    )
  }

  const isStreaming = message.status === 'streaming'
  const isError = message.status === 'error' || message.isError
  // Khi lỗi vẫn giữ phần text đã nhận, thông báo lỗi hiện riêng bên dưới.
  const markdownText = message.content

  return (
    <div className={styles.messageRow}>
      <span className={styles.agentAvatar} aria-hidden="true"><Bot /></span>
      <div className={styles.agentContent}>
        {markdownText && (
          <div className={`${styles.markdown} ${isStreaming ? styles.streamingText : ''}`}>
            <Markdown remarkPlugins={remarkPlugins} components={markdownComponents}>
              {markdownText}
            </Markdown>
          </div>
        )}

        {isStreaming && message.activity && (
          <div className={styles.activity} role="status">
            <LoaderCircle aria-hidden="true" />
            <span>{message.activity}</span>
          </div>
        )}
        {isStreaming && !markdownText && !message.activity && <TypingDots />}

        {isError && (
          <div className={styles.errorBlock} role="alert">
            <p className={styles.errorContent}>{message.errorMessage || 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'}</p>
            {message.retryOf && onRetry && (
              <button
                className={styles.retryButton}
                type="button"
                disabled={isRetryDisabled}
                onClick={() => onRetry(message.id)}
              >
                <RotateCcw aria-hidden="true" />
                <span>Gửi lại</span>
              </button>
            )}
          </div>
        )}

        {message.status === 'stopped' && <span className={styles.stoppedLabel}>Đã dừng</span>}
      </div>
    </div>
  )
})
