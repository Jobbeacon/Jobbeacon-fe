import { useRef } from 'react'
import { X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { JobFilters } from '../components/JobFilters'
import type { JobFiltersState } from '../components/JobFilters'
import { JobList, JobListSkeleton } from '../components/JobList'
import { JobSearchBar } from '../components/JobSearchBar'
import { locationChipGroups } from '../utils/locationPlaces'
import { useJobs } from '../hooks/useJobs'
import styles from './JobSearchPage.module.css'

const PAGE_SIZE = 10

const filterLabels: Record<string, string> = {
  none: 'Không nêu yêu cầu KN',
  y1_3: '1 - 3 năm',
  y3_5: '3 - 5 năm',
  y5: 'Trên 5 năm',
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACTOR: 'Hợp đồng',
  INTERN: 'Thực tập',
  '24h': '24 giờ qua',
  '7d': '7 ngày qua',
  '30d': '30 ngày qua',
}

const listKeys = [
  'categories',
  'experience',
  'employment_types',
  'posted_within',
  'sources',
] as const

type ListParam = (typeof listKeys)[number]

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function readList(params: URLSearchParams, key: string) {
  return (params.get(key) ?? '').split(',').map((item) => item.trim()).filter(Boolean)
}

function labelOf(value: string) {
  return filterLabels[value] ?? value
}

function formatSalaryMillions(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function readPlaces(location: string) {
  return location.split('|').map((item) => item.trim()).filter(Boolean)
}

function getResultsTitle(total: number, keyword: string, location: string) {
  const count = `${total.toLocaleString('vi-VN')} việc làm`
  const keywordPart = keyword ? ` cho “${keyword}”` : ''
  const places = readPlaces(location)
  const locationPart =
    places.length === 1 ? ` tại ${places[0]}` : places.length > 1 ? ` tại ${places.length} địa điểm` : ''
  return `${count}${keywordPart}${locationPart}`
}

export function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = useRef<HTMLDivElement>(null)

  const keyword = searchParams.get('keyword') ?? ''
  const location = searchParams.get('location') ?? ''
  const locationPlaces = readPlaces(location)
  const page = parsePage(searchParams.get('page'))
  const sortBy = searchParams.get('sort_by') ?? 'posted_date'
  const filters: JobFiltersState = {
    locations: readList(searchParams, 'locations'),
    categories: readList(searchParams, 'categories'),
    skills: readList(searchParams, 'skills'),
    minSalary: searchParams.get('min_salary') ?? '',
    maxSalary: searchParams.get('max_salary') ?? '',
    experience: readList(searchParams, 'experience'),
    employmentTypes: readList(searchParams, 'employment_types'),
    postedWithin: readList(searchParams, 'posted_within'),
    sources: readList(searchParams, 'sources'),
  }

  const { jobs, total, isLoading, isInitialLoading, error, retry } = useJobs({
    keyword,
    location,
    locations: [],
    categories: filters.categories,
    skills: filters.skills,
    minSalary: filters.minSalary,
    maxSalary: filters.maxSalary,
    experience: filters.experience,
    employmentTypes: filters.employmentTypes,
    postedWithin: filters.postedWithin,
    sources: filters.sources,
    sortBy,
    page,
    size: PAGE_SIZE,
  })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const replaceParams = (mutate: (next: URLSearchParams) => void, resetPage = true) => {
    const next = new URLSearchParams(searchParams)
    if (resetPage) next.delete('page')
    mutate(next)
    setSearchParams(next)
  }

  const handlePageChange = (nextPage: number) => {
    replaceParams((next) => {
      if (nextPage > 1) next.set('page', String(nextPage))
      else next.delete('page')
    }, false)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearSearch = () => setSearchParams(new URLSearchParams())

  const revealResults = () => {
    const results = resultsRef.current
    if (!results) return
    const top = results.getBoundingClientRect().top
    const visible = top >= 72 && top < window.innerHeight * 0.55
    if (!visible) {
      results.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const applyFilters = (nextFilters: JobFiltersState) => {
    replaceParams((next) => {
      const write = (key: ListParam | 'skills', values: string[]) => {
        if (values.length) next.set(key, values.join(','))
        else next.delete(key)
      }
      next.delete('locations')
      write('skills', nextFilters.skills)
      write('categories', nextFilters.categories)
      write('experience', nextFilters.experience)
      write('employment_types', nextFilters.employmentTypes)
      write('posted_within', nextFilters.postedWithin)
      write('sources', nextFilters.sources)
      if (nextFilters.minSalary) next.set('min_salary', nextFilters.minSalary)
      else next.delete('min_salary')
      if (nextFilters.maxSalary) next.set('max_salary', nextFilters.maxSalary)
      else next.delete('max_salary')
    })
    revealResults()
  }

  const chips = [
    ...(keyword ? [{ label: keyword, remove: () => replaceParams((next) => next.delete('keyword')) }] : []),
    ...locationChipGroups(locationPlaces).map((group) => ({
      label: group.label,
      remove: () =>
        replaceParams((next) => {
          const remaining = locationPlaces.filter((item) => !group.places.includes(item))
          if (remaining.length) next.set('location', remaining.join('|'))
          else next.delete('location')
        }),
    })),
    ...filters.skills.map((skill) => ({
      label: `Skill: ${skill}`,
      remove: () =>
        replaceParams((next) => {
          const remaining = filters.skills.filter((item) => item !== skill)
          if (remaining.length) next.set('skills', remaining.join(','))
          else next.delete('skills')
        }),
    })),
    ...listKeys.flatMap((key) =>
      readList(searchParams, key).map((value) => ({
        label: labelOf(value),
        remove: () =>
          replaceParams((next) => {
            const remaining = readList(searchParams, key).filter((item) => item !== value)
            if (remaining.length) next.set(key, remaining.join(','))
            else next.delete(key)
          }),
      })),
    ),
    ...(filters.minSalary
      ? [{ label: `Từ ${formatSalaryMillions(filters.minSalary)} triệu`, remove: () => replaceParams((next) => next.delete('min_salary')) }]
      : []),
    ...(filters.maxSalary
      ? [{ label: `Đến ${formatSalaryMillions(filters.maxSalary)} triệu`, remove: () => replaceParams((next) => next.delete('max_salary')) }]
      : []),
  ]

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Việc làm
        </nav>
        <h1>Tìm kiếm việc làm</h1>
        <p>Tổng hợp tin tuyển dụng từ nhiều trang tuyển dụng.</p>
        <JobSearchBar
          keyword={keyword}
          location={location}
          categories={filters.categories}
          onCategoriesChange={(categories) => applyFilters({ ...filters, categories })}
          onSearch={(nextKeyword, nextLocation) =>
            replaceParams((next) => {
              if (nextKeyword) next.set('keyword', nextKeyword)
              else next.delete('keyword')
              if (nextLocation) next.set('location', nextLocation)
              else next.delete('location')
            })
          }
        />
      </section>

      <div className={styles.layout}>
        <JobFilters value={filters} onChange={applyFilters} onReset={clearSearch} />

        <div className={styles.results} ref={resultsRef}>
          <div className={styles.resultsHead}>
            <h2 aria-live="polite">{getResultsTitle(total, keyword, location)}</h2>
            <select
              className={styles.sortSelect}
              aria-label="Sắp xếp"
              value={sortBy}
              onChange={(event) =>
                replaceParams((next) => {
                  if (event.target.value === 'posted_date') next.delete('sort_by')
                  else next.set('sort_by', event.target.value)
                })
              }
            >
              <option value="posted_date">Mới nhất</option>
              <option value="relevance">Phù hợp nhất</option>
              <option value="max_salary">Lương cao đến thấp</option>
            </select>
          </div>

          {chips.length > 0 ? (
            <div className={styles.activeFilters}>
              {chips.map((chip, index) => (
                <button type="button" className={styles.chip} key={`${chip.label}-${index}`} onClick={chip.remove}>
                  {chip.label}
                  <X aria-label={`Bỏ ${chip.label}`} />
                </button>
              ))}
            </div>
          ) : null}

          {isInitialLoading ? <JobListSkeleton count={5} /> : null}
          {error ? <ErrorState message={error} onRetry={retry} /> : null}
          {!isInitialLoading && !isLoading && !error && jobs.length === 0 ? (
            <div className={styles.empty}>
              <h3>Không tìm thấy việc làm phù hợp</h3>
              <p>Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
              <button type="button" onClick={clearSearch}>
                Xem tất cả việc làm
              </button>
            </div>
          ) : null}
          {jobs.length > 0 ? (
            <div className={isLoading ? styles.resultsBusy : undefined} aria-busy={isLoading}>
              <JobList jobs={jobs} />
              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default JobSearchPage
