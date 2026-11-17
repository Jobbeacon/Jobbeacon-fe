import { backendService } from '../../../shared/api/backend.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import { toJobSummary } from '../../jobs/api/jobs.api'
import type { SavedJob, SavedJobApiDto, SavedJobsResult } from '../types/saved-job.types'

const SAVED_JOBS_ENDPOINT = '/me/saved-jobs'

type PageApiDto<T> = {
  content: T[]
  amount: number
}

function toSavedJob(job: SavedJobApiDto): SavedJob {
  return {
    ...toJobSummary(job),
    expiredDate: job.expired_date,
    savedAt: job.saved_at,
  }
}

export async function getSavedJobIds(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<string[]>>(`${SAVED_JOBS_ENDPOINT}/ids`, { signal })
  return response.data
}

export async function getSavedJobs(
  { page, size }: { page: number; size: number },
  signal?: AbortSignal,
): Promise<SavedJobsResult> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  const response = await backendService.get<ApiResponse<PageApiDto<SavedJobApiDto>>>(
    `${SAVED_JOBS_ENDPOINT}?${params}`,
    { signal },
  )
  return { jobs: response.data.content.map(toSavedJob), total: response.data.amount }
}

export async function saveJob(jobId: string) {
  await backendService.put(`${SAVED_JOBS_ENDPOINT}/${encodeURIComponent(jobId)}`)
}

export async function unsaveJob(jobId: string) {
  await backendService.delete(`${SAVED_JOBS_ENDPOINT}/${encodeURIComponent(jobId)}`)
}
