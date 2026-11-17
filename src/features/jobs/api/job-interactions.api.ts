import { recommendationService } from '../../../shared/api/recommendation.service'

export type JobInteractionType = 'VIEWED' | 'APPLY_CLICKED'

// Tương tác được lưu ở service gợi ý (Jobbeacon-recommendation), không phải backend chính.
export async function recordJobInteraction(jobId: string, type: JobInteractionType) {
  await recommendationService.post('/me/job-interactions', {
    job_id: jobId,
    type,
  })
}
