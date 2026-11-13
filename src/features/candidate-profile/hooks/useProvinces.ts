import { useEffect, useState } from 'react'
import { getProvinces } from '../../jobs/api/jobs.api'
import type { LocationItem } from '../../jobs/types/job.types'

export function useProvinces() {
  const [provinces, setProvinces] = useState<LocationItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    void getProvinces(controller.signal)
      .then(setProvinces)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setError('Không thể tải danh sách tỉnh/thành.')
      })

    return () => controller.abort()
  }, [])

  return { provinces, error }
}
