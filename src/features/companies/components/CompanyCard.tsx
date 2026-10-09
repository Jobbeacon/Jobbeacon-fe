import { Link } from 'react-router-dom'
import { CompanyLogo } from '../../jobs/components/CompanyLogo'
import type { Company } from '../types/company.types'
import styles from './CompanyCard.module.css'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link className={styles.card} to={`/companies/${company.id}`}>
      <header>
        <CompanyLogo className={styles.logo} name={company.name} logoUrl={company.logoUrl} />
        <div className={styles.info}>
          <h3 title={company.name}>{company.name}</h3>
          {company.locations.length > 0 ? (
            <div className={styles.location} title={company.locations.join(' · ')}>
              {company.locations.join(' · ')}
            </div>
          ) : null}
        </div>
      </header>
      <footer>
        <span>{company.openJobsCount.toLocaleString('vi-VN')} việc đang tuyển</span>
        <span>{company.sources.join(' · ')}</span>
      </footer>
    </Link>
  )
}

export function CompanyCardSkeleton() {
  return <div className={styles.skeleton} aria-hidden="true" />
}
