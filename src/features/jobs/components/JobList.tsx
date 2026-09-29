import { useState } from 'react'
import { Clock3, DollarSign, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../../shared/utils/date'
import { formatSalaryRange } from '../../../shared/utils/format'
import type { JobSummary } from '../types/job.types'
import { CompanyLogo } from './CompanyLogo'
import styles from './JobList.module.css'

function JobRow({ job }: { job: JobSummary }) {
  const [isSaved, setIsSaved] = useState(false)

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
          onClick={() => setIsSaved((current) => !current)}
        >
          <Heart aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

export function JobList({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div className={styles.list}>
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
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
