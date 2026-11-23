import HeroSearch from '../components/HeroSearch'
import JobCategories from '../components/JobCategories'
import LatestJobs from '../components/LatestJobs'
import RecommendedJobs from '../components/RecommendedJobs'
import { useHomeData } from '../hooks/useHomeData'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { categories, popularSkills } = useHomeData()

  return (
    <main className={styles.page}>
      <HeroSearch popularSkills={popularSkills} />
      <LatestJobs />
      <RecommendedJobs />
      <JobCategories names={categories} />
    </main>
  )
}
