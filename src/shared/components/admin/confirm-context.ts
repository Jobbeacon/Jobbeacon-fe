import { createContext, useContext } from 'react'

export type ConfirmOptions = {
  title: string
  copy: string
  ok?: string
  cancel?: string
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmFn | null>(null)

// Hỏi lại trước khi xóa/gộp/khóa: await confirm({...}) → true nếu bấm nút xác nhận.
export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) {
    throw new Error('useConfirm phải dùng bên trong ConfirmProvider.')
  }
  return confirm
}
