import type { JobSummary, JobSummaryApiDto } from '../../jobs/types/job.types'

export type RecommendedJobsApiDto = {
  content: JobSummaryApiDto[]
  personalized: boolean
  matched_skills: Record<string, string[]>
}

export type RecommendedJobsResult = {
  jobs: JobSummary[]
  /** false khi hệ thống chưa biết gì về user (chưa có CV, tương tác hay sở thích): danh sách là các job mới nhất. */
  personalized: boolean
  /** Kỹ năng trong CV mà job cần, theo id job. */
  matchedSkills: Record<string, string[]>
}
