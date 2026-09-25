import { apiClient } from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  JobDetail,
  JobDetailApiDto,
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
    categories: job.categories ?? [],
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

// Backend chưa có API gợi ý việc tương tự, tạm lấy các tin mới nhất (bỏ tin đang xem).
export async function getSimilarJobs(jobId: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: '1', size: String(SIMILAR_JOBS_LIMIT + 1) })
  const response = await apiClient.get<ApiResponse<PageApiDto<JobSummaryApiDto>>>(
    `${JOBS_ENDPOINT}?${params}`,
    { signal, authenticated: false },
  )
  return response.data.content
    .filter((job) => job.id !== jobId)
    .slice(0, SIMILAR_JOBS_LIMIT)
    .map(toJobSummary)
}
