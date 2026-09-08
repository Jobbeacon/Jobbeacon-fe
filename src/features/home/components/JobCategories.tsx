import {
  Boxes,
  Coins,
  Factory,
  HardHat,
  Megaphone,
  Monitor,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { HomeCategory } from "../types/home.types";
import styles from "./JobCategories.module.css";

const icons = {
  monitor: Monitor,
  coins: Coins,
  megaphone: Megaphone,
  cart: ShoppingCart,
  factory: Factory,
  hardhat: HardHat,
  truck: Truck,
  grid: Boxes,
};

export default function JobCategories({
  categories,
}: {
  categories: HomeCategory[];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>Khám phá theo ngành nghề</h2>
        <a href="/jobs">Xem tất cả ngành nghề →</a>
      </div>
      <div className={styles.grid}>
        {categories.map((category) => {
          const Icon = icons[category.icon];
          return (
            <a className={styles.item} href="/jobs" key={category.name}>
              <span className={styles.icon}>
                <Icon />
              </span>
              <span>
                <strong>{category.name}</strong>
                <small>{category.count.toLocaleString("vi-VN")} việc</small>
              </span>
              <b>›</b>
            </a>
          );
        })}
      </div>
    </section>
  );
}
