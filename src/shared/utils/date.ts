const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatRelativeTime(value: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(value).getTime())

  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / MINUTE))} phút trước`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} giờ trước`
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)} ngày trước`
  return new Date(value).toLocaleDateString('vi-VN')
}

export function isWithinHours(value: string, hours: number, now = Date.now()) {
  return now - new Date(value).getTime() < hours * HOUR
}
