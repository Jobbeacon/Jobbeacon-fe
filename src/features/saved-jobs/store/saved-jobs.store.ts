import { createContext } from 'react'
import type { SavedJobsContextValue } from '../types/saved-job.types'

export const SavedJobsContext = createContext<SavedJobsContextValue | undefined>(undefined)
