import { useEffect, useRef, useState } from 'react'
import type { Page } from '../../../shared/api/case'
import { getSkillStats, listSkills } from '../api/skills.api'
import type { Skill, SkillQuery, SkillStats } from '../types/skill.types'

type Result<T> = { key: string; data?: T; error?: string }

// Tải dữ liệu theo key; đổi key → hủy request cũ (AbortController), giữ dữ liệu cũ trong lúc tải.
function useKeyedFetch<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null)
  const loadRef = useRef(load)

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    const controller = new AbortController()
    loadRef.current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setResult({ key, error: error instanceof Error ? error.message : 'Không thể tải dữ liệu.' })
      })
    return () => controller.abort()
  }, [key])

  const current = result?.key === key ? result : null
  return {
    data: result?.data,
    error: current?.error ?? null,
    loading: !current,
  }
}

// version tăng sau mỗi thao tác ghi để tải lại.
export function useSkillList(query: SkillQuery, version: number) {
  const key = JSON.stringify({ ...query, version })
  return useKeyedFetch<Page<Skill>>(key, (signal) => listSkills(query, signal))
}

export function useSkillStats(version: number) {
  return useKeyedFetch<SkillStats>(`stats:${version}`, (signal) => getSkillStats(signal))
}
