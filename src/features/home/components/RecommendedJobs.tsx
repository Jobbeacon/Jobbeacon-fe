import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { JobCard } from '../../jobs/components/JobCard'
import { useRecommendations } from '../../recommendations/hooks/useRecommendations'
import styles from './RecommendedJobs.module.css'

const RECOMMENDED_JOBS_LIMIT = 4

// Chỉ là phần thêm của trang chủ: đang tải, lỗi hoặc chưa có gợi ý riêng thì không hiện (đã có "Việc làm mới nhất").
function RecommendedJobsSection() {
  const { jobs, personalized, isLoading, error } = useRecommendations(RECOMMENDED_JOBS_LIMIT)

  if (isLoading || error || !personalized || jobs.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>Việc làm gợi ý cho bạn</h2>
        <Link to="/recommendations">Xem thêm gợi ý →</Link>
      </div>
      <div className={styles.grid}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  )
}

export default function RecommendedJobs() {
  const { user } = useAuth()
  return user ? <RecommendedJobsSection /> : null
}
