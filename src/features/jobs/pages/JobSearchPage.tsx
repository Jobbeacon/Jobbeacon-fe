import { useRef } from 'react'
import { X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { JobFilters } from '../components/JobFilters'
import { JobList, JobListSkeleton } from '../components/JobList'
import { JobSearchBar } from '../components/JobSearchBar'
import { useJobs } from '../hooks/useJobs'
import styles from './JobSearchPage.module.css'

const PAGE_SIZE = 10

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function getResultsTitle(total: number, keyword: string) {
  const count = `${total.toLocaleString('vi-VN')} việc làm`
  return keyword ? `${count} cho “${keyword}”` : count
}

export function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = useRef<HTMLDivElement>(null)

  const keyword = searchParams.get('keyword') ?? ''
  const page = parsePage(searchParams.get('page'))

  const { jobs, total, isLoading, error, retry } = useJobs({ keyword, page, size: PAGE_SIZE })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const updateParams = (changes: Partial<Record<'keyword' | 'page', string>>) => {
    const next = new URLSearchParams(searchParams)
    if (!('page' in changes)) next.delete('page')
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setSearchParams(next)
  }

  const handlePageChange = (nextPage: number) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : '' })
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearSearch = () => setSearchParams(new URLSearchParams())

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Việc làm
        </nav>
        <h1>Tìm kiếm việc làm</h1>
        <JobSearchBar key={keyword} keyword={keyword} onSearch={(value) => updateParams({ keyword: value })} />
      </section>

      <div className={styles.layout}>
        <JobFilters onReset={clearSearch} />

        <div className={styles.results} ref={resultsRef}>
          <div className={styles.resultsHead}>
            <h2 aria-live="polite">{isLoading ? 'Đang tìm việc làm...' : getResultsTitle(total, keyword)}</h2>
            <span className={styles.sortNote}>Sắp xếp: Mới nhất</span>
          </div>

          {keyword ? (
            <div className={styles.activeFilters}>
              <button type="button" className={styles.chip} onClick={() => updateParams({ keyword: '' })}>
                {keyword}
                <X aria-label="Bỏ từ khóa" />
              </button>
            </div>
          ) : null}

          {isLoading ? <JobListSkeleton count={5} /> : null}
          {error ? <ErrorState message={error} onRetry={retry} /> : null}
          {!isLoading && !error && jobs.length === 0 ? (
            <div className={styles.empty}>
              <h3>Không tìm thấy việc làm phù hợp</h3>
              <p>Thử đổi hoặc bỏ từ khóa tìm kiếm.</p>
              <button type="button" onClick={clearSearch}>
                Xem tất cả việc làm
              </button>
            </div>
          ) : null}
          {jobs.length > 0 ? (
            <>
              <JobList jobs={jobs} />
              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default JobSearchPage
