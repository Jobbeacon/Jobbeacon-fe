export const PASSWORD_MIN_LENGTH = 8

type RegisterFormValues = {
  fullName: string
  password: string
  confirmPassword: string
}

export function validateRegisterForm({
  fullName,
  password,
  confirmPassword,
}: RegisterFormValues) {
  if (!fullName.trim()) {
    return 'Vui lòng nhập họ và tên.'
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự.`
  }

  if (password !== confirmPassword) {
    return 'Mật khẩu xác nhận không khớp.'
  }

  return null
}
