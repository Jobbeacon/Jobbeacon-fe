import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, snakeizeKeys, toQuery, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope, Page } from '../../../shared/api/case'
import type {
  CompanyDetail,
  CompanyQuery,
  CompanyRef,
  CompanyRow,
  CompanyStats,
  CompanyUpdate,
} from '../types/company.types'

const BASE = '/api/v1/admin/companies'

// BE có thể trả null cho mảng/số → chuẩn hóa để UI khỏi kiểm tra.
function toRow(raw: Partial<CompanyRow>): CompanyRow {
  return {
    id: raw.id ?? '',
    name: raw.name ?? '',
    logoUrl: raw.logoUrl || null,
    jobCount: raw.jobCount ?? 0,
    openJobCount: raw.openJobCount ?? 0,
    sources: raw.sources ?? [],
    createdAt: raw.createdAt ?? null,
    lastCrawledAt: raw.lastCrawledAt ?? null,
    locations: raw.locations ?? [],
  }
}

function toDetail(raw: Partial<CompanyDetail>): CompanyDetail {
  return {
    ...toRow(raw),
    possibleDuplicates: (raw.possibleDuplicates ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      jobCount: item.jobCount ?? 0,
    })),
  }
}

export async function getCompanyStats(signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}/stats`, { signal })
  const stats = camelizeKeys<Partial<CompanyStats>>(unwrap(res)) ?? {}
  return {
    total: stats.total ?? 0,
    withLogo: stats.withLogo ?? 0,
    withoutJobs: stats.withoutJobs ?? 0,
  } satisfies CompanyStats
}

export async function listCompanies(query: CompanyQuery, signal?: AbortSignal): Promise<Page<CompanyRow>> {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}${toQuery(query)}`, { signal })
  const page = camelizeKeys<Page<Partial<CompanyRow>>>(unwrap(res))
  return { content: (page?.content ?? []).map(toRow), amount: page?.amount ?? 0 }
}

// Gợi ý công ty đích khi gộp.
export async function searchCompanies(q: string, signal?: AbortSignal): Promise<CompanyRef[]> {
  const page = await listCompanies({ q, size: 20, sort: 'jobs' }, signal)
  return page.content.map(({ id, name, jobCount, logoUrl }) => ({ id, name, jobCount, logoUrl }))
}

export async function getCompany(id: string, signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}/${id}`, { signal })
  return toDetail(camelizeKeys<Partial<CompanyDetail>>(unwrap(res)) ?? {})
}

export async function updateCompany(id: string, body: CompanyUpdate) {
  const res = await apiClient.put<ApiEnvelope<unknown>>(`${BASE}/${id}`, snakeizeKeys(body))
  return toDetail(camelizeKeys<Partial<CompanyDetail>>(unwrap(res)) ?? {})
}

// Chuyển toàn bộ tin sang công ty đích rồi xóa công ty nguồn; trả chi tiết công ty đích.
export async function mergeCompany(id: string, targetId: string) {
  const res = await apiClient.post<ApiEnvelope<unknown>>(`${BASE}/${id}/merge`, { target_id: targetId })
  return toDetail(camelizeKeys<Partial<CompanyDetail>>(unwrap(res)) ?? {})
}

export async function deleteCompany(id: string) {
  await apiClient.delete<unknown>(`${BASE}/${id}`)
}
