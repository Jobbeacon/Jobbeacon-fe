import { useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import type { Page } from '../../../shared/api/case'
import { getUser, getUserStats, getUsers } from '../api/users.api'
import type { UserDetail, UserQuery, UserRow, UserStats } from '../types/user.types'

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function errorText(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

type Loaded<T> = { requestKey: string | null; data: T | null; error: string | null }

// Danh sách người dùng theo bộ lọc; giữ dữ liệu cũ khi đang tải trang mới. Đổi `version` để tải lại.
export function useUserList(query: UserQuery, version: number) {
  const [state, setState] = useState<Loaded<Page<UserRow>>>({ requestKey: null, data: null, error: null })
  const { q = '', role = '', status = '', page = 1, size = 20 } = query
  const requestKey = JSON.stringify([q, role, status, page, size, version])

  useEffect(() => {
    const controller = new AbortController()
    getUsers({ q, role, status, page, size }, controller.signal)
      .then((data) => setState({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (isAbort(error)) return
        setState((current) => ({ requestKey, data: current.data, error: errorText(error, 'Không tải được danh sách người dùng.') }))
      })
    return () => controller.abort()
  }, [q, role, status, page, size, requestKey])

  return {
    data: state.data,
    loading: state.requestKey !== requestKey,
    error: state.requestKey === requestKey ? state.error : null,
  }
}

export function useUserStats(version: number) {
  const [state, setState] = useState<Loaded<UserStats>>({ requestKey: null, data: null, error: null })
  const requestKey = String(version)

  useEffect(() => {
    const controller = new AbortController()
    getUserStats(controller.signal)
      .then((data) => setState({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (isAbort(error)) return
        setState((current) => ({ requestKey, data: current.data, error: errorText(error, 'Không tải được thống kê.') }))
      })
    return () => controller.abort()
  }, [requestKey])

  return state.data
}

// Chi tiết một tài khoản (mở drawer sửa).
export function useUserDetail(id: string) {
  const [state, setState] = useState<Loaded<UserDetail>>({ requestKey: null, data: null, error: null })
  const [version, setVersion] = useState(0)
  const requestKey = `${id}:${version}`

  useEffect(() => {
    const controller = new AbortController()
    getUser(id, controller.signal)
      .then((data) => setState({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (isAbort(error)) return
        setState({ requestKey, data: null, error: errorText(error, 'Không tải được tài khoản.') })
      })
    return () => controller.abort()
  }, [id, requestKey])

  const loading = state.requestKey !== requestKey
  return {
    data: loading ? null : state.data,
    error: loading ? null : state.error,
    retry: () => setVersion((current) => current + 1),
  }
}
