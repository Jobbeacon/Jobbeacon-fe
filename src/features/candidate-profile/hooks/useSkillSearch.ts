import { useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { searchSkills } from '../api/candidate-profile.api'
import type { SkillSearchItem } from '../types/candidate-profile.types'

const SEARCH_DEBOUNCE_MS = 300

type SearchState = {
  query: string
  results: SkillSearchItem[]
  error: string | null
}

const initialState: SearchState = { query: '', results: [], error: null }

export function useSkillSearch(input: string) {
  const trimmed = input.trim()
  const query = useDebounce(trimmed, SEARCH_DEBOUNCE_MS)
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (!query) return
    // Hủy request cũ để kết quả về muộn không ghi đè kết quả mới.
    const controller = new AbortController()

    void searchSkills(query, controller.signal)
      .then((results) => setState({ query, results, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({
          query,
          results: [],
          error: error instanceof ApiError ? error.message : 'Không thể tìm kỹ năng. Vui lòng thử lại.',
        })
      })

    return () => controller.abort()
  }, [query])

  const isCurrent = query !== '' && state.query === query

  return {
    results: isCurrent ? state.results : [],
    error: isCurrent ? state.error : null,
    // Còn đang chờ debounce hoặc chờ response của query hiện tại.
    isLoading: trimmed !== '' && (trimmed !== query || !isCurrent),
  }
}
