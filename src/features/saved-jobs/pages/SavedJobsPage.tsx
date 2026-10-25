import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { JobListSkeleton } from '../../jobs/components/JobList'
import { SavedJobList } from '../components/SavedJobList'
import { useSavedJobsState } from '../hooks/useSavedJob'
import { useSavedJobs } from '../hooks/useSavedJobs'
import styles from './SavedJobsPage.module.css'

const PAGE_SIZE = 10

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function SavedJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = useRef<HTMLElement>(null)
  const page = parsePage(searchParams.get('page'))

  const { jobs, total, isLoading, error, retry } = useSavedJobs(page, PAGE_SIZE)
  const { isReady, isSaved } = useSavedJobsState()
  // job vừa bỏ lưu biến mất ngay, không cần tải lại trang
  const visibleJobs = isReady ? jobs.filter((job) => isSaved(job.id)) : jobs
  const visibleTotal = Math.max(total - (jobs.length - visibleJobs.length), 0)
  const totalPages = Math.ceil(visibleTotal / PAGE_SIZE)

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams)
    if (nextPage > 1) next.set('page', String(nextPage))
    else next.delete('page')
    setSearchParams(next)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Việc làm đã lưu
        </nav>
        <h1>Việc làm đã lưu</h1>
      </section>

      <section className={styles.section} ref={resultsRef}>
        <div className={styles.resultsHead}>
          <h2 aria-live="polite">
            {isLoading ? 'Đang tải việc làm đã lưu...' : `${visibleTotal.toLocaleString('vi-VN')} việc làm đã lưu`}
          </h2>
        </div>

        {isLoading ? <JobListSkeleton count={4} /> : null}
        {error ? <ErrorState message={error} onRetry={retry} /> : null}
        {!isLoading && !error && visibleJobs.length === 0 ? (
          <div className={styles.empty}>
            <h3>Bạn chưa lưu việc làm nào</h3>
            <p>Bấm biểu tượng trái tim trên tin tuyển dụng để lưu lại và xem sau.</p>
            <Link to="/jobs">Tìm việc làm</Link>
          </div>
        ) : null}
        {!isLoading && visibleJobs.length > 0 ? (
          <>
            <SavedJobList jobs={visibleJobs} />
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        ) : null}
      </section>
    </main>
  )
}

export default SavedJobsPage
