import { STATUS_LABEL } from '../types/user.types'
import type { UserStatus } from '../types/user.types'

// Chấm trạng thái: xanh = đang dùng, đỏ = đã khóa, xám = đã xóa.
export function StatusMark({ status }: { status: UserStatus }) {
  const kind = status === 'ACTIVE' ? '' : status === 'SUSPENDED' ? ' state--off' : ' state--muted'
  return (
    <span className={`state${kind}`}>
      <i />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}
