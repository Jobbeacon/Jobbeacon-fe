import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, toQuery, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope, Page } from '../../../shared/api/case'
import type { Skill, SkillInput, SkillQuery, SkillStats } from '../types/skill.types'

const BASE = '/api/v1/admin/skills'

function toSkill(raw: Partial<Skill> | null | undefined): Skill {
  return {
    id: raw?.id ?? '',
    name: raw?.name ?? '',
    aliases: raw?.aliases ?? [],
    jobCount: raw?.jobCount ?? 0,
    cvCount: raw?.cvCount ?? 0,
    createdAt: raw?.createdAt ?? null,
  }
}

const readSkill = (res: ApiEnvelope<unknown>) => toSkill(camelizeKeys<Partial<Skill>>(unwrap(res)))

export async function getSkillStats(signal?: AbortSignal): Promise<SkillStats> {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}/stats`, { signal })
  const stats = camelizeKeys<Partial<SkillStats>>(unwrap(res)) ?? {}
  return {
    total: stats.total ?? 0,
    recent: stats.recent ?? 0,
    withoutAlias: stats.withoutAlias ?? 0,
    unused: stats.unused ?? 0,
  }
}

export async function listSkills(query: SkillQuery, signal?: AbortSignal): Promise<Page<Skill>> {
  const res = await apiClient.get<ApiEnvelope<unknown>>(`${BASE}${toQuery(query)}`, { signal })
  const page = camelizeKeys<Page<Partial<Skill>>>(unwrap(res))
  return { content: (page?.content ?? []).map(toSkill), amount: page?.amount ?? 0 }
}

// Gợi ý kỹ năng đích khi gộp (q khớp tên hoặc alias).
export async function searchSkills(q: string, signal?: AbortSignal) {
  const page = await listSkills({ q, size: 20, sort: 'jobs' }, signal)
  return page.content
}

export async function createSkill(body: SkillInput) {
  return readSkill(await apiClient.post<ApiEnvelope<unknown>>(BASE, body))
}

// aliases thay toàn bộ danh sách cũ.
export async function updateSkill(id: string, body: SkillInput) {
  return readSkill(await apiClient.put<ApiEnvelope<unknown>>(`${BASE}/${id}`, body))
}

// Tên + alias nguồn thành alias của đích; trả kỹ năng đích.
export async function mergeSkill(id: string, targetId: string) {
  return readSkill(await apiClient.post<ApiEnvelope<unknown>>(`${BASE}/${id}/merge`, { target_id: targetId }))
}

export async function deleteSkill(id: string) {
  await apiClient.delete<unknown>(`${BASE}/${id}`)
}
