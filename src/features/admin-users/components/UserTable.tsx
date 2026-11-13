import { MonoMark } from '../../../shared/components/admin'
import { shortDate, stamp } from '../../../shared/utils/admin-format'
import type { UserRow } from '../types/user.types'
import { StatusMark } from './StatusMark'
import { displayNameOf } from './user-format'

type UserTableProps = {
  rows: UserRow[]
  onEdit: (user: UserRow) => void
  onToggleLock: (user: UserRow) => void
}

export function UserTable({ rows, onEdit, onToggleLock }: UserTableProps) {
  return (
    <div className="table-wrap">
      <table className="user-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>CV</th>
            <th>Đăng ký</th>
            <th>Đăng nhập gần nhất</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((user) => {
              const name = displayNameOf(user)
              return (
                <tr key={user.id}>
                  <td>
                    <div className="who">
                      <MonoMark name={name} avatarUrl={user.avatarUrl} />
                      <span>
                        <button className="name-btn" type="button" onClick={() => onEdit(user)}>
                          {name}
                        </button>
                        <span className="sub">{user.email}</span>
                      </span>
                    </div>
                  </td>
                  <td>{user.role === 'ADMIN' ? <span className="role-tag">Quản trị</span> : 'Người dùng'}</td>
                  <td>
                    <StatusMark status={user.status} />
                  </td>
                  <td>{user.hasCv ? 'Có' : <span className="empty">Chưa có</span>}</td>
                  <td className="when">{shortDate(user.createdAt)}</td>
                  <td className="when">{stamp(user.lastLoginAt)}</td>
                  <td className="actions">
                    {user.status === 'DELETED' ? null : (
                      <button className="linkish" type="button" onClick={() => onToggleLock(user)}>
                        {user.status === 'SUSPENDED' ? 'Mở khóa' : 'Khóa'}
                      </button>
                    )}
                    <button className="linkish" type="button" onClick={() => onEdit(user)}>
                      Sửa
                    </button>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td className="empty" colSpan={7}>
                Không có tài khoản khớp bộ lọc.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
