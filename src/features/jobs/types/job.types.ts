export type JobSummaryApiDto = {
  id: string
  title: string
  company_name: string | null
  min_salary: number | null
  max_salary: number | null
  location: string[] | null
  currency: string | null
  company_logo_url: string | null
  posted_date: string | null
}

export type SkillApiDto = {
  id: string
  name: string
}

export type CategoryApiDto = {
  id: string
  name: string
  level: number | null
  children: CategoryApiDto[] | null
}

export type CompanyApiDto = {
  id: string
  name: string
  logo_url: string | null
}

export type JobSourceApiDto = {
  id: string
  domain: string | null
  job_url: string | null
}

export type JobDetailApiDto = {
  id: string
  company: CompanyApiDto | null
  title: string
  description: string | null
  experience_months: number | null
  employment_type: string | null
  posted_date: string | null
  expired_date: string | null
  min_salary: number | null
  max_salary: number | null
  currency: string | null
  salary_period: string | null
  location: string[] | null
  benefits: string | null
  skills: SkillApiDto[] | null
  categories: CategoryApiDto[] | null
  job_sources: JobSourceApiDto[] | null
}

export type JobSkill = {
  id: string
  name: string
}

export type JobCategory = {
  id: string
  name: string
  level: number | null
  children: JobCategory[]
}

export type JobCompany = {
  id: string
  name: string
  logoUrl: string | null
}

export type JobSource = {
  id: string
  name: string
  domain: string
  url: string | null
}

export type JobSummary = {
  id: string
  title: string
  companyName: string
  companyLogoUrl: string | null
  location: string[]
  minSalary: number | null
  maxSalary: number | null
  currency: string | null
  skills: JobSkill[]
  postedDate: string | null
}

export type JobDetail = JobSummary & {
  company: JobCompany | null
  descriptionHtml: string
  experienceMonths: number | null
  employmentType: string | null
  expiredDate: string | null
  salaryPeriod: string | null
  categories: JobCategory[]
  sources: JobSource[]
}

export type JobSearchParams = {
  keyword: string
  page: number
  size: number
}

export type JobSearchResult = {
  jobs: JobSummary[]
  total: number
}
