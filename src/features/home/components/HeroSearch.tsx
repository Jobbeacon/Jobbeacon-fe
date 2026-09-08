import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import heroImage from "../../../assets/home/lighthouse-hero.png";
import styles from "./HeroSearch.module.css";

const stats = [
  { Icon: BriefcaseBusiness, value: "10.000+", label: "Việc làm" },
  { Icon: Building2, value: "2.000+", label: "Công ty" },
  { Icon: Users, value: "50+", label: "Nguồn tuyển dụng" },
  { Icon: Star, value: "100%", label: "Miễn phí cho ứng viên" },
];

export default function HeroSearch() {
  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(235,247,255,.98) 0%, rgba(235,247,255,.88) 43%, rgba(235,247,255,.04) 72%), url(${heroImage})`,
      }}
    >
      <div className={styles.content}>
        <h1>
          Tìm công việc <span>phù hợp với bạn</span>
        </h1>
        <p>Hàng nghìn cơ hội việc làm từ nhiều nguồn tuyển dụng</p>
        <form
          className={styles.searchBox}
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            <Search aria-hidden="true" />
            <input
              aria-label="Từ khóa"
              placeholder="Vị trí, kỹ năng, công việc..."
            />
          </label>
          <label>
            <MapPin aria-hidden="true" />
            <input aria-label="Địa điểm" placeholder="Địa điểm" />
          </label>
          <button type="submit">
            <Search aria-hidden="true" />
            Tìm việc
          </button>
        </form>
        <div className={styles.popular}>
          <strong>Phổ biến:</strong>
          {[
            "Java",
            "ReactJS",
            "Data Analyst",
            "Tester",
            "Marketing",
            "Python",
            "Business Analyst",
          ].map((term) => (
            <button key={term}>{term}</button>
          ))}
        </div>
      </div>
      <div className={styles.stats}>
        {stats.map(({ Icon, value, label }) => (
          <div className={styles.stat} key={label}>
            <span>
              <Icon />
            </span>
            <div>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
