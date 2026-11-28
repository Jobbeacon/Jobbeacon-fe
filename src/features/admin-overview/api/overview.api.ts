import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, toQuery, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope } from '../../../shared/api/case'
import type { Overview } from '../types/overview.types'

export async function getOverview(days: number, signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/admin/overview${toQuery({ days })}`, { signal })
  const data = camelizeKeys<Overview>(unwrap(response))
  // Phòng thủ khi backend thiếu mảng.
  return {
    ...data,
    sources: data.sources ?? [],
    daily: data.daily ?? [],
    monthly: data.monthly ?? [],
    hours: data.hours ?? [],
    quietSources: data.quietSources ?? [],
    recent: data.recent ?? [],
  } satisfies Overview
}
