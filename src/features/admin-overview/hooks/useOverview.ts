import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getOverview } from '../api/overview.api'
import type { Overview } from '../types/overview.types'

type State = {
  requestKey: string | null
  data: Overview | null
  error: string | null
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useOverview(days: number) {
  const [state, setState] = useState<State>({ requestKey: null, data: null, error: null })
  const [version, setVersion] = useState(0)
  const requestKey = `${days}:${version}`

  useEffect(() => {
    const controller = new AbortController()
    getOverview(days, controller.signal)
      .then((data) => setState({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (isAbort(error)) {
          return
        }
        const message = error instanceof ApiError ? error.message : 'Không tải được số liệu crawl.'
        setState({ requestKey, data: null, error: message })
      })
    return () => controller.abort()
  }, [days, requestKey])

  const retry = useCallback(() => setVersion((current) => current + 1), [])

  return {
    data: state.data,
    error: state.requestKey === requestKey ? state.error : null,
    loading: state.requestKey !== requestKey,
    retry,
  }
}
