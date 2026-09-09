import { Clock3, Heart, MapPin } from "lucide-react";
import type { HomeJob } from "../types/home.types";
import styles from "./LatestJobs.module.css";

export default function LatestJobs({ jobs }: { jobs: HomeJob[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>Việc làm mới nhất</h2>
        <a href="/jobs">Xem tất cả việc làm →</a>
      </div>
      <div className={styles.grid}>
        {jobs.map((job) => (
          <article className={styles.card} key={job.id}>
            <div className={styles.cardTop}>
              <span className={styles.logo}>{job.logo}</span>
              <span className={styles.new}>Mới</span>
            </div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <ul>
              <li>
                <MapPin />
                {job.location}
              </li>
              <li>₫ {job.salary}</li>
            </ul>
            <div className={styles.tags}>
              {job.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <footer>
              <span>
                <Clock3 />2 giờ trước
              </span>
              <button aria-label="Lưu việc làm">
                <Heart />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
