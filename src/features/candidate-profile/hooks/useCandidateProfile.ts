import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getCurrentUserProfile } from '../api/candidate-profile.api'
import type { UserProfile } from '../types/candidate-profile.types'

type ProfileState = {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  isLoading: true,
  error: null,
}

function getProfileError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải thông tin người dùng. Vui lòng thử lại.'
}

export function useCandidateProfile() {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    void getCurrentUserProfile(controller.signal)
      .then((profile) => {
        setState({ profile, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ profile: null, isLoading: false, error: getProfileError(error) })
      })

    return () => controller.abort()
  }, [requestVersion])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    setRequestVersion((current) => current + 1)
  }, [])

  return { ...state, retry }
}
