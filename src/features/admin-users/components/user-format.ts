// Hàm thuần hiển thị thông tin tài khoản.
import { EMPLOYMENT_LABEL, fmtNumber, money, shortDate } from '../../../shared/utils/admin-format'
import type { UserDetail, UserRow } from '../types/user.types'

export function displayNameOf(user: Pick<UserRow, 'displayName' | 'email'>) {
  return user.displayName?.trim() || user.email
}

export type MetaItem = { label: string; value: string }

const yesNo = (value: unknown) => (value ? 'Có' : 'Không')

function isEmpty(value: unknown) {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
}

function plain(value: unknown): string {
  if (Array.isArray(value)) return value.map(plain).join(', ')
  if (typeof value === 'boolean') return yesNo(value)
  if (typeof value === 'number') return fmtNumber(value)
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value)
}

// Field nguyện vọng đã biết → nhãn tiếng Việt; field lương gộp thành một dòng.
const PREFERENCE_LABEL: Record<string, string> = {
  desiredTitles: 'Vị trí muốn',
  desiredTitle: 'Vị trí muốn',
  employmentTypes: 'Hình thức',
  provinces: 'Tỉnh thành',
  remoteOk: 'Làm từ xa',
  openToWork: 'Đang tìm việc',
}

const SALARY_KEYS = new Set(['expectedSalaryMin', 'expectedSalaryMax', 'currency', 'salaryPeriod', 'salaryNegotiable'])

// Nguyện vọng việc làm → danh sách dt/dd; chỉ hiện field có giá trị, field lạ hiện nguyên key.
export function preferenceItems(preference: Record<string, unknown> | null): MetaItem[] {
  if (!preference) return []
  const items: MetaItem[] = []
  let salaryAdded = false
  for (const [key, value] of Object.entries(preference)) {
    if (SALARY_KEYS.has(key)) {
      if (salaryAdded) continue
      salaryAdded = true
      const min = Number(preference.expectedSalaryMin) || null
      const max = Number(preference.expectedSalaryMax) || null
      // Không có mức lương và không ghi "thỏa thuận" → bỏ qua dòng Lương.
      if (!min && !max && !preference.salaryNegotiable) continue
      let salary = money(min, max, (preference.currency as string) || 'VND', (preference.salaryPeriod as string) || '')
      if ((min || max) && preference.salaryNegotiable) salary += ' · có thể thỏa thuận'
      items.push({ label: 'Lương', value: salary })
      continue
    }
    if (typeof value !== 'boolean' && isEmpty(value)) continue
    if (key === 'employmentTypes' && Array.isArray(value)) {
      items.push({ label: PREFERENCE_LABEL[key], value: value.map((type) => EMPLOYMENT_LABEL[String(type)] ?? String(type)).join(', ') })
      continue
    }
    items.push({ label: PREFERENCE_LABEL[key] ?? key, value: plain(value) })
  }
  return items
}

export function cvItems(cv: UserDetail['cv']): MetaItem[] {
  if (!cv) return []
  const items: MetaItem[] = [{ label: 'Vị trí', value: cv.currentTitle || '—' }]
  items.push({
    label: 'Kinh nghiệm',
    value: cv.totalMonthsExperience === null || cv.totalMonthsExperience === undefined ? '—' : `${fmtNumber(cv.totalMonthsExperience)} tháng`,
  })
  items.push({ label: 'Kỹ năng', value: cv.skills?.length ? cv.skills.join(', ') : '—' })
  if (cv.updatedAt) items.push({ label: 'Cập nhật', value: shortDate(cv.updatedAt) })
  return items
}
