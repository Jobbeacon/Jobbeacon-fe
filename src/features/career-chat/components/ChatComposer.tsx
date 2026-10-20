import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import styles from './CareerChat.module.css'

const MAX_TEXTAREA_HEIGHT = 200

type ChatComposerProps = {
  disabled?: boolean
  onSend: (content: string) => void
}

export function ChatComposer({ disabled = false, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = value.trim().length > 0 && !disabled

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
  }, [value])

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
        <button className={styles.sendButton} type="submit" disabled={!canSend} aria-label="Gửi tin nhắn">
          <ArrowUp aria-hidden="true" />
        </button>
      </div>
      <p className={styles.composerHint}>JobBeacon Agent có thể mắc lỗi. Hãy kiểm tra lại các thông tin quan trọng.</p>
    </form>
  )
}
