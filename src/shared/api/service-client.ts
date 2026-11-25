import { apiClient, authorizedFetch } from './api-client'
import type { ApiRequestOptions, AuthorizedFetchOptions } from './api-client'

// Mỗi service phía sau gateway phục vụ API dưới context path là tên service, ví dụ
// /jobbeacon-be/api/v1. Client này gắn sẵn prefix đó để feature chỉ cần truyền đường dẫn tương đối
// như '/jobs' hay '/me/saved-jobs'.
export function createServiceClient(basePath: string) {
  const base = basePath.replace(/\/$/, '')
  const url = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`

  return {
    /** Đường dẫn đầy đủ (qua gateway) của một endpoint thuộc service này. */
    url,
    get: <T>(path: string, options?: ApiRequestOptions) => apiClient.get<T>(url(path), options),
    post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      apiClient.post<T>(url(path), body, options),
    put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      apiClient.put<T>(url(path), body, options),
    patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      apiClient.patch<T>(url(path), body, options),
    delete: <T>(path: string, options?: ApiRequestOptions) => apiClient.delete<T>(url(path), options),
    /** Response thô (vd. đọc stream SSE); người gọi tự kiểm tra response.ok. */
    fetch: (path: string, options?: AuthorizedFetchOptions) => authorizedFetch(url(path), options),
  }
}

export type ServiceClient = ReturnType<typeof createServiceClient>
