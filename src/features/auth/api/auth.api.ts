import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirebaseAuth } from '../../../app/config/firebase'
import type {
  AuthenticatedUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export function mapFirebaseUser(user: User): AuthenticatedUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoURL,
    emailVerified: user.emailVerified,
  }
}

export async function loginWithEmail({ email, password }: LoginCredentials) {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
  return mapFirebaseUser(credential.user)
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(getFirebaseAuth(), googleProvider)
  return mapFirebaseUser(credential.user)
}

export async function registerWithEmail({
  fullName,
  email,
  password,
}: RegisterCredentials) {
  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password,
  )

  await updateProfile(credential.user, { displayName: fullName.trim() })
  return mapFirebaseUser(credential.user)
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email.trim())
}

export async function logout() {
  await signOut(getFirebaseAuth())
}

export async function getCurrentIdToken(forceRefresh = false) {
  const user = getFirebaseAuth().currentUser
  return user ? user.getIdToken(forceRefresh) : null
}

export function subscribeToAuthState(
  onChange: (user: AuthenticatedUser | null) => void,
  onError: (error: Error) => void,
) {
  try {
    return onAuthStateChanged(
      getFirebaseAuth(),
      (user) => onChange(user ? mapFirebaseUser(user) : null),
      onError,
    )
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Không thể khởi tạo Firebase.'))
    return () => undefined
  }
}

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  }

  const messages: Record<string, string> = {
    'auth/account-exists-with-different-credential':
      'Email này đã được đăng ký bằng một phương thức đăng nhập khác.',
    'auth/email-already-in-use': 'Email này đã được sử dụng.',
    'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác.',
    'auth/invalid-email': 'Địa chỉ email không hợp lệ.',
    'auth/missing-password': 'Vui lòng nhập mật khẩu.',
    'auth/network-request-failed': 'Không thể kết nối mạng. Vui lòng thử lại.',
    'auth/operation-not-allowed': 'Phương thức đăng nhập này chưa được bật trên Firebase.',
    'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập Google.',
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập Google.',
    'auth/too-many-requests': 'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau.',
    'auth/unauthorized-domain': 'Tên miền hiện tại chưa được cho phép trong Firebase.',
    'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa.',
    'auth/weak-password': 'Mật khẩu chưa đủ mạnh.',
  }

  return messages[error.code] ?? 'Xác thực không thành công. Vui lòng thử lại.'
}
