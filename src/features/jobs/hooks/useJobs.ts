import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { searchJobs } from '../api/jobs.api'
import type { JobSearchParams, JobSearchResult } from '../types/job.types'

type JobsState = {
  requestKey: string | null
  result: JobSearchResult
  error: string | null
}

const emptyResult: JobSearchResult = { jobs: [], total: 0 }

const initialState: JobsState = {
  requestKey: null,
  result: emptyResult,
  error: null,
}

function getJobsError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải danh sách việc làm. Vui lòng thử lại.'
}

export function useJobs(params: JobSearchParams) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const { keyword, page, size } = params
  const requestKey = JSON.stringify([keyword, page, size, requestVersion])

  useEffect(() => {
    const controller = new AbortController()

    void searchJobs({ keyword, page, size }, controller.signal)
      .then((result) => {
        setState({ requestKey, result, error: null })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ requestKey, result: emptyResult, error: getJobsError(error) })
      })

    return () => controller.abort()
  }, [keyword, page, size, requestKey])

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  const isCurrent = state.requestKey === requestKey
  return {
    ...(isCurrent ? state.result : emptyResult),
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    retry,
  }
}
