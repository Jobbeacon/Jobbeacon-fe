import { useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { recordJobInteraction, type JobInteractionType } from '../api/job-interactions.api'

/** Fire-and-forget: tracking only works for signed-in users and must never affect the page if it fails. */
export function useTrackJobInteraction() {
  const { user } = useAuth()
  const isSignedIn = Boolean(user)

  return useCallback(
    (jobId: string, type: JobInteractionType) => {
      if (isSignedIn) {
        recordJobInteraction(jobId, type).catch(() => undefined)
      }
    },
    [isSignedIn],
  )
}
