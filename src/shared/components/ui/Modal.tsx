import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

type ConfirmModalProps = {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  /** `danger` cho thao tác xóa, `primary` cho cảnh báo thông thường. */
  tone?: 'danger' | 'primary'
  icon?: ReactNode
  /** Đang xử lý: khóa nút và không cho đóng. */
  isBusy?: boolean
  busyLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Hủy',
  tone = 'primary',
  icon,
  isBusy = false,
  busyLabel = 'Đang xử lý…',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Trả focus về phần tử đã mở modal khi đóng.
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isBusy, onCancel])

  // Giữ Tab trong modal.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)')
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} onClick={isBusy ? undefined : onCancel}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {icon ? (
          <span className={`${styles.icon} ${tone === 'danger' ? styles.iconDanger : ''}`} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <h2 id={titleId}>{title}</h2>
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
        <div className={styles.actions}>
          <button ref={cancelButtonRef} className={styles.cancel} type="button" disabled={isBusy} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`${styles.confirm} ${tone === 'danger' ? styles.confirmDanger : ''}`}
            type="button"
            disabled={isBusy}
            onClick={onConfirm}
          >
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
