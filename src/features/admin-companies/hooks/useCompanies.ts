import { useEffect, useRef, useState } from 'react'
import type { Page } from '../../../shared/api/case'
import { getCompanyStats, listCompanies } from '../api/companies.api'
import type { CompanyQuery, CompanyRow, CompanyStats } from '../types/company.types'

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
export function useCompanyList(query: CompanyQuery, version: number) {
  const key = JSON.stringify({ ...query, version })
  return useKeyedFetch<Page<CompanyRow>>(key, (signal) => listCompanies(query, signal))
}

export function useCompanyStats(version: number) {
  return useKeyedFetch<CompanyStats>(`stats:${version}`, (signal) => getCompanyStats(signal))
}
