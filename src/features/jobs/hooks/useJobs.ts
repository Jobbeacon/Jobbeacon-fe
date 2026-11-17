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
  const requestKey = JSON.stringify({ ...params, requestVersion })

  useEffect(() => {
    const controller = new AbortController()
    const query = JSON.parse(requestKey) as JobSearchParams & { requestVersion?: number }
    delete query.requestVersion

    void searchJobs(query, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setState({ requestKey, result, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return
        }
        setState((current) => ({
          requestKey,
          result: current.result,
          error: getJobsError(error),
        }))
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
    isInitialLoading: state.requestKey === null,
    retry,
  }
}
