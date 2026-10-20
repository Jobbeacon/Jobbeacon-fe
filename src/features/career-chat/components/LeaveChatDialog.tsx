import { useEffect, useRef } from 'react'
import { LogOut } from 'lucide-react'
import styles from './CareerChat.module.css'

type LeaveChatDialogProps = {
  open: boolean
  isLeaving: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function LeaveChatDialog({ open, isLeaving, onConfirm, onCancel }: LeaveChatDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLeaving) onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isLeaving, onCancel])

  if (!open) return null

  return (
    <div className={styles.dialogBackdrop} onClick={isLeaving ? undefined : onCancel}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-chat-title"
        aria-describedby="leave-chat-description"
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.dialogIcon} aria-hidden="true"><LogOut /></span>
        <h2 id="leave-chat-title">Rời khỏi cuộc trò chuyện?</h2>
        <p id="leave-chat-description">
          Bạn có chắc muốn rời khỏi cuộc trò chuyện? Toàn bộ nội dung trò chuyện sẽ bị xóa và không thể khôi phục.
        </p>
        <div className={styles.dialogActions}>
          <button
            ref={cancelButtonRef}
            className={styles.dialogCancel}
            type="button"
            disabled={isLeaving}
            onClick={onCancel}
          >
            Ở lại
          </button>
          <button className={styles.dialogConfirm} type="button" disabled={isLeaving} onClick={onConfirm}>
            {isLeaving ? 'Đang rời…' : 'Rời đi'}
          </button>
        </div>
      </div>
    </div>
  )
}
