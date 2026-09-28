import { Link } from "react-router-dom";
import { JobCard } from "../../jobs/components/JobCard";
import { useLatestJobs } from "../hooks/useLatestJobs";
import styles from "./LatestJobs.module.css";

const LATEST_JOBS_LIMIT = 4;

export default function LatestJobs() {
  const { jobs, isLoading, error, retry } = useLatestJobs(LATEST_JOBS_LIMIT);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>Việc làm mới nhất</h2>
        <Link to="/jobs">Xem tất cả việc làm →</Link>
      </div>

      {isLoading ? (
        <div className={styles.grid} aria-busy="true" aria-label="Đang tải việc làm mới nhất">
          {Array.from({ length: LATEST_JOBS_LIMIT }, (_, index) => (
            <div className={styles.skeleton} key={index} />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className={styles.state} role="alert">
          {error}
          <button type="button" onClick={retry}>
            Thử lại
          </button>
        </p>
      ) : null}

      {!isLoading && !error && jobs.length === 0 ? (
        <p className={styles.state}>Chưa có việc làm nào.</p>
      ) : null}

      {jobs.length > 0 ? (
        <div className={styles.grid}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
