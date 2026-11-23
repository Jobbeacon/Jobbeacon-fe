import { useEffect, useState } from 'react'
import { getJobFacets } from '../../jobs/api/jobs.api'
import type { FacetItem } from '../../jobs/types/job.types'
import type { HomeData } from '../types/home.types'

const CATEGORY_LIMIT = 8
const SKILL_LIMIT = 6

const emptyData: HomeData = { categories: [], popularSkills: [] }

// Bộ lọc trên URL phân tách bằng dấu phẩy nên bỏ các tên có chứa dấu phẩy.
function topNames(items: FacetItem[], limit: number) {
  return items
    .filter((item) => item.count > 0 && !item.name.includes(','))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.name)
}

// Chỉ là lối tắt tìm kiếm: lỗi hoặc chưa có dữ liệu thì trang chủ ẩn các phần này.
export function useHomeData(): HomeData {
  const [data, setData] = useState(emptyData)

  useEffect(() => {
    const controller = new AbortController()
    getJobFacets(controller.signal)
      .then((facets) => {
        if (controller.signal.aborted) return
        setData({
          categories: topNames(facets.categories, CATEGORY_LIMIT),
          popularSkills: topNames(facets.skills, SKILL_LIMIT),
        })
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  return data
}
