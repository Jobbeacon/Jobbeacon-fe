import { JobList } from '../../jobs/components/JobList'
import type { SavedJob } from '../types/saved-job.types'

function isExpired(job: SavedJob) {
  return job.expiredDate ? new Date(job.expiredDate).getTime() < Date.now() : false
}

export function SavedJobList({ jobs }: { jobs: SavedJob[] }) {
  return <JobList jobs={jobs} getNote={(job) => (isExpired(job) ? 'Đã hết hạn' : null)} />
}
