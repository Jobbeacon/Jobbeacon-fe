import { apiClient } from '../../../shared/api/api-client'
import { camelizeKeys, snakeizeKeys, unwrap } from '../../../shared/api/case'
import type { ApiEnvelope } from '../../../shared/api/case'
import type { CategoryInput, CategoryNode } from '../types/category.types'

const BASE = '/api/v1/admin/categories'

// Cây đầy đủ 3 cấp.
export async function getCategoryTree(signal?: AbortSignal) {
  const response = await apiClient.get<ApiEnvelope<unknown>>(BASE, { signal })
  return camelizeKeys<CategoryNode[]>(unwrap(response)) ?? []
}

// 409 nếu trùng tên cùng cha hoặc vượt quá 3 cấp. BE có thể trả node vừa tạo.
export async function createCategory(input: CategoryInput) {
  const response = await apiClient.post<ApiEnvelope<unknown>>(BASE, snakeizeKeys(input))
  return camelizeKeys<Partial<CategoryNode> | null>(unwrap(response))
}

// Chỉ đổi tên; 409 nếu trùng tên cùng cha.
export async function updateCategory(id: string, name: string) {
  const response = await apiClient.put<ApiEnvelope<unknown>>(
    `${BASE}/${encodeURIComponent(id)}`,
    { name },
  )
  return camelizeKeys<Partial<CategoryNode> | null>(unwrap(response))
}

// 409 nếu còn mục con; BE gỡ mapping job.
export async function deleteCategory(id: string) {
  await apiClient.delete<unknown>(`${BASE}/${encodeURIComponent(id)}`)
}
