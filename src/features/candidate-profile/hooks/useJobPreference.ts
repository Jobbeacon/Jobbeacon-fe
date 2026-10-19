import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getJobPreference, updateJobPreference } from '../api/candidate-profile.api'
import type { JobPreference, JobPreferenceRequestDto } from '../types/candidate-profile.types'

type JobPreferenceState = {
  preference: JobPreference | null
  isLoading: boolean
  error: string | null
}

const initialState: JobPreferenceState = {
  preference: null,
  isLoading: true,
  error: null,
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useJobPreference() {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    void getJobPreference(controller.signal)
      .then((preference) => {
        setState({ preference, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState({
          preference: null,
          isLoading: false,
          error: getErrorMessage(error, 'Không thể tải sở thích tìm việc. Vui lòng thử lại.'),
        })
      })

    return () => controller.abort()
  }, [requestVersion])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    setRequestVersion((current) => current + 1)
  }, [])

  /** Trả về null nếu lưu thành công, ngược lại là thông báo lỗi. */
  const save = useCallback(async (request: JobPreferenceRequestDto) => {
    setIsSaving(true)
    try {
      const preference = await updateJobPreference(request)
      setState({ preference, isLoading: false, error: null })
      return null
    } catch (error) {
      return getErrorMessage(error, 'Không thể lưu sở thích tìm việc. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { ...state, retry, save, isSaving }
}
