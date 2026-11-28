import { createContext, useContext } from 'react'

export type ToastFn = (message: string) => void

export const ToastContext = createContext<ToastFn | null>(null)

// Thông báo ngắn góc dưới phải, tự ẩn sau 2.4s.
export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) {
    throw new Error('useToast phải dùng bên trong ToastProvider.')
  }
  return toast
}
