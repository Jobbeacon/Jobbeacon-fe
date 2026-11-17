const MILLION = 1_000_000

function formatAmount(value: number, currency: string, inMillions: boolean) {
  if (currency === 'VND' && inMillions) {
    const millions = value / MILLION
    return Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace(/\.0$/, '')
  }
  return value.toLocaleString(currency === 'VND' ? 'vi-VN' : 'en-US')
}

export function formatSalaryRange(
  minSalary: number | null,
  maxSalary: number | null,
  currency: string | null = 'VND',
) {
  const resolvedCurrency = (currency ?? 'VND').toUpperCase()
  // Lương theo giờ/ngày thường dưới 1 triệu: chia theo triệu sẽ thành "0 triệu", nên hiển thị đủ số đồng
  const inMillions = [minSalary, maxSalary].every((value) => !value || value >= MILLION)
  const unit = resolvedCurrency !== 'VND' ? resolvedCurrency : inMillions ? 'triệu' : 'đ'
  const min = minSalary ? formatAmount(minSalary, resolvedCurrency, inMillions) : null
  const max = maxSalary ? formatAmount(maxSalary, resolvedCurrency, inMillions) : null

  if (min && max) return min === max ? `${min} ${unit}` : `${min} - ${max} ${unit}`
  if (min) return `Từ ${min} ${unit}`
  if (max) return `Đến ${max} ${unit}`
  return 'Thỏa thuận'
}

const salaryPeriodLabels: Record<string, string> = {
  HOUR: 'giờ',
  DAY: 'ngày',
  WEEK: 'tuần',
  MONTH: 'tháng',
  YEAR: 'năm',
}

export function formatSalaryPeriod(salaryPeriod: string | null) {
  if (!salaryPeriod) return null
  return salaryPeriodLabels[salaryPeriod.toUpperCase()] ?? salaryPeriod.toLowerCase()
}

const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACTOR: 'Hợp đồng',
  TEMPORARY: 'Thời vụ',
  INTERN: 'Thực tập',
  VOLUNTEER: 'Tình nguyện',
  PER_DIEM: 'Theo ngày',
  OTHER: 'Khác',
}

export function formatEmploymentType(employmentType: string | null) {
  if (!employmentType) return null
  return employmentType
    .split(',')
    .map((type) => type.trim())
    .filter(Boolean)
    .map((type) => employmentTypeLabels[type.toUpperCase().replace(/[\s-]/g, '_')] ?? type)
    .join(', ')
}

export function formatExperience(experienceMonths: number | null) {
  if (!experienceMonths) return 'Không yêu cầu KN'
  if (experienceMonths < 12) return `${experienceMonths} tháng KN`
  const years = experienceMonths / 12
  return `${Number.isInteger(years) ? years : years.toFixed(1)} năm KN`
}

export function getInitials(name: string, maxLength = 3) {
  const words = name
    .replace(/\b(công ty|cổ phần|tnhh|jsc|co\.?,? ?ltd\.?)\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, maxLength).toUpperCase()
  return words
    .slice(0, maxLength)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
