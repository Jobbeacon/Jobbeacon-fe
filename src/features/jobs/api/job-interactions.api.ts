import { getRecommendationApiBaseUrl } from '../../../app/config/env'
import { apiClient } from '../../../shared/api/api-client'

export type JobInteractionType = 'VIEWED' | 'APPLY_CLICKED'

// Tương tác được lưu ở service gợi ý (Jobbeacon-recommendation), không phải backend chính.
export async function recordJobInteraction(jobId: string, type: JobInteractionType) {
  await apiClient.post(`${getRecommendationApiBaseUrl()}/api/v1/me/job-interactions`, {
    job_id: jobId,
    type,
  })
}
