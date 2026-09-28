import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getLatestJobs } from '../../jobs/api/jobs.api'
import type { JobSummary } from '../../jobs/types/job.types'

type LatestJobsState = {
  requestVersion: number | null
  jobs: JobSummary[]
  error: string | null
}

const initialState: LatestJobsState = {
  requestVersion: null,
  jobs: [],
  error: null,
}

function getLatestJobsError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải việc làm mới nhất.'
}

export function useLatestJobs(limit: number) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    void getLatestJobs(limit, controller.signal)
      .then((jobs) => {
        setState({ requestVersion, jobs, error: null })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ requestVersion, jobs: [], error: getLatestJobsError(error) })
      })

    return () => controller.abort()
  }, [limit, requestVersion])

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  const isCurrent = state.requestVersion === requestVersion
  return {
    jobs: isCurrent ? state.jobs : [],
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    retry,
  }
}
