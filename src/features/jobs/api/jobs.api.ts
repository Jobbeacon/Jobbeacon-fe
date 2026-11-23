import { backendService } from '../../../shared/api/backend.service'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  CategoryNode,
  FacetItem,
  JobFacets,
  LocationItem,
  CategoryApiDto,
  JobCategory,
  JobDetail,
  JobDetailApiDto,
  JobSearchParams,
  JobSearchResult,
  JobSource,
  JobSourceApiDto,
  JobSummary,
  JobSummaryApiDto,
} from '../types/job.types'
import { getCategoryPaths } from '../utils/category'

const JOBS_ENDPOINT = '/jobs'
const LOCATIONS_ENDPOINT = '/locations'
const CATEGORIES_ENDPOINT = '/categories'
const SIMILAR_JOBS_LIMIT = 4

type PageApiDto<T> = {
  content: T[]
  amount: number
}

function toSource(source: JobSourceApiDto): JobSource {
  const domain = (source.domain ?? '').replace(/^www\./, '')
  return {
    id: source.id,
    name: domain,
    domain,
    url: source.job_url,
  }
}

function toCategory(category: CategoryApiDto): JobCategory {
  return {
    id: category.id,
    name: category.name,
    level: category.level,
    children: (category.children ?? []).map(toCategory),
  }
}

export function toJobSummary(job: JobSummaryApiDto): JobSummary {
  return {
    id: job.id,
    title: job.title,
    companyName: job.company_name ?? '',
    companyLogoUrl: job.company_logo_url,
    location: job.location ?? [],
    minSalary: job.min_salary,
    maxSalary: job.max_salary,
    currency: job.currency,
    postedDate: job.posted_date,
  }
}

function toJobDetail(job: JobDetailApiDto): JobDetail {
  return {
    id: job.id,
    title: job.title,
    companyName: job.company?.name ?? '',
    companyLogoUrl: job.company?.logo_url ?? null,
    location: job.location ?? [],
    minSalary: job.min_salary,
    maxSalary: job.max_salary,
    currency: job.currency,
    skills: job.skills ?? [],
    postedDate: job.posted_date,
    company: job.company
      ? { id: job.company.id, name: job.company.name, logoUrl: job.company.logo_url }
      : null,
    descriptionHtml: job.description ?? '',
    benefitsHtml: job.benefits ?? '',
    experienceMonths: job.experience_months,
    employmentType: job.employment_type,
    expiredDate: job.expired_date,
    salaryPeriod: job.salary_period,
    categories: (job.categories ?? []).map(toCategory),
    sources: (job.job_sources ?? []).map(toSource),
  }
}

export async function getJobFacets(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<JobFacets>>(`${JOBS_ENDPOINT}/facets`, {
    signal,
    authenticated: false,
  })
  return response.data
}

export async function getJobSources(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<FacetItem[]>>(`${JOBS_ENDPOINT}/sources`, {
    signal,
    authenticated: false,
  })
  return response.data
}

export async function getCategories(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<CategoryNode[]>>(CATEGORIES_ENDPOINT, {
    signal,
    authenticated: false,
  })
  return response.data
}

export async function getProvinces(signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<LocationItem[]>>(`${LOCATIONS_ENDPOINT}/provinces`, {
    signal,
    authenticated: false,
  })
  return response.data
}

export async function getWards(provinceId: string, signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<LocationItem[]>>(
    `${LOCATIONS_ENDPOINT}/provinces/${encodeURIComponent(provinceId)}/wards`,
    { signal, authenticated: false },
  )
  return response.data
}

export async function getJobDetail(jobId: string, signal?: AbortSignal) {
  const response = await backendService.get<ApiResponse<JobDetailApiDto>>(
    `${JOBS_ENDPOINT}/${encodeURIComponent(jobId)}`,
    { signal, authenticated: false },
  )
  return toJobDetail(response.data)
}

function toVnd(value: string) {
  const digits = value.trim()
  if (!digits) return ''
  const amount = Number(digits)
  if (!Number.isFinite(amount) || amount <= 0) return ''
  return String(amount * 1_000_000)
}

function appendList(params: URLSearchParams, key: string, values: string[]) {
  const joined = values.map((value) => value.trim()).filter(Boolean).join(',')
  if (joined) params.set(key, joined)
}

export async function searchJobs(query: JobSearchParams, signal?: AbortSignal): Promise<JobSearchResult> {
  const params = new URLSearchParams({ page: String(query.page), size: String(query.size) })
  if (query.keyword.trim()) params.set('keyword', query.keyword.trim())
  if (query.location.trim()) params.set('location', query.location.trim())
  appendList(params, 'locations', query.locations)
  appendList(params, 'categories', query.categories)
  appendList(params, 'skills', query.skills)
  const minSalary = toVnd(query.minSalary)
  const maxSalary = toVnd(query.maxSalary)
  if (minSalary) params.set('min_salary', minSalary)
  if (maxSalary) params.set('max_salary', maxSalary)
  appendList(params, 'experience', query.experience)
  appendList(params, 'employment_types', query.employmentTypes)
  appendList(params, 'posted_within', query.postedWithin)
  appendList(params, 'sources', query.sources)
  if (query.sortBy && query.sortBy !== 'posted_date') params.set('sort_by', query.sortBy)

  const response = await backendService.get<ApiResponse<PageApiDto<JobSummaryApiDto>>>(
    `${JOBS_ENDPOINT}?${params}`,
    { signal, authenticated: false },
  )
  return { jobs: response.data.content.map(toJobSummary), total: response.data.amount }
}

const emptySearch: Omit<JobSearchParams, 'page' | 'size'> = {
  keyword: '',
  location: '',
  locations: [],
  categories: [],
  skills: [],
  minSalary: '',
  maxSalary: '',
  experience: [],
  employmentTypes: [],
  postedWithin: [],
  sources: [],
  sortBy: 'posted_date',
}

export async function getLatestJobs(limit: number, signal?: AbortSignal) {
  const { jobs } = await searchJobs({ ...emptySearch, page: 1, size: limit }, signal)
  return jobs
}

export async function getJobsByCategory(category: string, limit: number, signal?: AbortSignal) {
  return searchJobs({ ...emptySearch, categories: [category], page: 1, size: limit }, signal)
}

// Bộ lọc của API phân tách bằng dấu phẩy nên bỏ các tên có chứa dấu phẩy.
function withoutComma(names: string[]) {
  return names.filter((name) => !name.includes(','))
}

/** Job cùng ngành nghề sâu nhất trước, thiếu thì bù bằng job có chung kỹ năng. */
export async function getSimilarJobs(job: JobDetail, signal?: AbortSignal) {
  const categories = withoutComma(getCategoryPaths(job.categories).map((path) => path[path.length - 1].name))
  const skills = withoutComma(job.skills.map((skill) => skill.name))
  const filters = [
    ...(categories.length > 0 ? [{ categories }] : []),
    ...(skills.length > 0 ? [{ skills }] : []),
  ]

  const similar = new Map<string, JobSummary>()
  for (const filter of filters) {
    // Kết quả có thể chứa chính job đang xem và các job đã lấy ở lượt trước.
    const size = SIMILAR_JOBS_LIMIT + similar.size + 1
    const { jobs } = await searchJobs({ ...emptySearch, ...filter, page: 1, size }, signal)
    for (const item of jobs) {
      if (item.id !== job.id && similar.size < SIMILAR_JOBS_LIMIT) similar.set(item.id, item)
    }
    if (similar.size >= SIMILAR_JOBS_LIMIT) break
  }
  return [...similar.values()]
}
