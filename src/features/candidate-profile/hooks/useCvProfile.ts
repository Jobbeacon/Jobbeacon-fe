import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import {
  addCvProfileSkill,
  deleteCvProfile,
  deleteCvProfileSkill,
  extractCvProfile,
  getCvProfile,
  getCvProfileSkills,
} from '../api/candidate-profile.api'
import type { CvProfile, CvProfileSkills, SkillSearchItem } from '../types/candidate-profile.types'

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

// Profile backend tự tạo khi thêm skill lúc chưa có profile: chỉ có skill, các trường CV rỗng.
function createSkillOnlyProfile(id: string): CvProfile {
  return {
    id,
    hasCv: false,
    currentTitle: null,
    summary: null,
    totalMonthsExperience: null,
    experiences: [],
    educations: [],
    parsedAt: null,
    updatedAt: null,
    skills: [],
  }
}

function withSkills(profile: CvProfile | null, result: CvProfileSkills) {
  if (!result.profileId) return null
  const base = profile ?? createSkillOnlyProfile(result.profileId)
  return { ...base, id: result.profileId, skills: result.skills }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useCvProfile() {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const pendingSkillIds = useRef(new Set<string>())

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

  const applySkills = useCallback((result: CvProfileSkills) => {
    setState((current) => ({ ...current, profile: withSkills(current.profile, result) }))
  }, [])

  const addSkill = useCallback(
    async (skill: SkillSearchItem) => {
      // Bỏ qua khi skill đó đang được thêm (vd. bấm Enter hai lần).
      if (pendingSkillIds.current.has(skill.id)) return null
      pendingSkillIds.current.add(skill.id)

      try {
        applySkills(await addCvProfileSkill(skill.id))
        return null
      } catch (error) {
        // Skill đã có (vd. thêm từ tab khác): đồng bộ lại danh sách.
        if (error instanceof ApiError && error.code === 'cv_profile_skill_exists') {
          try {
            applySkills(await getCvProfileSkills())
          } catch {
            // Giữ danh sách hiện tại nếu không đồng bộ được.
          }
          return null
        }
        return toActionError(error, 'Không thể thêm kỹ năng. Vui lòng thử lại.')
      } finally {
        pendingSkillIds.current.delete(skill.id)
      }
    },
    [applySkills],
  )

  return { ...state, retry, upload, isUploading, remove, isDeleting, addSkill, removeSkill }
}
