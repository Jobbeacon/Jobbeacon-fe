import { useCallback, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ConfirmContext } from './confirm-context'
import type { ConfirmOptions } from './confirm-context'
import { Dialog } from './Dialog'

type Pending = ConfirmOptions & { resolve: (value: boolean) => void }

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null)
  const pendingRef = useRef<Pending | null>(null)
  const titleId = useId()

  const settle = useCallback((result: boolean) => {
    pendingRef.current?.resolve(result)
    pendingRef.current = null
    setPending(null)
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    // Có hộp thoại đang mở thì coi như hủy hộp cũ.
    pendingRef.current?.resolve(false)
    return new Promise<boolean>((resolve) => {
      const next = { ...options, resolve }
      pendingRef.current = next
      setPending(next)
    })
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={pending !== null} onClose={() => settle(false)} className="modal" labelledBy={titleId}>
        {pending ? (
          <form
            method="dialog"
            onSubmit={(event) => {
              event.preventDefault()
              settle(true)
            }}
          >
            <div className="modal-bar">
              <h2 id={titleId}>{pending.title}</h2>
            </div>
            <p>{pending.copy}</p>
            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={() => settle(false)}>
                {pending.cancel ?? 'Giữ lại'}
              </button>
              <button className="btn danger" type="submit">
                {pending.ok ?? 'Xóa'}
              </button>
            </div>
          </form>
        ) : null}
      </Dialog>
    </ConfirmContext.Provider>
  )
}
