import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getRecommendedJobs } from '../api/recommendations.api'
import type { RecommendedJobsResult } from '../types/recommendation.types'

type RecommendationsState = {
  requestKey: string | null
  result: RecommendedJobsResult
  error: string | null
}

const emptyResult: RecommendedJobsResult = { jobs: [], personalized: true, matchedSkills: {} }

const initialState: RecommendationsState = {
  requestKey: null,
  result: emptyResult,
  error: null,
}

function getRecommendationsError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải việc làm gợi ý. Vui lòng thử lại.'
}

export function useRecommendations(size: number) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const requestKey = JSON.stringify({ size, requestVersion })

  useEffect(() => {
    const controller = new AbortController()
    const query = JSON.parse(requestKey) as { size: number }

    void getRecommendedJobs(query.size, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setState({ requestKey, result, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return
        }
        setState({ requestKey, result: emptyResult, error: getRecommendationsError(error) })
      })

    return () => controller.abort()
  }, [requestKey])

  // Tải lại cũng là xáo lại: server trả danh sách khác ở mỗi lần gọi.
  const reload = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  const isCurrent = state.requestKey === requestKey
  return {
    jobs: state.result.jobs,
    personalized: state.result.personalized,
    matchedSkills: state.result.matchedSkills,
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    reload,
  }
}
