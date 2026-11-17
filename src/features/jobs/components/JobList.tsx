import { Clock3, DollarSign, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../../shared/utils/date'
import { formatSalaryRange } from '../../../shared/utils/format'
import { useSavedJob } from '../../saved-jobs/hooks/useSavedJob'
import type { JobSummary } from '../types/job.types'
import { CompanyLogo } from './CompanyLogo'
import styles from './JobList.module.css'

function JobRow({ job, note }: { job: JobSummary; note: string | null }) {
  const { isSaved, toggleSaved } = useSavedJob(job.id)

  return (
    <article className={styles.row}>
      <CompanyLogo className={styles.logo} name={job.companyName} logoUrl={job.companyLogoUrl} />
      <div className={styles.body}>
        <h3>
          <Link to={`/jobs/${job.id}`} title={job.title}>
            {job.title}
          </Link>
        </h3>
        <p className={styles.company}>{job.companyName}</p>
        <div className={styles.facts}>
          {job.location.length > 0 ? (
            <span className={styles.location} title={job.location.join(' · ')}>
              <MapPin aria-hidden="true" />
              <span>{job.location.join(' · ')}</span>
            </span>
          ) : null}
          <span>
            <DollarSign aria-hidden="true" />
            {formatSalaryRange(job.minSalary, job.maxSalary, job.currency)}
          </span>
        </div>
      </div>
      <div className={styles.side}>
        {note ? <span className={styles.note}>{note}</span> : null}
        {job.postedDate ? (
          <span className={styles.time}>
            <Clock3 aria-hidden="true" />
            {formatRelativeTime(job.postedDate)}
          </span>
        ) : null}
        <button
          className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
          type="button"
          aria-label={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
          aria-pressed={isSaved}
          onClick={toggleSaved}
        >
          <Heart aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

export function JobList<T extends JobSummary>({
  jobs,
  getNote,
}: {
  jobs: T[]
  getNote?: (job: T) => string | null
}) {
  return (
    <div className={styles.list}>
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} note={getNote?.(job) ?? null} />
      ))}
    </div>
  )
}

export function JobListSkeleton({ count }: { count: number }) {
  return (
    <div className={styles.list} aria-busy="true" aria-label="Đang tải danh sách việc làm">
      {Array.from({ length: count }, (_, index) => (
        <div className={styles.skeleton} key={index} />
      ))}
    </div>
  )
}
