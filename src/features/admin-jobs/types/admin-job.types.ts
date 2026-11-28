// Model camelCase của Admin API việc làm (DTO snake_case map qua camelizeKeys).

export type JobStats = {
  total: number
  open: number
  expired: number
  crawledToday: number
}

export type JobRow = {
  id: string
  title: string | null
  companyId: string | null
  companyName: string | null
  locations: string[] | null
  minSalary: number | null
  maxSalary: number | null
  currency: string | null
  salaryPeriod: string | null
  employmentType: string | null
  postedDate: string | null
  expiredDate: string | null
  sources: string[] | null
  lastCrawledAt: string | null
}

export type NamedRef = {
  id: string
  name: string
}

export type JobCategory = NamedRef & {
  path: string[]
}

export type JobMapping = {
  domain: string
  jobUrl: string | null
  crawledAt: string | null
}

export type JobDetail = JobRow & {
  description: string | null
  benefits: string | null
  experienceMonths: number | null
  skills: NamedRef[] | null
  categories: JobCategory[] | null
  mappings: JobMapping[] | null
}

export type JobCrawled = '' | 'today' | 'month'
export type JobStatus = '' | 'open' | 'expired'
export type JobSort = 'new' | 'old' | 'expiring' | 'salary'

export type JobQuery = {
  q?: string
  source?: string
  employmentType?: string
  companyId?: string
  crawled?: JobCrawled
  status?: JobStatus
  sort?: JobSort
  page?: number
  size?: number
}

export type JobUpdate = {
  title: string
  companyId: string
  employmentType: string | null
  experienceMonths: number | null
  categoryIds: string[]
  skillIds: string[]
  locations: string[]
  minSalary: number | null
  maxSalary: number | null
  currency: string | null
  salaryPeriod: string | null
  postedDate: string | null
  expiredDate: string | null
  description: string | null
  benefits: string | null
}
