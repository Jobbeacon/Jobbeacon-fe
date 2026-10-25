import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { getSavedJobIds, saveJob, unsaveJob } from '../api/saved-jobs.api'
import { SavedJobsContext } from './saved-jobs.store'

type SavedIdsState = {
  userId: string | null
  ids: Set<string>
  loaded: boolean
}

const EMPTY_IDS = new Set<string>()

function withSaved(ids: Set<string>, jobId: string, saved: boolean) {
  const next = new Set(ids)
  if (saved) next.add(jobId)
  else next.delete(jobId)
  return next
}

// Giữ danh sách id job đã lưu của user hiện tại để mọi nút trái tim dùng chung một trạng thái
export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.uid ?? null
  const [state, setState] = useState<SavedIdsState>({ userId: null, ids: EMPTY_IDS, loaded: false })
  const pendingRef = useRef(new Set<string>())

  useEffect(() => {
    if (!userId) return
    const controller = new AbortController()
    getSavedJobIds(controller.signal)
      .then((ids) => {
        if (!controller.signal.aborted) setState({ userId, ids: new Set(ids), loaded: true })
      })
      .catch(() => {
        // không tải được thì coi như chưa lưu job nào, thao tác lưu vẫn hoạt động
      })
    return () => controller.abort()
  }, [userId])

  // đổi user hoặc đăng xuất thì bỏ danh sách của user cũ
  const isCurrentUser = userId !== null && state.userId === userId
  const ids = isCurrentUser ? state.ids : EMPTY_IDS
  const isReady = isCurrentUser && state.loaded

  const isSaved = useCallback((jobId: string) => ids.has(jobId), [ids])

  const toggleSaved = useCallback(
    async (jobId: string) => {
      if (!userId) {
        window.location.assign('/login')
        return
      }
      if (pendingRef.current.has(jobId)) return

      const nextSaved = !ids.has(jobId)
      const apply = (saved: boolean) =>
        setState((current) => {
          const sameUser = current.userId === userId
          return {
            userId,
            ids: withSaved(sameUser ? current.ids : EMPTY_IDS, jobId, saved),
            loaded: sameUser && current.loaded,
          }
        })

      pendingRef.current.add(jobId)
      apply(nextSaved)
      try {
        await (nextSaved ? saveJob(jobId) : unsaveJob(jobId))
      } catch {
        apply(!nextSaved)
      } finally {
        pendingRef.current.delete(jobId)
      }
    },
    [ids, userId],
  )

  const value = useMemo(() => ({ isReady, isSaved, toggleSaved }), [isReady, isSaved, toggleSaved])

  return <SavedJobsContext.Provider value={value}>{children}</SavedJobsContext.Provider>
}
