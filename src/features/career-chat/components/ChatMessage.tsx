import { Bot } from 'lucide-react'
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

type ChatMessageProps = {
  message: ChatMessageModel
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className={`${styles.messageRow} ${styles.userRow}`}>
        <div className={styles.userBubble}>{message.content}</div>
      </div>
    )
  }

  return (
    <div className={styles.messageRow}>
      <span className={styles.agentAvatar} aria-hidden="true"><Bot /></span>
      {message.isError ? (
        <div className={`${styles.agentContent} ${styles.errorContent}`}>{message.content}</div>
      ) : (
        <div className={`${styles.agentContent} ${styles.markdown}`}>
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}

export function ChatTypingIndicator() {
  return (
    <div className={styles.messageRow} role="status" aria-label="JobBeacon Agent đang trả lời">
      <span className={styles.agentAvatar} aria-hidden="true"><Bot /></span>
      <div className={styles.typing}>
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
