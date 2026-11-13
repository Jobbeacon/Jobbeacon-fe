import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import type { LocationItem } from '../../jobs/types/job.types'
import {
  EMPLOYMENT_TYPE_LABELS,
  SALARY_PERIOD_LABELS,
} from '../types/candidate-profile.types'
import type {
  EmploymentType,
  JobPreferenceFormValues,
  SalaryCurrency,
  SalaryPeriod,
} from '../types/candidate-profile.types'
import { MAX_DESIRED_TITLES, MAX_PROVINCES, MAX_TITLE_LENGTH } from '../utils/job-preference-form'
import { Combobox } from './Combobox'
import styles from './ProfileForm.module.css'

// So khớp không dấu: "ha noi" ra "Hà Nội".
function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
}

const UI_EMPLOYMENT_TYPES: EmploymentType[] = ['FULL_TIME', 'PART_TIME']
const CURRENCIES: SalaryCurrency[] = ['VND', 'USD']
const UI_SALARY_PERIODS: SalaryPeriod[] = ['MONTH', 'YEAR']

type ProfileFormProps = {
  value: JobPreferenceFormValues
  provinces: LocationItem[]
  onChange: (value: JobPreferenceFormValues) => void
  onSubmit: (value: JobPreferenceFormValues) => void
  isSubmitting?: boolean
  isNew?: boolean
  notice?: { message: string; tone: 'success' | 'error' } | null
}

export function ProfileForm({
  value,
  provinces,
  onChange,
  onSubmit,
  isSubmitting = false,
  isNew = false,
  notice,
}: ProfileFormProps) {
  const [titleInput, setTitleInput] = useState('')
  const [provinceInput, setProvinceInput] = useState('')

  const update = <K extends keyof JobPreferenceFormValues>(key: K, next: JobPreferenceFormValues[K]) => {
    onChange({ ...value, [key]: next })
  }

  const canAddTitle = value.desiredTitles.length < MAX_DESIRED_TITLES

  const addTitle = () => {
    const title = titleInput.trim().replace(/,$/, '').trim()
    setTitleInput('')
    if (!title || !canAddTitle) return
    const exists = value.desiredTitles.some((item) => item.toLowerCase() === title.toLowerCase())
    if (!exists) update('desiredTitles', [...value.desiredTitles, title])
  }

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTitle()
    } else if (event.key === 'Backspace' && !titleInput && value.desiredTitles.length > 0) {
      update('desiredTitles', value.desiredTitles.slice(0, -1))
    }
  }

  const provinceName = (id: string) => provinces.find((province) => province.id === id)?.name ?? id
  const provinceQuery = normalizeSearch(provinceInput)
  const availableProvinces = provinces.filter(
    (province) =>
      !value.provinceIds.includes(province.id) && normalizeSearch(province.name).includes(provinceQuery),
  )

  const addProvince = (id: string) => {
    if (!id || value.provinceIds.includes(id) || value.provinceIds.length >= MAX_PROVINCES) return
    setProvinceInput('')
    update('provinceIds', [...value.provinceIds, id])
  }

  // Giữ hình thức đang lưu (vd. CONTRACTOR) nếu khác các lựa chọn của UI để user còn bỏ chọn được.
  const employmentTypes = [
    ...UI_EMPLOYMENT_TYPES,
    ...value.employmentTypes.filter((type) => !UI_EMPLOYMENT_TYPES.includes(type)),
  ]

  const toggleEmploymentType = (type: EmploymentType) => {
    update(
      'employmentTypes',
      value.employmentTypes.includes(type)
        ? value.employmentTypes.filter((item) => item !== type)
        : [...value.employmentTypes, type],
    )
  }

  // Giữ kỳ trả lương đang lưu (HOUR/DAY) nếu khác các lựa chọn của UI.
  const salaryPeriods = UI_SALARY_PERIODS.includes(value.salaryPeriod)
    ? UI_SALARY_PERIODS
    : [...UI_SALARY_PERIODS, value.salaryPeriod]
  const salaryUnit = value.currency === 'VND' ? 'triệu' : 'USD'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>Sở thích tìm việc</h2>
        {isNew ? <p>Bạn chưa khai sở thích tìm việc. Điền thông tin để nhận gợi ý phù hợp hơn.</p> : null}
      </div>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={value.openToWork}
          onChange={(event) => update('openToWork', event.target.checked)}
        />
        <span>Tôi đang tìm việc</span>
      </label>

      <div className={styles.field}>
        <label htmlFor="titleInput">
          Vị trí mong muốn <span className={styles.hint}>(tối đa {MAX_DESIRED_TITLES})</span>
        </label>
        <div className={styles.tagEditor}>
          {value.desiredTitles.map((title) => (
            <span key={title} className={styles.tag}>
              {title}
              <button
                type="button"
                onClick={() => update('desiredTitles', value.desiredTitles.filter((item) => item !== title))}
                aria-label={`Xóa vị trí ${title}`}
              >
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
          {canAddTitle ? (
            <input
              id="titleInput"
              className={styles.tagInput}
              value={titleInput}
              maxLength={MAX_TITLE_LENGTH}
              placeholder="VD: Backend Developer"
              onChange={(event) => setTitleInput(event.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={addTitle}
            />
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="provinceSelect">
          Tỉnh/thành <span className={styles.hint}>(tối đa {MAX_PROVINCES})</span>
        </label>
        <div className={styles.tagEditor}>
          {value.provinceIds.map((id) => (
            <span key={id} className={styles.tag}>
              {provinceName(id)}
              <button
                type="button"
                onClick={() => update('provinceIds', value.provinceIds.filter((item) => item !== id))}
                aria-label={`Xóa ${provinceName(id)}`}
              >
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
          {value.provinceIds.length < MAX_PROVINCES ? (
            <Combobox
              id="provinceSelect"
              compact
              openWhenEmpty
              value={provinceInput}
              onValueChange={setProvinceInput}
              options={availableProvinces}
              status={provinces.length === 0 ? 'Đang tải danh sách tỉnh/thành...' : 'Không tìm thấy tỉnh/thành.'}
              placeholder="Thêm tỉnh/thành"
              onSelect={(province) => addProvince(province.id)}
            />
          ) : null}
        </div>
      </div>

      <fieldset className={styles.field}>
        <legend>Hình thức làm việc</legend>
        <div className={styles.choices}>
          {employmentTypes.map((type) => (
            <label key={type} className={styles.choice}>
              <input
                type="checkbox"
                checked={value.employmentTypes.includes(type)}
                onChange={() => toggleEmploymentType(type)}
              />
              <span>{EMPLOYMENT_TYPE_LABELS[type]}</span>
            </label>
          ))}
          <label className={styles.choice}>
            <input
              type="checkbox"
              checked={value.remoteOk}
              onChange={(event) => update('remoteOk', event.target.checked)}
            />
            <span>Chấp nhận remote</span>
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.field}>
        <legend>Mức lương kỳ vọng</legend>
        <div className={styles.salaryRow}>
          <input
            aria-label={`Lương tối thiểu (${salaryUnit})`}
            inputMode="decimal"
            value={value.salaryMin}
            placeholder={`Từ (${salaryUnit})`}
            onChange={(event) => update('salaryMin', event.target.value)}
          />
          <span className={styles.salaryDash}>–</span>
          <input
            aria-label={`Lương tối đa (${salaryUnit})`}
            inputMode="decimal"
            value={value.salaryMax}
            placeholder={`Đến (${salaryUnit})`}
            onChange={(event) => update('salaryMax', event.target.value)}
          />
          <select
            aria-label="Tiền tệ"
            value={value.currency}
            onChange={(event) => update('currency', event.target.value as SalaryCurrency)}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <select
            aria-label="Kỳ trả lương"
            value={value.salaryPeriod}
            onChange={(event) => update('salaryPeriod', event.target.value as SalaryPeriod)}
          >
            {salaryPeriods.map((period) => (
              <option key={period} value={period}>{SALARY_PERIOD_LABELS[period]}</option>
            ))}
          </select>
        </div>
        <label className={styles.choice}>
          <input
            type="checkbox"
            checked={value.salaryNegotiable}
            onChange={(event) => update('salaryNegotiable', event.target.checked)}
          />
          <span>Có thể thỏa thuận</span>
        </label>
      </fieldset>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu sở thích'}
        </button>
        {notice ? (
          <p
            className={notice.tone === 'error' ? `${styles.notice} ${styles.noticeError}` : styles.notice}
            role={notice.tone === 'error' ? 'alert' : 'status'}
          >
            {notice.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
