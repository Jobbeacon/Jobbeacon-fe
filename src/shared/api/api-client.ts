import type { AccessTokenProvider, ApiErrorBody } from '../types/api.types'

type ApiClientConfig = {
  baseUrl: string
  getAccessToken?: AccessTokenProvider
}

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  body?: unknown
  headers?: HeadersInit
  authenticated?: boolean
}

let apiConfig: ApiClientConfig = {
  baseUrl: '',
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string | number
  readonly details?: unknown

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    // Ưu tiên mã lỗi nghiệp vụ trong data.code (ResponseGeneral của backend)
    this.code = body?.data?.code ?? body?.code
    this.details = body?.details
  }
}

export function configureApiClient(config: ApiClientConfig) {
  apiConfig = {
    ...config,
    baseUrl: config.baseUrl.replace(/\/$/, ''),
  }
}

function createUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiConfig.baseUrl}${normalizedPath}`
}

function createBody(body: unknown, headers: Headers) {
  if (body === undefined || body === null || body instanceof FormData) {
    return body as BodyInit | null | undefined
  }

  if (body instanceof Blob || typeof body === 'string' || body instanceof URLSearchParams) {
    return body
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return JSON.stringify(body)
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()
  if (!text) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new ApiError('Phản hồi từ máy chủ không hợp lệ.', response.status)
    }
  }

  return text
}

function toApiError(response: Response, body: unknown) {
  const errorBody =
    typeof body === 'object' && body !== null ? (body as ApiErrorBody) : undefined
  // Backend bọc lỗi trong ResponseGeneral: { status, message, data: { code, detail } }
  const errorData =
    typeof errorBody?.data === 'object' && errorBody.data !== null ? errorBody.data : undefined
  const message =
    errorData?.detail ??
    errorBody?.message ??
    errorBody?.error ??
    (response.status === 401
      ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      : `Yêu cầu không thành công (${response.status}).`)

  return new ApiError(message, response.status, errorBody)
}

async function request<T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers: initialHeaders, authenticated = true, ...requestInit } = options

  const execute = async (forceRefresh = false) => {
    const headers = new Headers(initialHeaders)
    headers.set('Accept', 'application/json')
    if (!headers.has('Accept-Language')) {
      headers.set('Accept-Language', 'vi')
    }

    if (authenticated) {
      const token = await apiConfig.getAccessToken?.(forceRefresh)
      if (!token) {
        throw new ApiError('Bạn cần đăng nhập để thực hiện thao tác này.', 401)
      }
      headers.set('Authorization', `Bearer ${token}`)
    }

    return fetch(createUrl(path), {
      ...requestInit,
      method,
      headers,
      body: createBody(body, headers),
    })
  }

  let response = await execute()
  if (authenticated && response.status === 401 && apiConfig.getAccessToken) {
    response = await execute(true)
  }

  const responseBody = await parseResponse(response)
  if (!response.ok) {
    throw toApiError(response, responseBody)
  }

  return responseBody as T
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>('DELETE', path, options),
}
