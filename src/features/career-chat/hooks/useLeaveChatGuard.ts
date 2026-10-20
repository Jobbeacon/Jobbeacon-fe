import { useCallback, useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'

type UseLeaveChatGuardOptions = {
  enabled: boolean
  onConfirmLeave: () => Promise<unknown>
}

export function useLeaveChatGuard({ enabled, onConfirmLeave }: UseLeaveChatGuardOptions) {
  const [isLeaving, setIsLeaving] = useState(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => enabled && currentLocation.pathname !== nextLocation.pathname,
  )

  // Reload / đóng tab / gõ URL mới: trình duyệt chỉ cho hiện hộp thoại mặc định của nó.
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

  const confirmLeave = useCallback(async () => {
    if (blocker.state !== 'blocked') return
    setIsLeaving(true)
    try {
      await onConfirmLeave()
    } finally {
      setIsLeaving(false)
      blocker.proceed()
    }
  }, [blocker, onConfirmLeave])

  const cancelLeave = useCallback(() => {
    if (blocker.state === 'blocked') blocker.reset()
  }, [blocker])

  return {
    isConfirmOpen: blocker.state === 'blocked',
    isLeaving,
    confirmLeave,
    cancelLeave,
  }
}
