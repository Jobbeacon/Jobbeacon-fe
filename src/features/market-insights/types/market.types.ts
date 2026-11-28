export type SalaryStatsApiDto = {
  p25: number | null
  median: number | null
  p75: number | null
  sample_size: number
}

export type MarketGroupApiDto = {
  id: string
  name: string
  job_count: number
  share: number
  salary: SalaryStatsApiDto
}

export type MarketOverviewApiDto = {
  total_jobs: number
  jobs_with_salary: number
  salary: SalaryStatsApiDto
  top_skills: MarketGroupApiDto[]
  by_province: MarketGroupApiDto[]
  by_category: MarketGroupApiDto[]
  by_experience: MarketGroupApiDto[]
  posting_trend: { week: string; job_count: number }[]
  usd_vnd_rate: number
  min_salary_sample: number
}

/** VND per month. p25, median and p75 are null when the group has too few salaried jobs. */
export type SalaryStats = {
  p25: number | null
  median: number | null
  p75: number | null
  sampleSize: number
}

export type MarketGroup = {
  id: string
  name: string
  jobCount: number
  share: number
  salary: SalaryStats
}

export type TrendPoint = {
  week: string
  jobCount: number
}

export type MarketOverview = {
  totalJobs: number
  jobsWithSalary: number
  salary: SalaryStats
  topSkills: MarketGroup[]
  byProvince: MarketGroup[]
  byCategory: MarketGroup[]
  byExperience: MarketGroup[]
  postingTrend: TrendPoint[]
  usdVndRate: number
  minSalarySample: number
}

export type MarketFilters = {
  categoryId: string | null
  provinceId: string | null
  skillId: string | null
}

export type FilterOption = {
  id: string
  name: string
}
