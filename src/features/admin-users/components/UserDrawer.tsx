import { useState } from 'react'
import type { FormEvent } from 'react'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { Dialog, MonoMark, useConfirm, useToast } from '../../../shared/components/admin'
import { stamp } from '../../../shared/utils/admin-format'
import { updateUser } from '../api/users.api'
import { useUserDetail } from '../hooks/useUsers'
import type { UserDetail, UserRole, UserStatus } from '../types/user.types'
import { cvItems, displayNameOf, preferenceItems } from './user-format'
import type { MetaItem } from './user-format'

type UserDrawerProps = {
  userId: string | null
  onClose: () => void
  onSaved: () => void
}

// Modal sửa tài khoản (cùng bố cục với modal sửa công ty): tên hiển thị, vai trò, trạng thái + xem CV, nguyện vọng.
export function UserDrawer({ userId, onClose, onSaved }: UserDrawerProps) {
  return (
    <Dialog open={Boolean(userId)} onClose={onClose} className="modal form-modal" labelledBy="user-drawer-title">
      {userId ? <UserLoader key={userId} id={userId} onClose={onClose} onSaved={onSaved} /> : null}
    </Dialog>
  )
}

function UserLoader({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const { data, error, retry } = useUserDetail(id)
  if (data) {
    return <UserForm user={data} onClose={onClose} onSaved={onSaved} />
  }
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="drawer-bar">
        <h2 id="user-drawer-title">Tài khoản</h2>
      </div>
      <div className="drawer-body">
        {error ? <ErrorState message={error} onRetry={retry} /> : <LoadingState label="Đang tải tài khoản..." />}
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </form>
  )
}

function MetaList({ items }: { items: MetaItem[] }) {
  return (
    <dl className="meta">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function UserForm({ user, onClose, onSaved }: { user: UserDetail; onClose: () => void; onSaved: () => void }) {
  const confirm = useConfirm()
  const toast = useToast()
  const [name, setName] = useState(user.displayName ?? '')
  const [role, setRole] = useState<UserRole>(user.role)
  const [status, setStatus] = useState<UserStatus>(user.status)
  const [saving, setSaving] = useState(false)
  const title = displayNameOf(user)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    const nextName = name.trim()
    if (status === 'DELETED' && user.status !== 'DELETED') {
      const ok = await confirm({
        title: `Xóa ${title}?`,
        copy: 'Tài khoản sẽ không đăng nhập được nữa.',
        ok: 'Xóa',
        cancel: 'Hủy',
      })
      if (!ok) return
    }
    setSaving(true)
    try {
      await updateUser(user.id, { displayName: nextName, role, status })
      toast(`Đã lưu “${nextName || user.email}”.`)
      onSaved()
    } catch (error) {
      // 409: thao tác làm hệ thống không còn quản trị đang dùng → hiện message của backend.
      toast(error instanceof Error ? error.message : 'Không lưu được tài khoản.')
      setSaving(false)
    }
  }

  const account: MetaItem[] = [
    { label: 'Đăng ký', value: stamp(user.createdAt) },
    { label: 'Đăng nhập', value: stamp(user.lastLoginAt) },
  ]
  const cv = cvItems(user.cv)
  const preference = preferenceItems(user.preference)

  return (
    <form spellCheck={false} onSubmit={handleSubmit}>
      <div className="drawer-bar">
        <div className="identity">
          <MonoMark name={name.trim() || title} avatarUrl={user.avatarUrl} large />
          <div>
            <h2 id="user-drawer-title">{name.trim() || title}</h2>
            <p className="fine">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="drawer-body">
        <label className="field">
          <span>Tên hiển thị</span>
          <input
            name="name"
            maxLength={150}
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="pair">
          <label className="field">
            <span>Vai trò</span>
            <select name="role" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="ADMIN">Quản trị</option>
              <option value="USER">Người dùng</option>
            </select>
          </label>
          <label className="field">
            <span>Trạng thái</span>
            <select name="status" value={status} onChange={(event) => setStatus(event.target.value as UserStatus)}>
              <option value="ACTIVE">Đang dùng</option>
              <option value="SUSPENDED">Đã khóa</option>
              <option value="DELETED">Đã xóa</option>
            </select>
          </label>
        </div>
        <MetaList items={account} />
        <div>
          <p className="block-title">Hồ sơ CV</p>
          {cv.length ? <MetaList items={cv} /> : <p className="fine">Chưa có CV.</p>}
        </div>
        <div>
          <p className="block-title">Nguyện vọng việc làm</p>
          {preference.length ? <MetaList items={preference} /> : <p className="fine">Chưa khai nguyện vọng.</p>}
          <p className="fine">Người dùng tự sửa phần này. Mật khẩu nằm ở Firebase.</p>
        </div>
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Hủy
        </button>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  )
}
