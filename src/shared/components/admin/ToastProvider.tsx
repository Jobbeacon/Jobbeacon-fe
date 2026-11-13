import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './toast-context'

const TOAST_DURATION = 2400

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)

  const toast = useCallback((text: string) => {
    setMessage(text)
    setVisible(true)
    // Dùng popover để toast nằm trên cả <dialog> đang mở (top layer); mở lại để lên lớp trên cùng.
    const node = nodeRef.current
    if (node?.showPopover) {
      try {
        if (node.matches(':popover-open')) {
          node.hidePopover()
        }
        node.showPopover()
      } catch {
        // Trình duyệt cũ: vẫn hiện bằng data-show.
      }
    }
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setVisible(false)
      try {
        if (nodeRef.current?.matches(':popover-open')) {
          nodeRef.current.hidePopover()
        }
      } catch {
        // bỏ qua
      }
    }, TOAST_DURATION)
  }, [])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div id="toast" ref={nodeRef} role="status" popover="manual" data-show={visible ? '1' : undefined}>
        {message}
      </div>
    </ToastContext.Provider>
  )
}
