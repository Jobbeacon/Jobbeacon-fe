import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getCompanyDetail, getCompanyJobs } from '../api/companies.api';
import type { Company } from '../types/company.types';
import type { JobSummary } from '../../jobs/types/job.types';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { JobList } from '../../jobs/components/JobList';
import styles from './CompanyDetailPage.module.css';

const PAGE_SIZE = 10;

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!companyId) return;
        const data = await getCompanyDetail(companyId);
        setCompany(data);
      } catch (error) {
        console.error('Failed to fetch company details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return <div className={`${styles.page} p-6 text-center`} style={{ color: '#687d98', padding: '24px' }}>Đang tải...</div>;
  }

  if (!company) {
    return <div className={`${styles.page} p-6 text-center`} style={{ color: '#687d98', padding: '24px' }}>Không tìm thấy công ty.</div>;
  }

  const shortName = company.name.substring(0, 3).toUpperCase();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>
          <Link to="/">Trang chủ</Link> · <Link to="/companies">Công ty</Link> · {company.name}
        </div>
      </section>
      
      <section className={styles.section}>
        <div className={styles.companyHero}>
          <div className={styles.companyMark} data-has-image={company.logoUrl ? true : undefined}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }} />
            ) : (
              shortName
            )}
          </div>
          <div>
            <h1 style={{ color: '#0b2b59' }}>{company.name}</h1>
            <p style={{ color: '#687d98', marginTop: '6px' }}>
              Công nghệ thông tin {company.locations.length > 0 && `· ${company.locations.join(', ')}`}
            </p>
            <div className={styles.statPills}>
              <span>{company.openJobsCount || 0} việc đang tuyển</span>
              {company.sources.length > 0 && (
                <span>Nguồn: {company.sources.join(' · ')}</span>
              )}
            </div>
          </div>
          <button className={styles.btnPrimary}>
            Theo dõi việc mới
          </button>
        </div>

        <div className={styles.sectionHead}>
          <h2>Việc đang tuyển tại {company.name}</h2>
        </div>
        
        <CompanyJobsList companyId={company.id} />
      </section>
    </div>
  );
}

function CompanyJobsList({ companyId }: { companyId: string }) {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getCompanyJobs(companyId, page, PAGE_SIZE);
        setJobs(data.jobs);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [companyId, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage > 1) next.set('page', String(nextPage));
    else next.delete('page');
    setSearchParams(next);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div style={{ color: '#687d98', padding: '16px 0' }} ref={listRef}>Đang tải việc làm...</div>;
  }

  if (jobs.length === 0) {
    return <div style={{ color: '#687d98', padding: '16px 0' }} ref={listRef}>Chưa có việc làm nào đang tuyển.</div>;
  }

  return (
    <div ref={listRef}>
      <JobList jobs={jobs} />
      <div style={{ marginTop: '16px' }}>
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    </div>
  );
}
