import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pager, SearchInput, StatRow, useConfirm, useToast } from '../../../shared/components/admin'
import type { StatCard } from '../../../shared/components/admin'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { updateUser } from '../api/users.api'
import { UserDrawer } from '../components/UserDrawer'
import { UserTable } from '../components/UserTable'
import { displayNameOf } from '../components/user-format'
import { useUserList, useUserStats } from '../hooks/useUsers'
import type { UserRole, UserRow, UserStatus } from '../types/user.types'
import '../users.css'

const PAGE_SIZE = 20
const ROLES: UserRole[] = ['ADMIN', 'USER']
const STATUSES: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'DELETED']

// Đọc giá trị enum từ URL, sai thì bỏ.
function pick<T extends string>(value: string | null, allowed: T[]): T | '' {
  return value && (allowed as string[]).includes(value) ? (value as T) : ''
}

// Trang quản lý người dùng: bộ lọc đồng bộ URL (q, role, status, page).
export function UsersPage() {
  const confirm = useConfirm()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const urlQ = params.get('q') ?? ''
  const role = pick(params.get('role'), ROLES)
  const status = pick(params.get('status'), STATUSES)
  const page = Math.max(1, Number(params.get('page')) || 1)

  const [version, setVersion] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)

  const stats = useUserStats(version)
  const list = useUserList({ q: urlQ, role, status, page, size: PAGE_SIZE }, version)

  // Cập nhật URL; đổi bộ lọc thì về trang 1.
  const update = (changes: Record<string, string>, resetPage = true) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        if (resetPage) next.delete('page')
        return next
      },
      { replace: true },
    )
  }


  const reload = () => setVersion((current) => current + 1)

  const activeFilter = !role && !status ? '' : role === 'ADMIN' && !status ? 'admin' : status === 'SUSPENDED' && !role ? 'suspended' : undefined
  const cards: StatCard[] = [
    [stats?.total, 'Tài khoản', ''],
    [stats?.admins, 'Quản trị', 'admin'],
    [stats?.withCv, 'Đã tải CV'],
    [stats?.suspended, 'Đang khóa', 'suspended', 'warn'],
  ]

  const handleFilter = (filter: string) => {
    if (filter === 'admin') update({ role: 'ADMIN', status: '' })
    else if (filter === 'suspended') update({ role: '', status: 'SUSPENDED' })
    else update({ role: '', status: '' })
  }

  const toggleLock = async (user: UserRow) => {
    if (user.status === 'DELETED') return
    const name = displayNameOf(user)
    const locking = user.status !== 'SUSPENDED'
    const ok = await confirm({
      title: locking ? `Khóa ${name}?` : `Mở khóa ${name}?`,
      copy: locking ? 'Tài khoản không đăng nhập được cho đến khi mở khóa.' : 'Tài khoản được dùng lại.',
      ok: locking ? 'Khóa' : 'Mở khóa',
      cancel: 'Hủy',
    })
    if (!ok) return
    try {
      await updateUser(user.id, { status: locking ? 'SUSPENDED' : 'ACTIVE' })
      toast(locking ? `Đã khóa ${name}.` : `Đã mở khóa ${name}.`)
      reload()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Không cập nhật được tài khoản.')
    }
  }

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Người dùng</h1>
          <p className="lead">
            Đổi vai trò hoặc khóa tài khoản. Đăng nhập qua Firebase; hồ sơ CV và nguyện vọng việc làm do người dùng tự sửa.
          </p>
        </div>
      </header>
      <StatRow cards={cards} active={activeFilter} onFilter={handleFilter} />
      <section className="sheet adm-users-sheet" aria-busy={list.loading}>
        <div className="toolbar list-toolbar">
          <SearchInput
            className="search-input"
            placeholder="Tìm theo tên hoặc email"
            aria-label="Tìm người dùng"
            autoComplete="off"
            value={urlQ}
            onChange={(value) => update({ q: value })}
          />
          <select aria-label="Vai trò" value={role} onChange={(event) => update({ role: event.target.value })}>
            <option value="">Mọi vai trò</option>
            <option value="ADMIN">Quản trị</option>
            <option value="USER">Người dùng</option>
          </select>
          <select aria-label="Trạng thái" value={status} onChange={(event) => update({ status: event.target.value })}>
            <option value="">Mọi trạng thái</option>
            <option value="ACTIVE">Đang dùng</option>
            <option value="SUSPENDED">Đã khóa</option>
            <option value="DELETED">Đã xóa</option>
          </select>
        </div>
        {list.error ? <ErrorState message={list.error} onRetry={reload} /> : null}
        {list.data ? (
          <UserTable rows={list.data.content} onEdit={(user) => setEditingId(user.id)} onToggleLock={toggleLock} />
        ) : list.loading ? (
          <p className="fine adm-users-loading">Đang tải danh sách...</p>
        ) : null}
        <Pager
          page={page}
          size={PAGE_SIZE}
          total={list.data?.amount ?? 0}
          unit="tài khoản"
          onChange={(next) => update({ page: next > 1 ? String(next) : '' }, false)}
        />
      </section>
      <UserDrawer
        userId={editingId}
        onClose={() => setEditingId(null)}
        onSaved={() => {
          setEditingId(null)
          reload()
        }}
      />
    </main>
  )
}
