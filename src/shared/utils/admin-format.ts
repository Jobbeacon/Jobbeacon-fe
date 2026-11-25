// Định dạng hiển thị dùng chung cho site quản trị (bám theo ui-mockups/admin/js/admin.js).

const numberFormat = new Intl.NumberFormat('vi-VN')

export const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACTOR: 'Hợp đồng/Freelance',
  TEMPORARY: 'Thời vụ',
  INTERN: 'Thực tập',
}

export const PERIOD_LABEL: Record<string, string> = {
  HOUR: 'giờ',
  DAY: 'ngày',
  MONTH: 'tháng',
  YEAR: 'năm',
}

export const SOURCE_LABEL: Record<string, string> = {
  'topcv.vn': 'TopCV',
  'itviec.com': 'ITviec',
}

// Tên hiển thị của nguồn crawl; nguồn chưa biết thì dùng luôn domain.
export function sourceLabel(domain: string) {
  return SOURCE_LABEL[domain] ?? domain
}

export function fmtNumber(value: number | null | undefined) {
  return numberFormat.format(value ?? 0)
}

// Lương: VND hiển thị theo "triệu", USD hiển thị số; không có min/max → "Thỏa thuận".
export function money(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined = 'VND',
  period: string | null | undefined = '',
) {
  if (!min && !max) {
    return 'Thỏa thuận'
  }
  const isUsd = currency === 'USD'
  const unit = (amount: number) => {
    if (isUsd) {
      return numberFormat.format(amount)
    }
    const value = amount / 1_000_000
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',')
  }
  const label = isUsd ? 'USD' : 'triệu'
  const per = period && PERIOD_LABEL[period] ? `/${PERIOD_LABEL[period]}` : ''
  if (min && max) {
    return `${unit(min)}–${unit(max)} ${label}${per}`
  }
  if (min) {
    return `Từ ${unit(min)} ${label}${per}`
  }
  return `Đến ${unit(max as number)} ${label}${per}`
}

const pad = (value: number) => String(value).padStart(2, '0')

// Chuỗi ngày thuần "YYYY-MM-DD" đọc nguyên văn; còn lại (Instant ISO) đổi sang giờ máy.
function toDate(iso: string) {
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (plain) {
    return new Date(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3]))
  }
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

// dd.MM.yyyy
export function shortDate(iso: string | null | undefined) {
  const date = iso ? toDate(iso) : null
  if (!date) {
    return '—'
  }
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

// dd/MM HH:mm
export function stamp(iso: string | null | undefined) {
  const date = iso ? toDate(iso) : null
  if (!date) {
    return '—'
  }
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// Số ngày (làm tròn xuống) từ thời điểm iso đến hôm nay; không có ngày → Infinity.
export function daysAgo(iso: string | null | undefined, now = new Date()) {
  const date = iso ? toDate(iso) : null
  if (!date) {
    return Number.POSITIVE_INFINITY
  }
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today.getTime() - start.getTime()) / 86_400_000)
}

export function initials(name: string | null | undefined) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) {
    return '•'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const SWATCHES = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6']

// Màu cố định theo tên (avatar chữ cái).
export function swatch(name: string | null | undefined) {
  let index = 0
  for (const char of name ?? '') {
    index += char.charCodeAt(0)
  }
  return SWATCHES[index % SWATCHES.length]
}

// Bỏ dấu tiếng Việt + lowercase để tìm kiếm/so khớp.
export function foldText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}
