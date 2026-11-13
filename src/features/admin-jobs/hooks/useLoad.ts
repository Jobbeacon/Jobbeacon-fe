import { useEffect, useState } from 'react'

type Loader<T> = (signal: AbortSignal) => Promise<T>

type LoadState<T> = {
  load?: Loader<T>
  reloadKey?: number
  data?: T
  error?: string
}

// Gọi loader mỗi khi loader (memo bằng useCallback) hoặc reloadKey đổi; hủy request cũ để chống race.
// Giữ data lần trước trong lúc đang tải lại.
export function useLoad<T>(load: Loader<T>, reloadKey = 0) {
  const [state, setState] = useState<LoadState<T>>({})

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => setState({ load, reloadKey, data }),
      (error: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        const message = error instanceof Error ? error.message : 'Không tải được dữ liệu.'
        setState((prev) => ({ load, reloadKey, data: prev.data, error: message }))
      },
    )
    return () => controller.abort()
  }, [load, reloadKey])

  const current = state.load === load && state.reloadKey === reloadKey
  return {
    data: state.data,
    error: current ? state.error : undefined,
    loading: !current,
  }
}
