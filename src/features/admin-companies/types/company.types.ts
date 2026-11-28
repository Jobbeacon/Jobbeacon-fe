export type CompanySort = 'jobs' | 'recent' | 'name'

export const COMPANY_SORTS: CompanySort[] = ['jobs', 'recent', 'name']

export type CompanyStats = {
  total: number
  withLogo: number
  withoutJobs: number
}

export type CompanyRow = {
  id: string
  name: string
  logoUrl: string | null
  jobCount: number
  openJobCount: number
  sources: string[]
  createdAt: string | null
  lastCrawledAt: string | null
  // Danh sách thường không có; chi tiết thì có
  locations: string[]
}

export type CompanyRef = {
  id: string
  name: string
  jobCount: number
  logoUrl?: string | null
}

export type CompanyDetail = CompanyRow & {
  possibleDuplicates: CompanyRef[]
}

export type CompanyQuery = {
  q?: string
  sort?: CompanySort
  page?: number
  size?: number
}

export type CompanyUpdate = {
  name: string
  logoUrl: string | null
}
