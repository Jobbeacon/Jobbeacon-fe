import { useRef, useState } from 'react'
import styles from './JobFilters.module.css'

type Option = {
  value: string
  label: string
}

type FilterGroup = {
  key: ListKey
  title: string
  options: Option[]
}

type ListKey =
  | 'categories'
  | 'experience'
  | 'employmentTypes'
  | 'postedWithin'
  | 'sources'

export type JobFiltersState = {
  locations: string[]
  categories: string[]
  skills: string[]
  minSalary: string
  maxSalary: string
  experience: string[]
  employmentTypes: string[]
  postedWithin: string[]
  sources: string[]
}

const groups: FilterGroup[] = [
  {
    key: 'experience',
    title: 'Kinh nghiệm',
    options: [
      { value: 'none', label: 'Chưa có KN' },
      { value: 'y1_3', label: '1 - 3 năm' },
      { value: 'y3_5', label: '3 - 5 năm' },
      { value: 'y5', label: 'Trên 5 năm' },
    ],
  },
  {
    key: 'employmentTypes',
    title: 'Loại hình',
    options: [
      { value: 'FULL_TIME', label: 'Full-time' },
      { value: 'PART_TIME', label: 'Part-time' },
      { value: 'CONTRACT', label: 'Hợp đồng' },
      { value: 'INTERNSHIP', label: 'Internship' },
    ],
  },
  {
    key: 'postedWithin',
    title: 'Ngày đăng',
    options: [
      { value: '24h', label: '24 giờ qua' },
      { value: '7d', label: '7 ngày qua' },
      { value: '30d', label: '30 ngày qua' },
    ],
  },
  {
    key: 'sources',
    title: 'Nguồn tuyển dụng',
    options: [
      { value: 'topcv.vn', label: 'TopCV' },
      { value: 'itviec.com', label: 'ITviec' },
      { value: 'vietnamworks.com', label: 'VietnamWorks' },
      { value: 'careerviet.vn', label: 'CareerViet' },
    ],
  },
]

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

const SALARY_SUGGESTIONS = [
  { label: 'Dưới 10 triệu', min: '', max: '10' },
  { label: '10 - 15 triệu', min: '10', max: '15' },
  { label: '15 - 20 triệu', min: '15', max: '20' },
  { label: '20 - 30 triệu', min: '20', max: '30' },
  { label: '30 - 50 triệu', min: '30', max: '50' },
  { label: 'Trên 50 triệu', min: '50', max: '' },
]

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function formatThousands(digits: string) {
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

type JobFiltersProps = {
  value: JobFiltersState
  onChange: (value: JobFiltersState) => void
  onReset: () => void
}

export function JobFilters({ value, onChange, onReset }: JobFiltersProps) {
  const [minSalary, setMinSalary] = useState(value.minSalary)
  const [maxSalary, setMaxSalary] = useState(value.maxSalary)
  const salaryKey = `${value.minSalary}|${value.maxSalary}`
  const [seenSalary, setSeenSalary] = useState(salaryKey)
  const salaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (salaryKey !== seenSalary) {
    setSeenSalary(salaryKey)
    setMinSalary(value.minSalary)
    setMaxSalary(value.maxSalary)
  }

  const commitSalary = (nextMin: string, nextMax: string) => {
    if (salaryTimer.current) clearTimeout(salaryTimer.current)
    salaryTimer.current = setTimeout(() => {
      onChange({ ...value, minSalary: nextMin, maxSalary: nextMax })
    }, 450)
  }

  return (
    <aside className={styles.filterCard} aria-label="Bộ lọc">
      <h2>
        Bộ lọc
        <button type="button" onClick={onReset}>
          Xóa lọc
        </button>
      </h2>
      <div className={styles.filterBody}>
      <fieldset className={styles.group}>
        <legend>Mức lương</legend>
        <div className={styles.salaryOptions}>
        {SALARY_SUGGESTIONS.map((suggestion) => {
          const checked = minSalary === suggestion.min && maxSalary === suggestion.max
          return (
            <label className={styles.option} key={suggestion.label}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const nextMin = checked ? '' : suggestion.min
                  const nextMax = checked ? '' : suggestion.max
                  setMinSalary(nextMin)
                  setMaxSalary(nextMax)
                  commitSalary(nextMin, nextMax)
                }}
              />
              <span>{suggestion.label}</span>
            </label>
          )
        })}
        </div>
        <div className={styles.salaryRow}>
          <input
            inputMode="numeric"
            placeholder="Từ"
            aria-label="Lương từ, triệu đồng"
            value={formatThousands(minSalary)}
            onChange={(event) => {
              const nextMin = digitsOnly(event.target.value)
              setMinSalary(nextMin)
              commitSalary(nextMin, maxSalary)
            }}
          />
          <input
            inputMode="numeric"
            placeholder="Đến"
            aria-label="Lương đến, triệu đồng"
            value={formatThousands(maxSalary)}
            onChange={(event) => {
              const nextMax = digitsOnly(event.target.value)
              setMaxSalary(nextMax)
              commitSalary(minSalary, nextMax)
            }}
          />
        </div>
        <p className={styles.facetStatus}>Đơn vị triệu đồng.</p>
      </fieldset>

      {groups.map((group) => (
        <FilterGroupView key={group.key} group={group} value={value} onChange={onChange} />
      ))}
      </div>
    </aside>
  )
}

function FilterGroupView({
  group,
  value,
  onChange,
}: {
  group: FilterGroup
  value: JobFiltersState
  onChange: (value: JobFiltersState) => void
}) {
  const selected = value[group.key]

  return (
    <fieldset className={styles.group}>
      <legend>{group.title}</legend>
      {group.options.map((option) => (
        <label className={styles.option} key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => onChange({ ...value, [group.key]: toggle(selected, option.value) })}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}
