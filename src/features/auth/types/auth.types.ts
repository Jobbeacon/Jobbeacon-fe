export type AuthenticatedUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoUrl: string | null
  emailVerified: boolean
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = LoginCredentials & {
  fullName: string
}

export type AuthState = {
  user: AuthenticatedUser | null
  isInitializing: boolean
}

export type AuthAction =
  | 'login-email'
  | 'login-google'
  | 'register'
  | 'reset-password'
  | 'logout'
