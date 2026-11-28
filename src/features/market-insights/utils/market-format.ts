const MILLION = 1_000_000
const SCALE_STEPS = [5, 10, 20, 50, 100].map((millions) => millions * MILLION)

/** 21500000 -> "21,5 triệu". */
export function formatMillions(value: number | null) {
  if (value === null) return '—'
  return `${(value / MILLION).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`
}

/** Short form for axis ticks: 20000000 -> "20tr". */
export function formatMillionsShort(value: number) {
  return `${(value / MILLION).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}tr`
}

export function formatCount(value: number) {
  return value.toLocaleString('vi-VN')
}

export function formatShare(value: number) {
  return `${(value * 100).toLocaleString('vi-VN', { maximumFractionDigits: value < 0.1 ? 1 : 0 })}%`
}

/** "2026-11-16" -> "16/11". */
export function formatWeek(week: string) {
  const [, month, day] = week.split('-')
  return `${day}/${month}`
}

/** A salary axis from 0 with at most 5 round ticks covering `max`. */
export function salaryScale(max: number) {
  const step = SCALE_STEPS.find((candidate) => Math.ceil(max / candidate) <= 5) ?? SCALE_STEPS[SCALE_STEPS.length - 1]
  const top = Math.max(step, Math.ceil(max / step) * step)
  const ticks: number[] = []
  for (let tick = 0; tick <= top; tick += step) ticks.push(tick)
  return { top, ticks }
}
