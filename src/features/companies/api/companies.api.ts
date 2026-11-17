import { backendService } from '../../../shared/api/backend.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  Company,
  CompanySearchParams,
  CompanySearchResult,
  CompanySummaryApiDto,
} from '../types/company.types'
import type { JobSummary, JobSummaryApiDto } from '../../jobs/types/job.types'
import { toJobSummary } from '../../jobs/api/jobs.api'

const COMPANIES_ENDPOINT = '/companies'

type PageApiDto<T> = {
  content: T[]
  amount: number
}

function toSourceName(domain: string) {
  return domain.replace(/^www\./, '')
}

function toCompany(company: CompanySummaryApiDto): Company {
  return {
    id: company.id,
    name: company.name,
    logoUrl: company.logo_url,
    openJobsCount: company.open_jobs_count,
    locations: company.locations ?? [],
    sources: [...new Set((company.sources ?? []).map(toSourceName))],
  }
}

export async function searchCompanies(
  { keyword, page, size }: CompanySearchParams,
  signal?: AbortSignal,
): Promise<CompanySearchResult> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (keyword.trim()) params.set('keyword', keyword.trim())

  const response = await backendService.get<ApiResponse<PageApiDto<CompanySummaryApiDto>>>(
    `${COMPANIES_ENDPOINT}?${params}`,
    { signal, authenticated: false },
  )
  return { companies: response.data.content.map(toCompany), total: response.data.amount }
}

export async function getCompanyDetail(companyId: string, signal?: AbortSignal): Promise<Company> {
  const response = await backendService.get<ApiResponse<CompanySummaryApiDto>>(
    `${COMPANIES_ENDPOINT}/${encodeURIComponent(companyId)}`,
    { signal, authenticated: false },
  )
  return toCompany(response.data)
}

export async function getCompanyJobs(
  companyId: string,
  page: number = 1,
  size: number = 10,
  signal?: AbortSignal,
): Promise<{ jobs: JobSummary[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  const response = await backendService.get<ApiResponse<PageApiDto<JobSummaryApiDto>>>(
    `${COMPANIES_ENDPOINT}/${encodeURIComponent(companyId)}/jobs?${params}`,
    { signal, authenticated: false },
  )
  return { jobs: response.data.content.map(toJobSummary), total: response.data.amount }
}
