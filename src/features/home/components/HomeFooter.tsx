import logo from "../../../assets/logo/jobbeacon-logo.svg";
import styles from "./HomeFooter.module.css";

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div>
          <img src={logo} alt="JobBeacon" />
          <p>Kết nối cơ hội, kiến tạo tương lai</p>
        </div>
        <div>
          <strong>Dành cho ứng viên</strong>
          <a href="/jobs">Tìm việc làm</a>
          <a href="/profile">Tạo hồ sơ</a>
          <a href="/career-chat">Cẩm nang nghề nghiệp</a>
        </div>
        <div>
          <strong>Dành cho nhà tuyển dụng</strong>
          <a href="/companies">Đăng tin tuyển dụng</a>
          <a href="/companies">Giải pháp tuyển dụng</a>
          <a href="/companies">Liên hệ</a>
        </div>
        <div>
          <strong>Về JobBeacon</strong>
          <a href="/">Giới thiệu</a>
          <a href="/">Blog</a>
          <a href="/">Điều khoản</a>
        </div>
        <div>
          <strong>Kết nối với chúng tôi</strong>
          <p className={styles.socials}>f &nbsp; in &nbsp; ▶ &nbsp; 𝕏</p>
        </div>
      </div>
      <div className={styles.bottom}>
        © 2026 JobBeacon. All rights reserved.
        <span>Việc tốt hơn, gần hơn mỗi ngày 💙</span>
      </div>
    </footer>
  );
}
