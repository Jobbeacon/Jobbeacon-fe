import type { JobSummary } from '../../jobs/types/job.types'

export type HomeData = {
  /** Tên ngành nghề cấp 1 đang có việc. */
  categories: string[]
  popularSkills: string[]
}

export type HomeCategory = {
  name: string
  total: number
  jobs: JobSummary[]
}
