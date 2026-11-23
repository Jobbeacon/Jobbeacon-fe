import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { JobListSkeleton } from '../../jobs/components/JobList'
import { RecommendationList } from '../components/RecommendationList'
import { useRecommendations } from '../hooks/useRecommendations'
import styles from './RecommendationsPage.module.css'

const LIST_SIZE = 20

export function RecommendationsPage() {
  const { jobs, personalized, matchedSkills, isLoading, error, reload } = useRecommendations(LIST_SIZE)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Việc làm gợi ý
        </nav>
        <h1>Việc làm gợi ý cho bạn</h1>
        <p>Dựa trên CV, sở thích tìm việc và những việc làm bạn đã xem, lưu hoặc ứng tuyển.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.resultsHead}>
          <h2 aria-live="polite">{isLoading ? 'Đang tìm việc làm phù hợp...' : 'Có thể bạn quan tâm'}</h2>
          <button className={styles.reshuffle} type="button" onClick={reload} disabled={isLoading}>
            <RefreshCw aria-hidden="true" />
            Làm mới
          </button>
        </div>

        {isLoading ? <JobListSkeleton count={4} /> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {!isLoading && !error && jobs.length === 0 ? (
          <div className={styles.empty}>
            <h3>Chưa có việc làm nào để gợi ý</h3>
            <p>Hãy cập nhật hồ sơ, tải CV hoặc lưu vài việc làm bạn quan tâm.</p>
            <Link to="/jobs">Tìm việc làm</Link>
          </div>
        ) : null}
        {!isLoading && jobs.length > 0 ? (
          <>
            {personalized ? null : (
              <div className={styles.notice}>
                Chúng tôi chưa đủ thông tin về bạn nên đang hiển thị các việc làm mới nhất.{' '}
                <Link to="/profile">Tải CV và điền sở thích tìm việc</Link> để nhận gợi ý phù hợp hơn.
              </div>
            )}
            <RecommendationList jobs={jobs} matchedSkills={matchedSkills} />
          </>
        ) : null}
      </section>
    </main>
  )
}

export default RecommendationsPage
