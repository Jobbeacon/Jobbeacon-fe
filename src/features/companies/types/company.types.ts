export type Company = {
  id: string
  name: string
  logoUrl: string | null
  openJobsCount: number
  locations: string[]
  sources: string[]
}

export type CompanySummaryApiDto = {
  id: string
  name: string
  logo_url: string | null
  open_jobs_count: number
  locations: string[] | null
  sources: string[] | null
}

export type CompanySearchParams = {
  keyword: string
  page: number
  size: number
}

export type CompanySearchResult = {
  companies: Company[]
  total: number
}
