import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import {
  deleteCvProfile,
  deleteCvProfileSkill,
  extractCvProfile,
  getCvProfile,
} from '../api/candidate-profile.api'
import type { CvProfile } from '../types/candidate-profile.types'

type CvProfileState = {
  profile: CvProfile | null
  isLoading: boolean
  error: string | null
}

export type CvActionError = {
  message: string
  retryable: boolean
}

const initialState: CvProfileState = {
  profile: null,
  isLoading: true,
  error: null,
}

const RETRYABLE_CODES = new Set(['cv_model_timeout', 'cv_model_error'])

function toActionError(error: unknown, fallback: string): CvActionError {
  if (error instanceof ApiError) {
    return { message: error.message, retryable: RETRYABLE_CODES.has(String(error.code)) }
  }
  return { message: fallback, retryable: true }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useCvProfile() {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    void getCvProfile(controller.signal)
      .then((profile) => {
        setState({ profile, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState({
          profile: null,
          isLoading: false,
          error: error instanceof ApiError ? error.message : 'Không thể tải CV. Vui lòng thử lại.',
        })
      })

    return () => controller.abort()
  }, [requestVersion])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    setRequestVersion((current) => current + 1)
  }, [])

  /** Trả về null nếu thành công, ngược lại là lỗi. */
  const upload = useCallback(async (file: File) => {
    setIsUploading(true)
    try {
      const profile = await extractCvProfile(file)
      setState({ profile, isLoading: false, error: null })
      return null
    } catch (error) {
      return toActionError(error, 'Không thể xử lý CV. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const remove = useCallback(async () => {
    setIsDeleting(true)
    try {
      await deleteCvProfile()
      setState({ profile: null, isLoading: false, error: null })
      return null
    } catch (error) {
      return toActionError(error, 'Không thể xóa CV. Vui lòng thử lại.')
    } finally {
      setIsDeleting(false)
    }
  }, [])

  // Cập nhật lạc quan, khôi phục nếu API lỗi.
  const removeSkill = useCallback(
    async (skillId: string) => {
      const previous = state.profile
      if (!previous) return null

      setState((current) =>
        current.profile
          ? {
              ...current,
              profile: {
                ...current.profile,
                skills: current.profile.skills.filter((skill) => skill.skillId !== skillId),
              },
            }
          : current,
      )

      try {
        await deleteCvProfileSkill(skillId)
        return null
      } catch (error) {
        // Skill đã không còn trong profile thì giữ trạng thái đã xóa.
        if (error instanceof ApiError && error.code === 'cv_profile_skill_not_found') return null
        setState((current) => ({ ...current, profile: previous }))
        return toActionError(error, 'Không thể xóa kỹ năng. Vui lòng thử lại.')
      }
    },
    [state.profile],
  )

  return { ...state, retry, upload, isUploading, remove, isDeleting, removeSkill }
}
