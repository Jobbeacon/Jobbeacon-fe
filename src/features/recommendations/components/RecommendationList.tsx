import { JobList } from '../../jobs/components/JobList'
import type { JobSummary } from '../../jobs/types/job.types'

type RecommendationListProps = {
  jobs: JobSummary[]
  matchedSkills: Record<string, string[]>
}

export function RecommendationList({ jobs, matchedSkills }: RecommendationListProps) {
  return (
    <JobList
      jobs={jobs}
      getNote={(job) => {
        const skills = matchedSkills[job.id]
        return skills?.length ? `Hợp kỹ năng: ${skills.join(', ')}` : null
      }}
    />
  )
}
