import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import styles from './CareerChat.module.css'

const MAX_TEXTAREA_HEIGHT = 200
// Bỏ qua click Dừng ngay sau khi bắt đầu stream (double-click Gửi trúng nút Dừng cùng vị trí).
const STOP_GUARD_MS = 400

type ChatComposerProps = {
  isStreaming?: boolean
  onSend: (content: string) => void
  onStop?: () => void
}

export function ChatComposer({ isStreaming = false, onSend, onStop }: ChatComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const streamStartedAtRef = useRef(0)
  const canSend = value.trim().length > 0 && !isStreaming

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
  }, [value])

  useEffect(() => {
    if (isStreaming) streamStartedAtRef.current = performance.now()
  }, [isStreaming])

  const handleStop = () => {
    if (performance.now() - streamStartedAtRef.current < STOP_GUARD_MS) return
    onStop?.()
  }

  const submit = () => {
    if (!canSend) return
    onSend(value)
    setValue('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <div className={styles.composerBox}>
        <textarea
          ref={textareaRef}
          className={styles.composerInput}
          rows={1}
          value={value}
          placeholder="Hỏi JobBeacon Agent về việc làm, CV, mức lương…"
          aria-label="Nhập tin nhắn"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {isStreaming ? (
          // Đang stream: nút gửi thành nút Dừng (vẫn gõ trước được tin tiếp theo).
          <button
            className={`${styles.sendButton} ${styles.stopButton}`}
            type="button"
            onClick={handleStop}
            aria-label="Dừng trả lời"
            title="Dừng"
          >
            <Square aria-hidden="true" />
          </button>
        ) : (
          <button className={styles.sendButton} type="submit" disabled={!canSend} aria-label="Gửi tin nhắn">
            <ArrowUp aria-hidden="true" />
          </button>
        )}
      </div>
      <p className={styles.composerHint}>JobBeacon Agent có thể mắc lỗi. Hãy kiểm tra lại các thông tin quan trọng.</p>
    </form>
  )
}
