import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, snakeizeKeys, toQuery, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope, Page } from '../../../shared/api/case'
import type {
  JobCategory,
  JobDetail,
  JobQuery,
  JobRow,
  JobStats,
  JobUpdate,
  NamedRef,
} from '../types/admin-job.types'

const JOBS_ENDPOINT = '/api/v1/admin/jobs'
const SUGGEST_SIZE = 20

export async function getJobStats(signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${JOBS_ENDPOINT}/stats`, { signal })
  return camelizeKeys<JobStats>(unwrap(res))
}

export async function listJobs(query: JobQuery, signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${JOBS_ENDPOINT}${toQuery(query)}`, { signal })
  const page = camelizeKeys<Page<JobRow> | null>(unwrap(res))
  return { content: page?.content ?? [], amount: page?.amount ?? 0 }
}

export async function getJob(id: string, signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${JOBS_ENDPOINT}/${encodeURIComponent(id)}`, { signal })
  return camelizeKeys<JobDetail>(unwrap(res))
}

export async function updateJob(id: string, body: JobUpdate) {
  const res = await apiClient.put<ApiEnvelope<unknown>>(
    `${JOBS_ENDPOINT}/${encodeURIComponent(id)}`,
    snakeizeKeys(body),
  )
  return camelizeKeys<JobDetail>(unwrap(res))
}

export async function deleteJob(id: string) {
  await apiClient.delete(`${JOBS_ENDPOINT}/${encodeURIComponent(id)}`)
}

// Gợi ý công ty cho ô "Công ty" trong form sửa.
export async function searchCompanies(q: string, signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(
    `/api/v1/admin/companies${toQuery({ q, size: SUGGEST_SIZE })}`,
    { signal },
  )
  const page = camelizeKeys<Page<NamedRef> | null>(unwrap(res))
  return (page?.content ?? []).map(({ id, name }) => ({ id, name }))
}

// Gợi ý kỹ năng có thật (q khớp tên hoặc alias).
export async function searchSkills(q: string, signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>(
    `/api/v1/admin/skills${toQuery({ q, size: SUGGEST_SIZE })}`,
    { signal },
  )
  const page = camelizeKeys<Page<NamedRef> | null>(unwrap(res))
  return (page?.content ?? []).map(({ id, name }) => ({ id, name }))
}

type CategoryNode = {
  id: string
  name: string
  level: number
  children: CategoryNode[] | null
}

// Lấy cây danh mục, trả về các node cấp 3 (vị trí) kèm path.
export async function getCategoryLeaves(signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<unknown>>('/api/v1/admin/categories', { signal })
  const roots = camelizeKeys<CategoryNode[] | null>(unwrap(res)) ?? []
  const leaves: JobCategory[] = []
  const walk = (nodes: CategoryNode[], parents: string[]) => {
    nodes.forEach((node) => {
      const path = [...parents, node.name]
      if (node.level >= 3) {
        leaves.push({ id: node.id, name: node.name, path })
      } else {
        walk(node.children ?? [], path)
      }
    })
  }
  walk(roots, [])
  return leaves
}

// Tên tỉnh/thành (endpoint public).
export async function getProvinceNames(signal?: AbortSignal) {
  const res = await apiClient.get<ApiEnvelope<NamedRef[] | null>>('/api/v1/locations/provinces', {
    signal,
    authenticated: false,
  })
  return (unwrap(res) ?? []).map((item) => item.name)
}

// URL site người dùng để mở "Xem trên trang tìm việc"; rỗng → ẩn link.
export function getUserSiteUrl() {
  const runtime = (window as unknown as { __ENV__?: Record<string, string | undefined> }).__ENV__
  const raw = runtime?.VITE_USER_SITE_URL || (import.meta.env.VITE_USER_SITE_URL as string | undefined) || ''
  // env.js chưa render (còn "$VITE_...") coi như chưa cấu hình.
  return raw.startsWith('$') ? '' : raw.replace(/\/$/, '')
}
