import type { JobSummary, JobSummaryApiDto } from '../../jobs/types/job.types'

export type SavedJobApiDto = JobSummaryApiDto & {
  expired_date: string | null
  saved_at: string
}

export type SavedJob = JobSummary & {
  expiredDate: string | null
  savedAt: string
}

export type SavedJobsResult = {
  jobs: SavedJob[]
  total: number
}

export type SavedJobsContextValue = {
  /** Danh sách id đã tải xong từ server cho user hiện tại */
  isReady: boolean
  isSaved: (jobId: string) => boolean
  toggleSaved: (jobId: string) => Promise<void>
}
