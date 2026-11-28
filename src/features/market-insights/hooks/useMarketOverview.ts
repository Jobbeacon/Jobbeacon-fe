import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { getMarketOverview, getProvinces, getRootCategories } from '../api/market.api'
import type { FilterOption, MarketFilters, MarketOverview } from '../types/market.types'

type OverviewState = {
  requestKey: string | null
  data: MarketOverview | null
  error: string | null
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  return 'Không thể tải số liệu thị trường. Vui lòng thử lại.'
}

/**
 * The overview for the current filters. While new filters load, the previous figures stay on screen
 * (`isRefreshing`), so the page does not jump.
 */
export function useMarketOverview(filters: MarketFilters) {
  const [state, setState] = useState<OverviewState>({ requestKey: null, data: null, error: null })
  const [version, setVersion] = useState(0)
  const { categoryId, provinceId, skillId } = filters
  const requestKey = JSON.stringify([categoryId, provinceId, skillId, version])

  useEffect(() => {
    const controller = new AbortController()
    void getMarketOverview({ categoryId, provinceId, skillId }, controller.signal)
      .then((data) => setState({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState((current) => ({ requestKey, data: current.data, error: errorMessage(error) }))
      })
    return () => controller.abort()
  }, [categoryId, provinceId, skillId, requestKey])

  const retry = useCallback(() => setVersion((current) => current + 1), [])
  const isCurrent = state.requestKey === requestKey

  return {
    data: state.data,
    error: isCurrent ? state.error : null,
    isInitialLoading: state.data === null && !isCurrent,
    isRefreshing: state.data !== null && !isCurrent,
    retry,
  }
}

/** Options for the category and province selects; empty lists if they fail to load. */
export function useMarketFilterOptions() {
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [provinces, setProvinces] = useState<FilterOption[]>([])

  useEffect(() => {
    const controller = new AbortController()
    void getRootCategories(controller.signal).then(setCategories).catch(() => undefined)
    void getProvinces(controller.signal).then(setProvinces).catch(() => undefined)
    return () => controller.abort()
  }, [])

  return { categories, provinces }
}
