import { Link } from "react-router-dom";
import logo from "../../../assets/logo/jobbeacon-logo.svg";
import styles from "./HomeFooter.module.css";

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div>
          <img src={logo} alt="JobBeacon" />
        </div>
        <nav aria-label="Tìm việc">
          <strong>Tìm việc</strong>
          <Link to="/jobs">Việc làm</Link>
          <Link to="/companies">Công ty</Link>
          <Link to="/agent">JobBeacon Agent</Link>
        </nav>
        <nav aria-label="Tài khoản">
          <strong>Tài khoản</strong>
          <Link to="/profile">Hồ sơ của tôi</Link>
          <Link to="/recommendations">Việc làm gợi ý</Link>
          <Link to="/saved-jobs">Việc làm đã lưu</Link>
        </nav>
      </div>
      <div className={styles.bottom}>© {new Date().getFullYear()} JobBeacon</div>
    </footer>
  );
}
