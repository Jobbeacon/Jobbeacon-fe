import { ApiError, apiClient } from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type {
  UserProfile,
  UserProfileApiDto,
} from '../types/candidate-profile.types'

const CURRENT_USER_ENDPOINT = '/api/v1/users/me'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getProfilePayload(response: unknown) {
  if (!isRecord(response)) {
    throw new ApiError('Dữ liệu người dùng từ máy chủ không hợp lệ.', 500)
  }

  if ('data' in response && isRecord(response.data)) {
    return response.data as UserProfileApiDto
  }

  return response as UserProfileApiDto
}

function normalizeUserProfile(profile: UserProfileApiDto): UserProfile {
  const resolvedRoles = Array.isArray(profile.roles)
    ? profile.roles
    : profile.role
      ? [profile.role]
      : []

  return {
    id: profile.id === undefined ? '' : String(profile.id),
    firebaseUid: profile.firebaseUid ?? profile.uid ?? null,
    email: profile.email ?? '',
    fullName: profile.fullName ?? profile.displayName ?? profile.name ?? '',
    avatarUrl: profile.avatarUrl ?? profile.photoUrl ?? null,
    roles: resolvedRoles,
    emailVerified: profile.emailVerified ?? null,
    status: profile.status ?? null,
    createdAt: profile.createdAt ?? null,
    updatedAt: profile.updatedAt ?? null,
  }
}

export async function getCurrentUserProfile(signal?: AbortSignal) {
  const response = await apiClient.get<
    UserProfileApiDto | ApiResponse<UserProfileApiDto>
  >(CURRENT_USER_ENDPOINT, { signal })

  return normalizeUserProfile(getProfilePayload(response))
}
