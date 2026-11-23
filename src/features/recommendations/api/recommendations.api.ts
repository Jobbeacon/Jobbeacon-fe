import { recommendationService } from '../../../shared/api/recommendation.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import { toJobSummary } from '../../jobs/api/jobs.api'
import type { RecommendedJobsApiDto, RecommendedJobsResult } from '../types/recommendation.types'

// Không phân trang: mỗi lần gọi server trả một danh sách xáo trộn mới.
export async function getRecommendedJobs(size: number, signal?: AbortSignal): Promise<RecommendedJobsResult> {
  const response = await recommendationService.get<ApiResponse<RecommendedJobsApiDto>>(
    `/me/recommended-jobs?size=${size}`,
    { signal },
  )
  return {
    jobs: response.data.content.map(toJobSummary),
    personalized: response.data.personalized,
    matchedSkills: response.data.matched_skills ?? {},
  }
}
