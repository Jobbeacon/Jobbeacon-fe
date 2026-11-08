import { useEffect, useMemo } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  DollarSign,
  Heart,
  MapPin,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { formatRelativeTime } from '../../../shared/utils/date'
import {
  formatEmploymentType,
  formatExperience,
  formatSalaryPeriod,
  formatSalaryRange,
} from '../../../shared/utils/format'
import { sanitizeHtml } from '../../../shared/utils/sanitize-html'
import { useSavedJob } from '../../saved-jobs/hooks/useSavedJob'
import { CompanyLogo } from '../components/CompanyLogo'
import { JobCard } from '../components/JobCard'
import { useJobDetail } from '../hooks/useJobDetail'
import { useTrackJobInteraction } from '../hooks/useTrackJobInteraction'
import { getCategoryPaths } from '../utils/category'
import type { JobDetail } from '../types/job.types'
import styles from './JobDetailPage.module.css'

function JobDescription({ html }: { html: string }) {
  const safeHtml = useMemo(() => sanitizeHtml(html), [html])

  if (!safeHtml.trim()) {
    return <p className={styles.emptyDescription}>Tin tuyển dụng chưa có mô tả chi tiết.</p>
  }

  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: safeHtml }} />
}

function JobDetailContent({ job }: { job: JobDetail }) {
  const { isSaved, toggleSaved } = useSavedJob(job.id)
  const trackInteraction = useTrackJobInteraction()
  const salary = formatSalaryRange(job.minSalary, job.maxSalary, job.currency)
  const salaryPeriod = formatSalaryPeriod(job.salaryPeriod)
  const employmentType = formatEmploymentType(job.employmentType)
  const [primarySource, ...otherSources] = job.sources
  const companyName = job.company?.name ?? job.companyName
  const categoryPaths = getCategoryPaths(job.categories)
  const companyMeta = [job.categories[0]?.name, job.location[0]].filter(Boolean).join(' · ')

  // Re-runs once auth resolves, so a signed-in user's view still counts; the backend ignores quick repeats.
  useEffect(() => {
    trackInteraction(job.id, 'VIEWED')
  }, [job.id, trackInteraction])

  return (
    <div className={styles.layout}>
      <article className={`${styles.card} ${styles.main}`}>
        <div className={styles.titleRow}>
          <CompanyLogo
            className={`${styles.companyMark} ${styles.companyMarkLg}`}
            name={companyName}
            logoUrl={job.companyLogoUrl}
          />
          <div>
            <h1>{job.title}</h1>
            <p className={styles.company}>{companyName}</p>
            {categoryPaths.map((path) => (
              <ol className={styles.categoryPath} key={path[path.length - 1].id} aria-label="Ngành nghề">
                {path.map((category) => (
                  <li key={category.id}>{category.name}</li>
                ))}
              </ol>
            ))}
            {job.skills.length > 0 ? (
              <div className={styles.tags}>
                {job.skills.map((skill) => (
                  <Link key={skill.id} to={`/jobs?${new URLSearchParams({ skills: skill.name })}`}>
                    {skill.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <ul className={styles.facts}>
          <li>
            <DollarSign aria-hidden="true" />
            {salary}
            {salaryPeriod && salary !== 'Thỏa thuận' ? ` / ${salaryPeriod}` : null}
          </li>
          {job.location.length > 0 ? (
            <li>
              <MapPin aria-hidden="true" />
              {job.location.join(' · ')}
            </li>
          ) : null}
          <li>
            <BriefcaseBusiness aria-hidden="true" />
            {[employmentType, formatExperience(job.experienceMonths)].filter(Boolean).join(' · ')}
          </li>
          {job.postedDate ? (
            <li>
              <Clock3 aria-hidden="true" />
              Đăng {formatRelativeTime(job.postedDate)}
            </li>
          ) : null}
          {job.expiredDate ? (
            <li>
              <CalendarClock aria-hidden="true" />
              Hạn nộp {new Date(job.expiredDate).toLocaleDateString('vi-VN')}
            </li>
          ) : null}
        </ul>

        {primarySource ? (
          <p className={styles.sourceRow}>
            <span className={styles.source}>
              Nguồn: {primarySource.name}
            </span>
            {otherSources.length > 0 ? (
              <span className={styles.dupNote}>
                Cũng thấy trên {otherSources.map((source) => source.name).join(', ')} · đã gộp trùng
              </span>
            ) : null}
          </p>
        ) : null}

        <JobDescription html={job.descriptionHtml} />
      </article>

      <aside className={styles.side}>
        <div className={`${styles.card} ${styles.applyCard}`}>
          <small className={styles.priceLabel}>Mức lương</small>
          <div className={styles.price}>{salary}</div>
          {primarySource?.url ? (
            <a
              className={styles.btnPrimary}
              href={primarySource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction(job.id, 'APPLY_CLICKED')}
            >
              Ứng tuyển trên {primarySource.name} <ArrowRight aria-hidden="true" />
            </a>
          ) : null}
          <button
            className={`${styles.btnOutline} ${isSaved ? styles.btnSaved : ''}`}
            type="button"
            aria-pressed={isSaved}
            onClick={toggleSaved}
          >
            <Heart aria-hidden="true" /> {isSaved ? 'Đã lưu việc làm' : 'Lưu việc làm'}
          </button>
          <p className={styles.applyNote}>
            JobBeacon là nền tảng tổng hợp. Nút ứng tuyển sẽ mở tin gốc để bạn nộp hồ sơ tại nguồn tuyển dụng.
          </p>
        </div>

        {job.company ? (
          <div className={`${styles.card} ${styles.companyMini}`}>
            <div className={styles.companyMiniHead}>
              <CompanyLogo className={styles.companyMark} name={job.company.name} logoUrl={job.company.logoUrl} />
              <div>
                <strong>{job.company.name}</strong>
                {companyMeta ? <div className={styles.industry}>{companyMeta}</div> : null}
              </div>
            </div>
            <Link className={styles.btnGhost} to={`/companies/${job.company.id}`}>
              Xem trang công ty
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

export function JobDetailPage() {
  const { jobId = '' } = useParams()
  const { job, similarJobs, isLoading, error, retry } = useJobDetail(jobId)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · <Link to="/jobs">Việc làm</Link>
          {job ? ` · ${job.title}` : null}
        </nav>
      </section>

      {isLoading ? (
        <div className={styles.stateWrap}>
          <LoadingState label="Đang tải thông tin việc làm..." />
        </div>
      ) : null}
      {error ? (
        <div className={styles.stateWrap}>
          <ErrorState message={error} onRetry={retry} />
        </div>
      ) : null}

      {job ? (
        <>
          <JobDetailContent key={job.id} job={job} />
          {similarJobs.length > 0 ? (
            <section className={styles.similar}>
              <div className={styles.sectionHead}>
                <h2>Việc làm tương tự</h2>
                <Link to="/jobs">Xem thêm →</Link>
              </div>
              <div className={styles.jobGrid}>
                {similarJobs.map((similarJob) => (
                  <JobCard key={similarJob.id} job={similarJob} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  )
}

export default JobDetailPage
