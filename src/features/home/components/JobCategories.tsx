import {
  BookOpen,
  Boxes,
  Building2,
  Calculator,
  Car,
  Coins,
  Factory,
  HardHat,
  Headset,
  HeartPulse,
  Hotel,
  Languages,
  Leaf,
  Megaphone,
  Monitor,
  Palette,
  Scale,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { JobCard } from "../../jobs/components/JobCard";
import { useCategoryJobs } from "../hooks/useCategoryJobs";
import styles from "./JobCategories.module.css";

// Theo tên ngành cấp 1 của backend; ngành chưa có trong bảng dùng icon chung.
const icons: Record<string, LucideIcon> = {
  "Bán lẻ/Dịch vụ đời sống": Store,
  "Bất động sản": Building2,
  "Biên phiên dịch": Languages,
  "Chăm sóc khách hàng (Customer Service)/Vận hành": Headset,
  "Công nghệ Thông tin": Monitor,
  "Dược/Y tế/Sức khoẻ/Công nghệ sinh học": HeartPulse,
  "Điện/Điện tử/Viễn thông": Zap,
  "Giáo dục/Đào tạo": BookOpen,
  "Kế toán/Kiểm toán/Thuế": Calculator,
  "Kinh doanh/Bán hàng": ShoppingCart,
  "Logistics/Thu mua/Kho/Vận tải": Truck,
  Luật: Scale,
  "Marketing/PR/Quảng cáo": Megaphone,
  "Năng lượng/Môi trường/Nông nghiệp": Leaf,
  "Nhà hàng/Khách sạn/Du lịch": Hotel,
  "Nhân sự/Hành chính/Pháp chế": Users,
  "Sản xuất": Factory,
  "Tài chính/Ngân hàng/Bảo hiểm": Coins,
  "Tài xế": Car,
  "Thiết kế": Palette,
  "Xây dựng": HardHat,
};

// Ngành đủ việc lấp đầy một hàng thì liệt kê việc, còn lại chỉ hiện thẻ ngành.
const JOBS_PER_ROW = 4;
const MAX_ROWS = 5;

function categoryLink(name: string) {
  return `/jobs?${new URLSearchParams({ categories: name })}`;
}

function CategoryIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? Boxes;
  return (
    <span className={styles.icon}>
      <Icon aria-hidden="true" />
    </span>
  );
}

export default function JobCategories({ names }: { names: string[] }) {
  const { categories, isLoading } = useCategoryJobs(names, JOBS_PER_ROW);
  const rows = categories.filter((category) => category.jobs.length >= JOBS_PER_ROW).slice(0, MAX_ROWS);
  const others = categories.filter((category) => !rows.includes(category));

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2>Việc làm theo ngành nghề</h2>

      {isLoading ? (
        <div className={styles.jobs} aria-busy="true" aria-label="Đang tải việc làm theo ngành nghề">
          {Array.from({ length: JOBS_PER_ROW }, (_, index) => (
            <div className={styles.skeleton} key={index} />
          ))}
        </div>
      ) : null}

      {rows.map((category) => (
        <article className={styles.row} key={category.name}>
          <div className={styles.rowHead}>
            <CategoryIcon name={category.name} />
            <h3>{category.name}</h3>
            <span className={styles.count}>{category.total.toLocaleString("vi-VN")} việc làm</span>
            <Link to={categoryLink(category.name)} aria-label={`Xem tất cả việc làm ${category.name}`}>
              Xem tất cả →
            </Link>
          </div>
          <div className={styles.jobs}>
            {category.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </article>
      ))}

      {others.length > 0 ? (
        <div className={styles.grid}>
          {others.map((category) => (
            <Link className={styles.item} key={category.name} to={categoryLink(category.name)}>
              <CategoryIcon name={category.name} />
              <span>
                <strong>{category.name}</strong>
                <small>{category.total.toLocaleString("vi-VN")} việc làm</small>
              </span>
              <b aria-hidden="true">›</b>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
