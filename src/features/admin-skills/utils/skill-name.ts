import { foldText } from '../../../shared/utils/admin-format'

// Tên chuẩn để so trùng: bỏ dấu, lowercase, gộp khoảng trắng.
export function normalizeName(value: string | null | undefined) {
  return foldText(value).trim().replace(/\s+/g, ' ')
}
