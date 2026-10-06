import { useEffect, useRef, useState } from 'react'
import { getJobFacets } from '../api/jobs.api'
import type { FacetItem } from '../types/job.types'
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
  | 'locations'
  | 'categories'
  | 'skills'
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
    key: 'locations',
    title: 'Địa điểm',
    options: [
      { value: 'Hà Nội', label: 'Hà Nội' },
      { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
      { value: 'Đà Nẵng', label: 'Đà Nẵng' },
      { value: 'Remote', label: 'Remote' },
    ],
  },
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

  const [facets, setFacets] = useState<{ categories: FacetItem[]; skills: FacetItem[] } | null>(null)
  const [facetsFailed, setFacetsFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    void getJobFacets(controller.signal)
      .then((data) => setFacets(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setFacetsFailed(true)
      })
    return () => controller.abort()
  }, [])

  return (
    <aside className={styles.filterCard} aria-label="Bộ lọc">
      <h2>
        Bộ lọc
        <button type="button" onClick={onReset}>
          Xóa lọc
        </button>
      </h2>

      <FilterGroupView group={groups[0]} value={value} onChange={onChange} />
      <FacetGroup
        title="Ngành nghề"
        items={facets?.categories ?? null}
        failed={facetsFailed}
        selected={value.categories}
        emptyNote="Chưa có tin nào được gán ngành."
        searchLabel="Tìm ngành nghề"
        onToggle={(name) => onChange({ ...value, categories: toggle(value.categories, name) })}
      />
      <FacetGroup
        title="Kỹ năng"
        items={facets?.skills ?? null}
        failed={facetsFailed}
        selected={value.skills}
        emptyNote="Chưa có kỹ năng nào được lưu trên tin."
        searchLabel="Tìm kỹ năng"
        onToggle={(name) => onChange({ ...value, skills: toggle(value.skills, name) })}
      />

      <fieldset className={styles.group}>
        <legend>Mức lương (triệu)</legend>
        <div className={styles.salaryRow}>
          <input
            inputMode="numeric"
            placeholder="Từ"
            aria-label="Lương từ"
            value={minSalary}
            onChange={(event) => {
              const nextMin = event.target.value.replace(/[^\d]/g, '')
              setMinSalary(nextMin)
              commitSalary(nextMin, maxSalary)
            }}
          />
          <input
            inputMode="numeric"
            placeholder="Đến"
            aria-label="Lương đến"
            value={maxSalary}
            onChange={(event) => {
              const nextMax = event.target.value.replace(/[^\d]/g, '')
              setMaxSalary(nextMax)
              commitSalary(minSalary, nextMax)
            }}
          />
        </div>
      </fieldset>

      {groups.slice(1).map((group) => (
        <FilterGroupView key={group.key} group={group} value={value} onChange={onChange} />
      ))}
    </aside>
  )
}

const FACET_PREVIEW = 6

function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
}

function FacetGroup({
  title,
  items,
  failed,
  selected,
  emptyNote,
  searchLabel,
  onToggle,
}: {
  title: string
  items: FacetItem[] | null
  failed: boolean
  selected: string[]
  emptyNote: string
  searchLabel: string
  onToggle: (name: string) => void
}) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const needle = fold(query.trim())
  const matched = (items ?? []).filter((item) => {
    if (needle) return fold(item.name).includes(needle)
    return item.count > 0 || selected.includes(item.name)
  })
  const picked = matched.filter((item) => selected.includes(item.name))
  const rest = matched.filter((item) => !selected.includes(item.name))
  const ordered = [...picked, ...rest]
  const visible = needle || expanded ? ordered : ordered.slice(0, Math.max(FACET_PREVIEW, picked.length))
  const hiddenCount = ordered.length - visible.length

  return (
    <fieldset className={styles.group}>
      <legend>{title}</legend>
      {items === null && !failed ? <p className={styles.facetStatus}>Đang tải...</p> : null}
      {failed ? <p className={styles.facetStatus}>Không tải được danh sách.</p> : null}
      {items && items.length > FACET_PREVIEW && (needle || items.some((item) => item.count > 0)) ? (
        <input
          className={styles.facetSearch}
          value={query}
          placeholder={searchLabel}
          aria-label={searchLabel}
          onChange={(event) => setQuery(event.target.value)}
        />
      ) : null}
      {visible.length > 0 ? (
        <div className={needle || expanded ? styles.facetList : undefined}>
          {visible.map((item) => (
            <label className={styles.option} key={item.name} title={item.name}>
              <input type="checkbox" checked={selected.includes(item.name)} onChange={() => onToggle(item.name)} />
              <span className={styles.optionName}>{item.name}</span>
              <span className={styles.optionCount}>{item.count.toLocaleString('vi-VN')}</span>
            </label>
          ))}
        </div>
      ) : null}
      {items && ordered.length === 0 ? <p className={styles.facetStatus}>{needle ? 'Không có kết quả' : emptyNote}</p> : null}
      {hiddenCount > 0 ? (
        <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
          Xem thêm {hiddenCount}
        </button>
      ) : null}
      {expanded && !needle && ordered.length > FACET_PREVIEW ? (
        <button type="button" className={styles.more} onClick={() => setExpanded(false)}>
          Thu gọn
        </button>
      ) : null}
    </fieldset>
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
