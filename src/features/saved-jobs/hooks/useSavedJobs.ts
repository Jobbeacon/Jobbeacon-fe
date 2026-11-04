import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getSavedJobs } from '../api/saved-jobs.api'
import type { SavedJobsResult } from '../types/saved-job.types'

type SavedJobsState = {
  requestKey: string | null
  result: SavedJobsResult
  error: string | null
}

const initialState: SavedJobsState = {
  requestKey: null,
  result: { jobs: [], total: 0 },
  error: null,
}

function getSavedJobsError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải danh sách việc làm đã lưu. Vui lòng thử lại.'
}

export function useSavedJobs(page: number, size: number) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const requestKey = JSON.stringify({ page, size, requestVersion })

  useEffect(() => {
    const controller = new AbortController()
    const query = JSON.parse(requestKey) as { page: number; size: number }

    void getSavedJobs(query, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setState({ requestKey, result, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return
        }
        setState((current) => ({ requestKey, result: current.result, error: getSavedJobsError(error) }))
      })

    return () => controller.abort()
  }, [requestKey])

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  const isCurrent = state.requestKey === requestKey
  return {
    jobs: state.result.jobs,
    total: state.result.total,
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    retry,
  }
}
