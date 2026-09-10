export type UserProfile = {
  id: string
  firebaseUid: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  roles: string[]
  emailVerified: boolean | null
  status: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UserProfileApiDto = {
  id?: string | number
  uid?: string
  firebaseUid?: string
  email?: string
  fullName?: string
  displayName?: string
  name?: string
  avatarUrl?: string
  photoUrl?: string
  role?: string
  roles?: string[]
  emailVerified?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}
