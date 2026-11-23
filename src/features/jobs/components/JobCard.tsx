import { Clock3, DollarSign, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime, isWithinHours } from '../../../shared/utils/date'
import { formatSalaryRange } from '../../../shared/utils/format'
import { useSavedJob } from '../../saved-jobs/hooks/useSavedJob'
import type { JobSummary } from '../types/job.types'
import { CompanyLogo } from './CompanyLogo'
import styles from './JobCard.module.css'

const NEW_JOB_HOURS = 24

export function JobCard({ job }: { job: JobSummary }) {
  const { isSaved, toggleSaved } = useSavedJob(job.id)
  const isNew = job.postedDate ? isWithinHours(job.postedDate, NEW_JOB_HOURS) : false

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <CompanyLogo className={styles.logo} name={job.companyName} logoUrl={job.companyLogoUrl} />
        <h3>
          <Link to={`/jobs/${job.id}`} title={job.title}>
            {job.title}
          </Link>
        </h3>
      </div>
      <p className={styles.company}>{job.companyName}</p>
      <ul className={styles.meta}>
        {job.location.length > 0 ? (
          <li>
            <MapPin aria-hidden="true" />
            {job.location.join(', ')}
          </li>
        ) : null}
        <li>
          <DollarSign aria-hidden="true" />
          {formatSalaryRange(job.minSalary, job.maxSalary, job.currency)}
        </li>
      </ul>
      <footer className={styles.foot}>
        <span>
          {job.postedDate ? (
            <>
              <Clock3 aria-hidden="true" />
              {formatRelativeTime(job.postedDate)}
            </>
          ) : null}
          {isNew ? <span className={styles.badgeNew}>Mới</span> : null}
        </span>
        <button
          className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
          type="button"
          aria-label={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
          aria-pressed={isSaved}
          onClick={toggleSaved}
        >
          <Heart aria-hidden="true" />
        </button>
      </footer>
    </article>
  )
}
