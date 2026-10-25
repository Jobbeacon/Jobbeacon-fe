import { useContext } from 'react'
import { SavedJobsContext } from '../store/saved-jobs.store'

export function useSavedJob(jobId: string) {
  const context = useContext(SavedJobsContext)
  if (!context) {
    throw new Error('useSavedJob must be used inside SavedJobsProvider')
  }

  return {
    isSaved: context.isSaved(jobId),
    toggleSaved: () => void context.toggleSaved(jobId),
  }
}

export function useSavedJobsState() {
  const context = useContext(SavedJobsContext)
  if (!context) {
    throw new Error('useSavedJobsState must be used inside SavedJobsProvider')
  }
  return context
}
