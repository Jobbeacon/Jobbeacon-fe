import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

type PageItem = number | 'gap-start' | 'gap-end'

// Luôn hiện trang đầu, trang cuối và 1 trang mỗi bên trang hiện tại; phần còn lại thu gọn thành "…".
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  const items: PageItem[] = [1]
  if (start > 2) items.push('gap-start')
  for (let current = start; current <= end; current += 1) items.push(current)
  if (end < totalPages - 1) items.push('gap-end')
  items.push(totalPages)
  return items
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            className={item === page ? styles.active : undefined}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true">
            …
          </span>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  )
}
