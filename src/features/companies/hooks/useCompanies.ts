import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { searchCompanies } from '../api/companies.api'
import type { CompanySearchParams, CompanySearchResult } from '../types/company.types'

type CompaniesState = {
  requestKey: string | null
  result: CompanySearchResult
  error: string | null
}

const emptyResult: CompanySearchResult = { companies: [], total: 0 }

const initialState: CompaniesState = {
  requestKey: null,
  result: emptyResult,
  error: null,
}

function getCompaniesError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Không thể tải danh sách công ty. Vui lòng thử lại.'
}

export function useCompanies(params: CompanySearchParams) {
  const [state, setState] = useState(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const { keyword, page, size } = params
  const requestKey = JSON.stringify([keyword, page, size, requestVersion])

  useEffect(() => {
    const controller = new AbortController()

    void searchCompanies({ keyword, page, size }, controller.signal)
      .then((result) => {
        setState({ requestKey, result, error: null })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ requestKey, result: emptyResult, error: getCompaniesError(error) })
      })

    return () => controller.abort()
  }, [keyword, page, size, requestKey])

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1)
  }, [])

  const isCurrent = state.requestKey === requestKey
  return {
    ...(isCurrent ? state.result : emptyResult),
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    retry,
  }
}
