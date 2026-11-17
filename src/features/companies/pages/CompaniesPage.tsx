import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { CompanyCard, CompanyCardSkeleton } from '../components/CompanyCard'
import { CompanySearchBar } from '../components/CompanySearchBar'
import { useCompanies } from '../hooks/useCompanies'
import styles from './CompaniesPage.module.css'

const PAGE_SIZE = 12

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function getResultsTitle(total: number, keyword: string) {
  const count = `${total.toLocaleString('vi-VN')} công ty`
  return keyword ? `${count} cho “${keyword}”` : count
}

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = useRef<HTMLElement>(null)

  const keyword = searchParams.get('keyword') ?? ''
  const page = parsePage(searchParams.get('page'))

  const { companies, total, isLoading, error, retry } = useCompanies({ keyword, page, size: PAGE_SIZE })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleSearch = (value: string) => {
    const next = new URLSearchParams()
    if (value) next.set('keyword', value)
    setSearchParams(next)
  }

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams)
    if (nextPage > 1) next.set('page', String(nextPage))
    else next.delete('page')
    setSearchParams(next)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearSearch = () => setSearchParams(new URLSearchParams())

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Công ty
        </nav>
        <h1>Khám phá công ty</h1>
        <CompanySearchBar key={keyword} keyword={keyword} onSearch={handleSearch} />
      </section>

      <section className={styles.section} ref={resultsRef}>
        <div className={styles.resultsHead}>
          <h2 aria-live="polite">{isLoading ? 'Đang tải công ty...' : getResultsTitle(total, keyword)}</h2>
        </div>

        {isLoading ? (
          <div className={styles.companyGrid} aria-busy="true" aria-label="Đang tải danh sách công ty">
            {Array.from({ length: 6 }, (_, index) => (
              <CompanyCardSkeleton key={index} />
            ))}
          </div>
        ) : null}
        {error ? <ErrorState message={error} onRetry={retry} /> : null}
        {!isLoading && !error && companies.length === 0 ? (
          <div className={styles.empty}>
            <h3>Không tìm thấy công ty phù hợp</h3>
            <p>Thử đổi hoặc bỏ từ khóa tìm kiếm.</p>
            <button type="button" onClick={clearSearch}>
              Xem tất cả công ty
            </button>
          </div>
        ) : null}
        {companies.length > 0 ? (
          <>
            <div className={styles.companyGrid}>
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        ) : null}
      </section>
    </main>
  )
}

export default CompaniesPage
