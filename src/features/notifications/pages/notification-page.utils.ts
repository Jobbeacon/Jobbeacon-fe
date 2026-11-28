import { ApiError } from '../../../shared/api/api-client'

export const USER_NOT_SYNCED = 'user_not_synced'

export function isNotSyncedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404 && error.code === USER_NOT_SYNCED
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) return error.message
  return fallback
}
