import { useEffect, useRef } from 'react'
import type { ChatMessage as ChatMessageModel } from '../types/career-chat.types'
import { ChatMessage, ChatTypingIndicator } from './ChatMessage'
import styles from './CareerChat.module.css'

type ChatThreadProps = {
  messages: ChatMessageModel[]
  isPending: boolean
}

export function ChatThread({ messages, isPending }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isPending])

  return (
    <div className={styles.thread}>
      <div className={styles.threadInner}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isPending && <ChatTypingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  )
}
