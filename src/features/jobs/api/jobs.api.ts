import { apiClient } from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
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

const JOBS_ENDPOINT = '/api/v1/jobs'
const SIMILAR_JOBS_LIMIT = 4

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

function toSource(source: JobSourceApiDto): JobSource {
  const domain = (source.domain ?? '').replace(/^www\./, '')
  return {
    id: source.id,
    name: sourceNames[domain] ?? domain,
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

function toJobSummary(job: JobSummaryApiDto): JobSummary {
  return {
    id: job.id,
    title: job.title,
    companyName: job.company_name ?? '',
    companyLogoUrl: job.company_logo_url,
    location: job.location ?? [],
    minSalary: job.min_salary,
    maxSalary: job.max_salary,
    currency: job.currency,
    skills: [],
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
    experienceMonths: job.experience_months,
    employmentType: job.employment_type,
    expiredDate: job.expired_date,
    salaryPeriod: job.salary_period,
    categories: (job.categories ?? []).map(toCategory),
    sources: (job.job_sources ?? []).map(toSource),
  }
}

export async function getJobDetail(jobId: string, signal?: AbortSignal) {
  const response = await apiClient.get<ApiResponse<JobDetailApiDto>>(
    `${JOBS_ENDPOINT}/${encodeURIComponent(jobId)}`,
    { signal, authenticated: false },
  )
  return toJobDetail(response.data)
}

export async function searchJobs(
  { keyword, page, size }: JobSearchParams,
  signal?: AbortSignal,
): Promise<JobSearchResult> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (keyword.trim()) params.set('keyword', keyword.trim())

  const response = await apiClient.get<ApiResponse<PageApiDto<JobSummaryApiDto>>>(
    `${JOBS_ENDPOINT}?${params}`,
    { signal, authenticated: false },
  )
  return { jobs: response.data.content.map(toJobSummary), total: response.data.amount }
}

export async function getLatestJobs(limit: number, signal?: AbortSignal) {
  const { jobs } = await searchJobs({ keyword: '', page: 1, size: limit }, signal)
  return jobs
}

export async function getSimilarJobs(jobId: string, signal?: AbortSignal) {
  const jobs = await getLatestJobs(SIMILAR_JOBS_LIMIT + 1, signal)
  return jobs.filter((job) => job.id !== jobId).slice(0, SIMILAR_JOBS_LIMIT)
}
