// Chuyển đổi giá trị form sửa tin <-> dữ liệu API (bám readSalary/salaryInput của mockup).

import { foldText } from '../../../shared/utils/admin-format'

const MILLION = 1_000_000

// Số tiền → chuỗi ô nhập: VND theo "triệu" (25 hoặc 25,5), USD giữ nguyên số.
export function salaryInput(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount === null || amount === undefined) {
    return ''
  }
  if (currency === 'USD') {
    return String(amount)
  }
  const rounded = Math.round((amount / MILLION) * 10) / 10
  return String(rounded).replace('.', ',')
}

// Chuỗi ô nhập → số tiền; rỗng → null, sai định dạng → NaN.
export function readSalary(value: string, currency: string) {
  if (currency === 'USD') {
    const text = value.trim().replace(/[.\s]/g, '')
    if (!text) {
      return null
    }
    return /^\d+$/.test(text) ? Number(text) : Number.NaN
  }
  const text = value.trim().replace(',', '.')
  if (!text) {
    return null
  }
  const number = Number(text)
  return Number.isFinite(number) && number >= 0 ? Math.round(number * MILLION) : Number.NaN
}

// Như readSalary, nhưng ô không đổi (cùng tiền tệ) thì giữ nguyên số gốc để không làm tròn mất dữ liệu.
export function readSalaryKeeping(
  value: string,
  currency: string,
  original: number | null | undefined,
  originalCurrency: string | null | undefined,
) {
  const sameCurrency = (originalCurrency || 'VND') === currency
  if (original !== null && original !== undefined && sameCurrency && salaryInput(original, currency) === value) {
    return original
  }
  return readSalary(value, currency)
}

const pad = (value: number) => String(value).padStart(2, '0')

// Instant ISO → "YYYY-MM-DD" theo giờ máy cho <input type="date">.
export function toDateInput(iso: string | null | undefined) {
  if (!iso) {
    return ''
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// "YYYY-MM-DD" → Instant ISO (0h giờ máy). Không đổi ngày thì giữ nguyên giá trị gốc.
export function fromDateInput(value: string, original: string | null | undefined) {
  if (!value) {
    return null
  }
  if (original && toDateInput(original) === value) {
    return original
  }
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toISOString()
}

export function isExpired(expiredDate: string | null | undefined, now = new Date()) {
  if (!expiredDate) {
    return false
  }
  const date = new Date(expiredDate)
  return !Number.isNaN(date.getTime()) && date.getTime() <= now.getTime()
}

export const sameText = (a: string, b: string) => foldText(a).trim() === foldText(b).trim()

// Tìm phần tử theo tên (bỏ dấu, không phân biệt hoa thường).
export function findByName<T>(items: T[], raw: string, nameOf: (item: T) => string) {
  return items.find((item) => sameText(nameOf(item), raw))
}

export function blankToNull(value: string) {
  const text = value.trim()
  return text ? text : null
}
