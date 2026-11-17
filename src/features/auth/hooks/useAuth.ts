import { useContext, useState } from 'react'
import {
  getAuthErrorMessage,
  loginWithEmail as loginWithEmailRequest,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
  registerWithEmail as registerWithEmailRequest,
  requestPasswordReset,
} from '../api/auth.api'
import { AuthStateContext, initialAuthState } from '../store/auth.store'
import type {
  AuthAction,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types'

export function useAuth() {
  const authState = useContext(AuthStateContext) ?? initialAuthState
  const [pendingAction, setPendingAction] = useState<AuthAction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const run = async (
    action: AuthAction,
    operation: () => Promise<unknown>,
    successMessage?: string,
  ) => {
    setPendingAction(action)
    setError(null)
    setSuccess(null)

    try {
      await operation()
      if (successMessage) {
        setSuccess(successMessage)
      }
      return true
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
      return false
    } finally {
      setPendingAction(null)
    }
  }

  return {
    ...authState,
    pendingAction,
    error,
    success,
    clearFeedback: () => {
      setError(null)
      setSuccess(null)
    },
    loginWithEmail: (credentials: LoginCredentials) =>
      run('login-email', () => loginWithEmailRequest(credentials), 'Đăng nhập thành công.'),
    loginWithGoogle: () =>
      run('login-google', loginWithGoogleRequest, 'Đăng nhập Google thành công.'),
    registerWithEmail: (credentials: RegisterCredentials) =>
      run('register', () => registerWithEmailRequest(credentials), 'Đăng ký thành công.'),
    resetPassword: (email: string) =>
      run(
        'reset-password',
        () => requestPasswordReset(email),
        'Đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra email.',
      ),
    logout: () => run('logout', logoutRequest),
  }
}
