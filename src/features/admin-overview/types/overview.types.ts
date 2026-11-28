// Model camelCase của GET /api/v1/admin/overview.
// Key của bySource là domain nguồn (vd. "topcv.vn"), giữ nguyên khi camelize.
export type SourceCounts = Record<string, number>

export type OverviewDay = {
  date: string
  total: number
  bySource: SourceCounts
}

export type OverviewMonth = {
  month: string
  total: number
  bySource: SourceCounts
}

export type OverviewRecent = {
  crawledAt: string
  domain: string
  jobUrl: string | null
  jobId: string
  jobTitle: string | null
  companyId: string | null
  companyName: string | null
}

export type Overview = {
  sources: string[]
  today: string
  totalWindow: number
  totalToday: number
  totalMonth: number
  daily: OverviewDay[]
  monthly: OverviewMonth[]
  hours: number[]
  quietSources: string[]
  recent: OverviewRecent[]
}

// Một cột của biểu đồ (ngày hoặc tháng) đã chuẩn hóa để vẽ.
export type ChartRow = {
  key: string
  label: string
  hint?: string
  partial?: boolean
  weekend?: boolean
  total: number
  bySource: SourceCounts
}
