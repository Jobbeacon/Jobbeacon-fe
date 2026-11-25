import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getJobDetail, getSimilarJobs } from '../api/jobs.api'
import type { JobDetail, JobSummary } from '../types/job.types'

type JobDetailState = {
  requestKey: string | null
  job: JobDetail | null
  similarJobs: JobSummary[]
  error: string | null
}

const initialState: JobDetailState = {
  requestKey: null,
  job: null,
  similarJobs: [],
  error: null,
}

function getJobDetailError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải thông tin việc làm. Vui lòng thử lại.'
}

export function useJobDetail(jobId: string) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const requestKey = `${jobId}:${requestVersion}`

  useEffect(() => {
    const controller = new AbortController()

    void getJobDetail(jobId, controller.signal)
      .then((job) => {
        if (controller.signal.aborted) return
        setState({ requestKey, job, similarJobs: [], error: null })

        // Danh sách tương tự chỉ là phần phụ: tải sau, lỗi thì bỏ qua để trang chi tiết vẫn hiển thị.
        void getSimilarJobs(job, controller.signal)
          .then((similarJobs) => {
            if (controller.signal.aborted) return
            setState((current) => (current.requestKey === requestKey ? { ...current, similarJobs } : current))
          })
          .catch(() => undefined)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ ...initialState, requestKey, error: getJobDetailError(error) })
      })

    return () => controller.abort()
  }, [jobId, requestKey])

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  // Chỉ hiển thị kết quả của request hiện tại; khi đổi jobId hoặc retry thì coi như đang tải.
  const isCurrent = state.requestKey === requestKey
  return {
    job: isCurrent ? state.job : null,
    similarJobs: isCurrent ? state.similarJobs : [],
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    retry,
  }
}
