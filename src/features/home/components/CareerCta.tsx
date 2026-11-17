import { Search } from "lucide-react";
import styles from "./CareerCta.module.css";

export default function CareerCta() {
  return (
    <section className={styles.cta}>
      <div>
        <h2>
          Bắt đầu hành trình nghề nghiệp
          <br />
          cùng JobBeacon
        </h2>
        <p>
          Khám phá hàng nghìn cơ hội việc làm, kết nối với các công ty uy tín và
          tìm thấy công việc phù hợp nhất cho bạn.
        </p>
        <div className={styles.actions}>
          <a href="/register">Tìm việc ngay →</a>
          <a href="/jobs">Tạo hồ sơ của bạn</a>
        </div>
      </div>
      <div className={styles.artwork} aria-hidden="true">
        <span className={styles.window}></span>
        <span className={styles.search}>
          <Search />
        </span>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}
