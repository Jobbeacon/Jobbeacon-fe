// Hàm thuần dùng cho biểu đồ trang tổng quan (bám theo ui-mockups/admin/js/admin.js).
import { fmtNumber, sourceLabel } from '../../../shared/utils/admin-format'
import type { ChartRow, OverviewDay, OverviewMonth } from '../types/overview.types'

// Nguồn đầu xanh, nguồn thứ hai tím nhạt, tiếp theo lấy palette.
const SOURCE_COLORS = ['#3b82f6', '#a5b4fc', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6']

export function sourceColor(index: number) {
  return SOURCE_COLORS[index % SOURCE_COLORS.length]
}

export const CHART_FONT = 'Inter, sans-serif'

// Vạch trục y "đẹp" (bước 1/2/5 × 10^n), đỉnh cao hơn max ~12%.
export function ticks(max: number, count = 4) {
  const safeMax = Math.max(max, 1)
  const rough = (safeMax * 1.12) / count
  const pow = 10 ** Math.floor(Math.log10(rough))
  const error = rough / pow
  let step = pow
  if (error >= 7.5) step = 10 * pow
  else if (error >= 3.5) step = 5 * pow
  else if (error >= 1.5) step = 2 * pow
  // Số nguyên: bước tối thiểu 1.
  step = Math.max(1, step)
  const top = Math.ceil((safeMax * 1.12) / step) * step
  const marks: number[] = []
  for (let value = 0; value <= top + step / 10; value += step) {
    marks.push(Math.round(value))
  }
  return { top, marks }
}

// Path cột bo góc trên; cao ~0 thì bỏ.
export function roundTop(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0.5) {
    return ''
  }
  const radius = Math.min(r, w / 2, h)
  return `M ${x} ${y + h} L ${x} ${y + radius} Q ${x} ${y} ${x + radius} ${y} L ${x + w - radius} ${y} Q ${x + w} ${y} ${x + w} ${y + radius} L ${x + w} ${y + h} Z`
}

// Giờ 2 chữ số: 3 -> "03"
export const pad2 = (value: number) => String(value).padStart(2, '0')

// "2026-10-15" -> "15.10"
export function dayLabel(date: string) {
  const [, month, day] = date.split('-')
  return `${day}.${month}`
}

// "2026-06" -> "T6"
export function monthLabel(month: string) {
  return `T${Number(month.split('-')[1])}`
}

export function buildDayRows(daily: OverviewDay[]): ChartRow[] {
  return daily.map((day) => {
    const [year, month, date] = day.date.split('-').map(Number)
    const weekday = new Date(year, month - 1, date).getDay()
    return {
      key: day.date,
      label: dayLabel(day.date),
      weekend: weekday === 0 || weekday === 6,
      total: day.total,
      bySource: day.bySource ?? {},
    }
  })
}

// Tháng hiện tại (chứa "today") chưa đủ tháng → gợi ý "1–19".
export function buildMonthRows(monthly: OverviewMonth[], today: string): ChartRow[] {
  const currentMonth = today.slice(0, 7)
  const day = Number(today.slice(8, 10))
  return monthly.map((month) => {
    const partial = month.month === currentMonth && !isLastDayOfMonth(today)
    return {
      key: month.month,
      label: monthLabel(month.month),
      hint: partial ? `1–${day}` : '',
      partial,
      total: month.total,
      bySource: month.bySource ?? {},
    }
  })
}

export function isLastDayOfMonth(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month, 0).getDate() === day
}

export function countOf(row: ChartRow, domain: string) {
  return row.bySource[domain] ?? 0
}

// "TopCV 12, ITviec 3"
export function sourceSummary(row: ChartRow, sources: string[], separator = ', ') {
  return sources.map((domain) => `${sourceLabel(domain)} ${fmtNumber(countOf(row, domain))}`).join(separator)
}

export function sumBy(rows: ChartRow[], domain: string) {
  return rows.reduce((total, row) => total + countOf(row, domain), 0)
}
