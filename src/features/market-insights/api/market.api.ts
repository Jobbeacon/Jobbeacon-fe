import { backendService } from '../../../shared/api/backend.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  FilterOption,
  MarketFilters,
  MarketGroup,
  MarketGroupApiDto,
  MarketOverview,
  MarketOverviewApiDto,
  SalaryStats,
  SalaryStatsApiDto,
} from '../types/market.types'

type CategoryNodeApiDto = { id: string; name: string }

function toSalary(salary: SalaryStatsApiDto): SalaryStats {
  return { p25: salary.p25, median: salary.median, p75: salary.p75, sampleSize: salary.sample_size }
}

function toGroup(group: MarketGroupApiDto): MarketGroup {
  return {
    id: group.id,
    name: group.name,
    jobCount: group.job_count,
    share: group.share,
    salary: toSalary(group.salary),
  }
}

export async function getMarketOverview(filters: MarketFilters, signal?: AbortSignal): Promise<MarketOverview> {
  const params = new URLSearchParams()
  if (filters.categoryId) params.set('category_id', filters.categoryId)
  if (filters.provinceId) params.set('province_id', filters.provinceId)
  if (filters.skillId) params.set('skill_id', filters.skillId)
  const query = params.size > 0 ? `?${params}` : ''

  const response = await backendService.get<ApiResponse<MarketOverviewApiDto>>(`/market/overview${query}`, {
    signal,
    authenticated: false,
  })
  const data = response.data
  return {
    totalJobs: data.total_jobs,
    jobsWithSalary: data.jobs_with_salary,
    salary: toSalary(data.salary),
    topSkills: data.top_skills.map(toGroup),
    byProvince: data.by_province.map(toGroup),
    byCategory: data.by_category.map(toGroup),
    byExperience: data.by_experience.map(toGroup),
    postingTrend: data.posting_trend.map((point) => ({ week: point.week, jobCount: point.job_count })),
    usdVndRate: data.usd_vnd_rate,
    minSalarySample: data.min_salary_sample,
  }
}

/** Root categories only: the statistics group every category under its root. */
export async function getRootCategories(signal?: AbortSignal): Promise<FilterOption[]> {
  const response = await backendService.get<ApiResponse<CategoryNodeApiDto[]>>('/categories', {
    signal,
    authenticated: false,
  })
  return response.data.map((category) => ({ id: category.id, name: category.name }))
}

export async function getProvinces(signal?: AbortSignal): Promise<FilterOption[]> {
  const response = await backendService.get<ApiResponse<FilterOption[]>>('/locations/provinces', {
    signal,
    authenticated: false,
  })
  return response.data
}
