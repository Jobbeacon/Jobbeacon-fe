import type { LocationItem } from '../../jobs/types/job.types'

export type UserProfile = {
  id: string
  firebaseUid: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  roles: string[]
  emailVerified: boolean | null
  status: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UserProfileApiDto = {
  id?: string | number
  uid?: string
  firebaseUid?: string
  email?: string
  fullName?: string
  displayName?: string
  name?: string
  avatarUrl?: string
  photoUrl?: string
  role?: string
  roles?: string[]
  emailVerified?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN'
export type SalaryCurrency = 'VND' | 'USD'
export type SalaryPeriod = 'HOUR' | 'DAY' | 'MONTH' | 'YEAR'

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACTOR: 'Hợp đồng/Freelance',
  TEMPORARY: 'Thời vụ',
  INTERN: 'Thực tập',
}

export const SALARY_PERIOD_LABELS: Record<SalaryPeriod, string> = {
  HOUR: '/giờ',
  DAY: '/ngày',
  MONTH: '/tháng',
  YEAR: '/năm',
}

// ---- Job preference ----

export type JobPreferenceApiDto = {
  id: string | null
  desired_titles: string[] | null
  provinces: LocationItem[] | null
  employment_types: EmploymentType[] | null
  remote_ok: boolean | null
  expected_salary_min: number | null
  expected_salary_max: number | null
  currency: SalaryCurrency | null
  salary_period: SalaryPeriod | null
  salary_negotiable: boolean | null
  open_to_work: boolean | null
  updated_at: string | null
}

export type JobPreferenceRequestDto = {
  desired_titles: string[]
  province_ids: string[]
  employment_types: EmploymentType[]
  remote_ok: boolean
  expected_salary_min: number | null
  expected_salary_max: number | null
  currency: SalaryCurrency
  salary_period: SalaryPeriod
  salary_negotiable: boolean
  open_to_work: boolean
}

export type JobPreference = {
  id: string | null
  desiredTitles: string[]
  provinces: LocationItem[]
  employmentTypes: EmploymentType[]
  remoteOk: boolean
  expectedSalaryMin: number | null
  expectedSalaryMax: number | null
  currency: SalaryCurrency
  salaryPeriod: SalaryPeriod
  salaryNegotiable: boolean
  openToWork: boolean
  updatedAt: string | null
}

// Lương nhập dạng chuỗi; VND tính theo "triệu", USD tính theo số đầy đủ.
export type JobPreferenceFormValues = {
  desiredTitles: string[]
  provinceIds: string[]
  employmentTypes: EmploymentType[]
  remoteOk: boolean
  salaryMin: string
  salaryMax: string
  currency: SalaryCurrency
  salaryPeriod: SalaryPeriod
  salaryNegotiable: boolean
  openToWork: boolean
}

// ---- CV profile ----

export type CvExperienceApiDto = {
  title: string | null
  company: string | null
  start_date: string | null
  end_date: string | null
  current: boolean | null
  description: string | null
  skills: string[] | null
}

export type CvEducationApiDto = {
  school: string | null
  degree: string | null
  major: string | null
  start_date: string | null
  end_date: string | null
}

export type CvProfileSkillApiDto = {
  skill_id: string
  name: string
  confidence: number | null
  experience_months: number | null
  last_used_at: string | null
}

export type CvProfileApiDto = {
  id: string
  current_title: string | null
  summary: string | null
  total_months_experience: number | null
  experiences: CvExperienceApiDto[] | null
  educations: CvEducationApiDto[] | null
  parsed_at: string | null
  updated_at: string | null
  skills: CvProfileSkillApiDto[] | null
}

export type CvExperience = {
  title: string | null
  company: string | null
  startDate: string | null
  endDate: string | null
  current: boolean
  description: string | null
  skills: string[]
}

export type CvEducation = {
  school: string | null
  degree: string | null
  major: string | null
  startDate: string | null
  endDate: string | null
}

export type CvProfileSkill = {
  skillId: string
  name: string
  confidence: number | null
  experienceMonths: number | null
  lastUsedAt: string | null
}

export type CvProfile = {
  id: string
  currentTitle: string | null
  summary: string | null
  totalMonthsExperience: number | null
  experiences: CvExperience[]
  educations: CvEducation[]
  parsedAt: string | null
  updatedAt: string | null
  skills: CvProfileSkill[]
}
