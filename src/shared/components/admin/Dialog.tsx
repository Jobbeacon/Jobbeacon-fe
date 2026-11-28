import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

type DialogProps = {
  open: boolean
  onClose: () => void
  // "drawer", "drawer wide", "modal", "modal form-modal"
  className?: string
  labelledBy?: string
  // Drawer kéo được mép trái để đổi độ rộng + nút phóng to; độ rộng nhớ theo key này.
  resizeKey?: string
  children: ReactNode
}

const MIN_WIDTH = 420

function readWidth(key: string | undefined) {
  if (!key) return null
  try {
    const value = Number(window.localStorage.getItem(`admin-drawer-width:${key}`))
    return Number.isFinite(value) && value >= MIN_WIDTH ? value : null
  } catch {
    return null
  }
}

function saveWidth(key: string, width: number | null) {
  try {
    if (width === null) window.localStorage.removeItem(`admin-drawer-width:${key}`)
    else window.localStorage.setItem(`admin-drawer-width:${key}`, String(Math.round(width)))
  } catch {
    // Không lưu được (chế độ riêng tư...) thì thôi.
  }
}

const clampWidth = (value: number) => Math.min(Math.max(value, MIN_WIDTH), window.innerWidth)

// Bọc <dialog> native: showModal() khi open, đóng khi bấm nền hoặc Esc (gọi onClose).
export function Dialog({ open, onClose, className, labelledBy, resizeKey, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [width, setWidth] = useState<number | null>(() => readWidth(resizeKey))
  const [dragging, setDragging] = useState(false)
  const maximized = width !== null && width >= window.innerWidth - 1

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!resizeKey) return
    event.preventDefault()
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    setDragging(true)
    let latest = width
    const move = (moveEvent: PointerEvent) => {
      // Drawer bám mép phải: độ rộng = khoảng từ con trỏ tới mép phải màn hình.
      latest = clampWidth(window.innerWidth - moveEvent.clientX)
      setWidth(latest)
    }
    const stop = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
      handle.removeEventListener('pointercancel', stop)
      setDragging(false)
      saveWidth(resizeKey, latest)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
    handle.addEventListener('pointercancel', stop)
  }

  const toggleMaximize = () => {
    if (!resizeKey) return
    const next = maximized ? null : window.innerWidth
    setWidth(next)
    saveWidth(resizeKey, next)
  }
  const openRef = useRef(open)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    openRef.current = open
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Đóng do trình duyệt (form method="dialog"...) mà prop vẫn open → báo cho cha.
  const handleNativeClose = () => {
    if (openRef.current) {
      onCloseRef.current()
    }
  }

  return (
    <dialog
      ref={ref}
      className={[className, resizeKey ? 'is-resizable' : '', dragging ? 'is-resizing' : ''].filter(Boolean).join(' ')}
      style={resizeKey && width !== null ? { width: maximized ? '100vw' : `${width}px` } : undefined}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        // Esc: để cha quyết định đóng.
        event.preventDefault()
        onCloseRef.current()
      }}
      onClose={handleNativeClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current()
        }
      }}
    >
      {open && resizeKey ? (
        <>
          <div
            className="drawer-resize"
            role="separator"
            aria-orientation="vertical"
            aria-label="Kéo để đổi độ rộng"
            title="Kéo để đổi độ rộng · bấm đúp để phóng to"
            onPointerDown={startResize}
            onDoubleClick={toggleMaximize}
          />
          <button
            className="icon-btn drawer-maximize"
            type="button"
            onClick={toggleMaximize}
            aria-label={maximized ? 'Thu nhỏ' : 'Phóng to toàn màn hình'}
            title={maximized ? 'Thu nhỏ' : 'Phóng to toàn màn hình'}
          >
            {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </>
      ) : null}
      {open ? children : null}
    </dialog>
  )
}
