import { useEffect, useState } from 'react'
import { getJobsByCategory } from '../../jobs/api/jobs.api'
import type { HomeCategory } from '../types/home.types'

type CategoryJobsState = {
  requestKey: string
  categories: HomeCategory[]
}

/** Vài job mới nhất và tổng số việc của từng ngành, ngành nhiều việc trước. Ngành tải lỗi hoặc hết việc thì bỏ qua. */
export function useCategoryJobs(names: string[], limit: number) {
  const requestKey = JSON.stringify({ names, limit })
  const [state, setState] = useState<CategoryJobsState>({ requestKey: '', categories: [] })

  useEffect(() => {
    const query = JSON.parse(requestKey) as { names: string[]; limit: number }
    if (query.names.length === 0) return
    const controller = new AbortController()

    void Promise.allSettled(
      query.names.map(async (name) => ({
        name,
        ...(await getJobsByCategory(name, query.limit, controller.signal)),
      })),
    ).then((results) => {
      if (controller.signal.aborted) return
      const categories = results
        .flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
        .filter((category) => category.total > 0)
        .sort((a, b) => b.total - a.total)
      setState({ requestKey, categories })
    })

    return () => controller.abort()
  }, [requestKey])

  const isCurrent = state.requestKey === requestKey
  return {
    categories: isCurrent ? state.categories : [],
    isLoading: names.length > 0 && !isCurrent,
  }
}
