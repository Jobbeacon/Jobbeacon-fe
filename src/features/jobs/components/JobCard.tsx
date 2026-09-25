import { useState } from 'react'
import { Clock3, DollarSign, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime, isWithinHours } from '../../../shared/utils/date'
import { formatSalaryRange } from '../../../shared/utils/format'
import type { JobSummary } from '../types/job.types'
import { CompanyLogo } from './CompanyLogo'
import styles from './JobCard.module.css'

const NEW_JOB_HOURS = 24

export function JobCard({ job }: { job: JobSummary }) {
  const [isSaved, setIsSaved] = useState(false)
  const isNew = job.postedDate ? isWithinHours(job.postedDate, NEW_JOB_HOURS) : false

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <CompanyLogo className={styles.logo} name={job.companyName} logoUrl={job.companyLogoUrl} />
        {isNew ? <span className={styles.badgeNew}>Mới</span> : null}
      </div>
      <h3>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
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
      {job.skills.length > 0 ? (
        <div className={styles.tags}>
          {job.skills.map((skill) => (
            <span key={skill.id}>{skill.name}</span>
          ))}
        </div>
      ) : null}
      <footer className={styles.foot}>
        <span>
          {job.postedDate ? (
            <>
              <Clock3 aria-hidden="true" />
              {formatRelativeTime(job.postedDate)}
            </>
          ) : null}
        </span>
        <button
          className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
          type="button"
          aria-label={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((current) => !current)}
        >
          <Heart aria-hidden="true" />
        </button>
      </footer>
    </article>
  )
}
