import { ApiError } from '../../../shared/api/api-client'
import { backendService } from '../../../shared/api/backend.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  CvEducationApiDto,
  CvExperienceApiDto,
  CvProfile,
  CvProfileApiDto,
  CvProfileSkill,
  CvProfileSkillApiDto,
  CvProfileSkills,
  CvProfileSkillsApiDto,
  JobPreference,
  JobPreferenceApiDto,
  JobPreferenceRequestDto,
  SkillSearchItem,
  UserProfile,
  UserProfileApiDto,
} from '../types/candidate-profile.types'

const CURRENT_USER_ENDPOINT = '/users/me'
const JOB_PREFERENCE_ENDPOINT = '/me/job-preference'
const CV_PROFILE_ENDPOINT = '/me/cv-profile'
const SKILLS_ENDPOINT = '/skills'
const SKILL_SEARCH_LIMIT = 10
// Trích xuất CV chạy đồng bộ, có thể mất ~30–40s.
const CV_EXTRACT_TIMEOUT_MS = 90_000
const CV_PROFILE_NOT_FOUND = 'cv_profile_not_found'

function toUserProfile(dto: UserProfileApiDto): UserProfile {
  return {
    id: dto.id,
    email: dto.email ?? '',
    fullName: dto.display_name ?? '',
    avatarUrl: dto.avatar_url ?? null,
  }
}

export async function getCurrentUserProfile(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<UserProfileApiDto>>(CURRENT_USER_ENDPOINT, { signal })
  return toUserProfile(response.data)
}

function toJobPreference(dto: JobPreferenceApiDto): JobPreference {
  return {
    id: dto.id ?? null,
    desiredTitles: dto.desired_titles ?? [],
    provinces: dto.provinces ?? [],
    employmentTypes: dto.employment_types ?? [],
    remoteOk: dto.remote_ok ?? false,
    expectedSalaryMin: dto.expected_salary_min ?? null,
    expectedSalaryMax: dto.expected_salary_max ?? null,
    currency: dto.currency ?? 'VND',
    salaryPeriod: dto.salary_period ?? 'MONTH',
    salaryNegotiable: dto.salary_negotiable ?? false,
    openToWork: dto.open_to_work ?? true,
    updatedAt: dto.updated_at ?? null,
  }
}

function toCvSkill(dto: CvProfileSkillApiDto): CvProfileSkill {
  return {
    skillId: dto.skill_id,
    name: dto.name,
    confidence: dto.confidence ?? null,
    experienceMonths: dto.experience_months ?? null,
    lastUsedAt: dto.last_used_at ?? null,
  }
}

function toCvExperience(dto: CvExperienceApiDto) {
  return {
    title: dto.title ?? null,
    company: dto.company ?? null,
    startDate: dto.start_date ?? null,
    endDate: dto.end_date ?? null,
    current: dto.current ?? false,
    description: dto.description ?? null,
    skills: dto.skills ?? [],
  }
}

function toCvEducation(dto: CvEducationApiDto) {
  return {
    school: dto.school ?? null,
    degree: dto.degree ?? null,
    major: dto.major ?? null,
    startDate: dto.start_date ?? null,
    endDate: dto.end_date ?? null,
  }
}

function toCvProfile(dto: CvProfileApiDto): CvProfile {
  return {
    id: dto.id,
    hasCv: dto.has_cv ?? dto.parsed_at != null,
    currentTitle: dto.current_title ?? null,
    summary: dto.summary ?? null,
    totalMonthsExperience: dto.total_months_experience ?? null,
    experiences: (dto.experiences ?? []).map(toCvExperience),
    educations: (dto.educations ?? []).map(toCvEducation),
    parsedAt: dto.parsed_at ?? null,
    updatedAt: dto.updated_at ?? null,
    skills: (dto.skills ?? []).map(toCvSkill),
  }
}

function toCvProfileSkills(dto: CvProfileSkillsApiDto): CvProfileSkills {
  return {
    profileId: dto.profile_id ?? null,
    skills: (dto.skills ?? []).map(toCvSkill),
  }
}

function isCvProfileNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404 && error.code === CV_PROFILE_NOT_FOUND
}

export async function getJobPreference(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<JobPreferenceApiDto>>(JOB_PREFERENCE_ENDPOINT, {
    signal,
  })
  return toJobPreference(response.data)
}

export async function updateJobPreference(request: JobPreferenceRequestDto, signal?: AbortSignal) {
  const response = await backendService.put<ApiResponse<JobPreferenceApiDto>>(
    JOB_PREFERENCE_ENDPOINT,
    request,
    { signal },
  )
  return toJobPreference(response.data)
}

/** Trả về null khi user chưa có CV profile. */
export async function getCvProfile(signal?: AbortSignal) {
  try {
    const response = await backendService.get<ApiResponse<CvProfileApiDto>>(CV_PROFILE_ENDPOINT, { signal })
    return toCvProfile(response.data)
  } catch (error) {
    if (isCvProfileNotFound(error)) return null
    throw error
  }
}

export async function extractCvProfile(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', file)

  const timeoutSignal = AbortSignal.timeout(CV_EXTRACT_TIMEOUT_MS)
  try {
    const response = await backendService.post<ApiResponse<CvProfileApiDto>>(
      `${CV_PROFILE_ENDPOINT}/extract`,
      formData,
      { signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal },
    )
    return toCvProfile(response.data)
  } catch (error) {
    if (timeoutSignal.aborted && !signal?.aborted) {
      throw new ApiError('Xử lý CV quá thời gian. Vui lòng thử lại.', 504, {
        data: { code: 'cv_model_timeout' },
      })
    }
    throw error
  }
}

/** Xóa CV profile; coi như thành công nếu profile đã không tồn tại. */
export async function deleteCvProfile(signal?: AbortSignal) {
  try {
    await backendService.delete<ApiResponse<null>>(CV_PROFILE_ENDPOINT, { signal })
  } catch (error) {
    if (!isCvProfileNotFound(error)) throw error
  }
}

export async function deleteCvProfileSkill(skillId: string, signal?: AbortSignal) {
  await backendService.delete<ApiResponse<null>>(
    `${CV_PROFILE_ENDPOINT}/skills/${encodeURIComponent(skillId)}`,
    { signal },
  )
}

export async function getCvProfileSkills(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<CvProfileSkillsApiDto>>(`${CV_PROFILE_ENDPOINT}/skills`, {
    signal,
  })
  return toCvProfileSkills(response.data)
}

/** Thêm skill tay; chưa có profile thì backend tự tạo profile rỗng (has_cv = false). */
export async function addCvProfileSkill(skillId: string, signal?: AbortSignal) {
  const response = await backendService.post<ApiResponse<CvProfileSkillsApiDto>>(
    `${CV_PROFILE_ENDPOINT}/skills`,
    { skill_id: skillId },
    { signal },
  )
  return toCvProfileSkills(response.data)
}

export async function searchSkills(query: string, signal?: AbortSignal) {
  const q = query.trim()
  if (!q) return [] as SkillSearchItem[]

  const params = new URLSearchParams({ q, limit: String(SKILL_SEARCH_LIMIT) })
  const response = await backendService.get<ApiResponse<SkillSearchItem[]>>(`${SKILLS_ENDPOINT}?${params}`, {
    signal,
  })
  return response.data ?? []
}
