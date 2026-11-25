// Tiện ích chuyển đổi DTO snake_case của backend <-> model camelCase.
// Chỉ đổi tên key, không đổi giá trị. Key không có "_" (vd. domain "topcv.vn") giữ nguyên.

// Kiểu phân trang chung của backend (PageResponse).
export type Page<T> = {
  content: T[]
  amount: number
}

// ResponseGeneral của backend; chỉ cần phần data.
export type ApiEnvelope<T> = {
  data: T
  status?: number
  message?: string
  timestamp?: string
}

type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[]>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function toCamelKey(key: string) {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

export function toSnakeKey(key: string) {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
}

function mapKeys(value: unknown, mapKey: (key: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => mapKeys(item, mapKey))
  }
  // Date, Blob... không phải plain object nên giữ nguyên.
  if (!isPlainObject(value)) {
    return value
  }
  const result: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value)) {
    result[mapKey(key)] = mapKeys(item, mapKey)
  }
  return result
}

// snake_case -> camelCase (đệ quy object/array).
export function camelizeKeys<T = unknown>(value: unknown): T {
  return mapKeys(value, toCamelKey) as T
}

// camelCase -> snake_case (đệ quy object/array), dùng cho body gửi lên backend.
export function snakeizeKeys<T = unknown>(value: unknown): T {
  return mapKeys(value, toSnakeKey) as T
}

// Lấy .data từ ResponseGeneral.
export function unwrap<T>(envelope: ApiEnvelope<T> | undefined | null): T {
  return envelope?.data as T
}

// Dựng query string ("?a=1&b=x" hoặc ""), bỏ giá trị rỗng/undefined/null, key đổi sang snake_case.
export function toQuery(params: QueryParams) {
  const search = new URLSearchParams()
  for (const [key, raw] of Object.entries(params)) {
    const values = Array.isArray(raw) ? raw : [raw]
    for (const value of values) {
      if (value === undefined || value === null || value === '') {
        continue
      }
      search.append(toSnakeKey(key), String(value))
    }
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}
