export type ApiResponse<T> = {
  data: T
  status?: number
  message?: string
  timestamp?: string
  success?: boolean
  code?: string | number
}

export type ApiErrorBody = {
  message?: string
  error?: string
  code?: string | number
  details?: unknown
  data?: { code?: string; detail?: string } | null
}

export type AccessTokenProvider = (forceRefresh?: boolean) => Promise<string | null>
