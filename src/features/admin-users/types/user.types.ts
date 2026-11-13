// Model camelCase cho Admin API người dùng.
export type UserRole = 'ADMIN' | 'USER'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED'

export type UserStats = {
  total: number
  admins: number
  active: number
  suspended: number
  withCv: number
}

export type UserRow = {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  role: UserRole
  status: UserStatus
  hasCv: boolean
  createdAt: string | null
  lastLoginAt: string | null
}

export type UserCv = {
  currentTitle: string | null
  totalMonthsExperience: number | null
  skills: string[] | null
  updatedAt?: string | null
}

export type UserDetail = UserRow & {
  cv: UserCv | null
  // Tóm tắt user_job_preference; field có thể thay đổi theo backend nên để dạng record.
  preference: Record<string, unknown> | null
}

export type UserQuery = {
  q?: string
  role?: '' | UserRole
  status?: '' | UserStatus
  page?: number
  size?: number
}

// Field nào null thì backend giữ nguyên.
export type UserUpdate = {
  displayName?: string
  role?: UserRole
  status?: UserStatus
}

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Quản trị',
  USER: 'Người dùng',
}

export const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'Đang dùng',
  SUSPENDED: 'Đã khóa',
  DELETED: 'Đã xóa',
}
