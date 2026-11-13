import type {
  JobPreference,
  JobPreferenceFormValues,
  JobPreferenceRequestDto,
  SalaryCurrency,
} from '../types/candidate-profile.types'

export const MAX_DESIRED_TITLES = 5
export const MAX_TITLE_LENGTH = 100
export const MAX_PROVINCES = 5

const VND_UNIT = 1_000_000

// VND nhập theo "triệu" trên UI, USD nhập số đầy đủ.
function getSalaryUnit(currency: SalaryCurrency) {
  return currency === 'VND' ? VND_UNIT : 1
}

function formatSalaryInput(amount: number | null, currency: SalaryCurrency) {
  if (amount === null) return ''
  return String(amount / getSalaryUnit(currency))
}

function parseSalaryInput(input: string): number | null | undefined {
  const normalized = input.trim().replace(',', '.')
  if (!normalized) return null
  const value = Number(normalized)
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

export function toFormValues(preference: JobPreference): JobPreferenceFormValues {
  return {
    desiredTitles: preference.desiredTitles,
    provinceIds: preference.provinces.map((province) => province.id),
    employmentTypes: preference.employmentTypes,
    remoteOk: preference.remoteOk,
    salaryMin: formatSalaryInput(preference.expectedSalaryMin, preference.currency),
    salaryMax: formatSalaryInput(preference.expectedSalaryMax, preference.currency),
    currency: preference.currency,
    salaryPeriod: preference.salaryPeriod,
    salaryNegotiable: preference.salaryNegotiable,
    openToWork: preference.openToWork,
  }
}

/** Trả về thông báo lỗi đầu tiên, hoặc null nếu hợp lệ. */
export function validateFormValues(values: JobPreferenceFormValues) {
  if (values.desiredTitles.length > MAX_DESIRED_TITLES) {
    return `Chỉ được chọn tối đa ${MAX_DESIRED_TITLES} vị trí mong muốn.`
  }
  if (values.desiredTitles.some((title) => title.trim().length > MAX_TITLE_LENGTH)) {
    return `Mỗi vị trí mong muốn tối đa ${MAX_TITLE_LENGTH} ký tự.`
  }
  if (values.provinceIds.length > MAX_PROVINCES) {
    return `Chỉ được chọn tối đa ${MAX_PROVINCES} tỉnh/thành.`
  }

  const min = parseSalaryInput(values.salaryMin)
  const max = parseSalaryInput(values.salaryMax)
  if (min === undefined || max === undefined) {
    return 'Mức lương phải là số không âm.'
  }
  if (min !== null && max !== null && min > max) {
    return 'Mức lương tối thiểu không được lớn hơn mức lương tối đa.'
  }
  return null
}

/** Gọi sau khi validateFormValues trả về null. */
export function toRequestDto(values: JobPreferenceFormValues): JobPreferenceRequestDto {
  const unit = getSalaryUnit(values.currency)
  const toAmount = (input: string) => {
    const value = parseSalaryInput(input)
    return value === null || value === undefined ? null : Math.round(value * unit)
  }

  return {
    desired_titles: values.desiredTitles.map((title) => title.trim()).filter(Boolean),
    province_ids: values.provinceIds,
    employment_types: values.employmentTypes,
    remote_ok: values.remoteOk,
    expected_salary_min: toAmount(values.salaryMin),
    expected_salary_max: toAmount(values.salaryMax),
    currency: values.currency,
    salary_period: values.salaryPeriod,
    salary_negotiable: values.salaryNegotiable,
    open_to_work: values.openToWork,
  }
}
