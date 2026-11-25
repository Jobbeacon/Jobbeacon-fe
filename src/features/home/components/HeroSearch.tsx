import { Search } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../../../assets/home/lighthouse-hero.png";
import { LocationPicker } from "../../jobs/components/LocationPicker";
import styles from "./HeroSearch.module.css";

export default function HeroSearch({ popularSkills }: { popularSkills: string[] }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location) params.set("location", location);
    const query = params.toString();
    navigate(query ? `/jobs?${query}` : "/jobs");
  };

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
        <p>Tổng hợp tin tuyển dụng từ nhiều trang tuyển dụng</p>
        <form className={styles.searchBox} role="search" onSubmit={handleSubmit}>
          <label>
            <Search aria-hidden="true" />
            <input
              aria-label="Từ khóa"
              placeholder="Vị trí, kỹ năng, công ty"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
          <LocationPicker value={location} onChange={setLocation} />
          <button type="submit">
            <Search aria-hidden="true" />
            Tìm việc
          </button>
        </form>
        {popularSkills.length > 0 ? (
          <div className={styles.popular}>
            <strong>Kỹ năng phổ biến:</strong>
            {popularSkills.map((skill) => (
              <Link key={skill} to={`/jobs?${new URLSearchParams({ skills: skill })}`}>
                {skill}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
