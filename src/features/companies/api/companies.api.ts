import { apiClient } from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  Company,
  CompanySearchParams,
  CompanySearchResult,
  CompanySummaryApiDto,
} from '../types/company.types'

const COMPANIES_ENDPOINT = '/api/v1/companies'

type PageApiDto<T> = {
  content: T[]
  amount: number
}

const sourceNames: Record<string, string> = {
  'topcv.vn': 'TopCV',
  'itviec.com': 'ITviec',
  'vietnamworks.com': 'VietnamWorks',
  'careerviet.vn': 'CareerViet',
}

function toSourceName(domain: string) {
  const normalized = domain.replace(/^www\./, '')
  return sourceNames[normalized] ?? normalized
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

  const response = await apiClient.get<ApiResponse<PageApiDto<CompanySummaryApiDto>>>(
    `${COMPANIES_ENDPOINT}?${params}`,
    { signal, authenticated: false },
  )
  return { companies: response.data.content.map(toCompany), total: response.data.amount }
}
