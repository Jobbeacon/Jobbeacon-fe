import CareerCta from '../components/CareerCta'
import HeroSearch from '../components/HeroSearch'
import JobCategories from '../components/JobCategories'
import LatestJobs from '../components/LatestJobs'
import RecommendedJobs from '../components/RecommendedJobs'
import { useHomeData } from '../hooks/useHomeData'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { categories } = useHomeData()
  return <main className={styles.page}><HeroSearch /><LatestJobs /><RecommendedJobs /><JobCategories categories={categories} /><CareerCta /></main>
}
