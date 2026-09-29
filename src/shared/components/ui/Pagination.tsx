import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

type PageGap = 'gap-start' | 'gap-end'

type PageItem = number | PageGap

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

type PageJumpInputProps = {
  totalPages: number
  onSubmit: (page: number) => void
  onClose: () => void
}

function PageJumpInput({ totalPages, onSubmit, onClose }: PageJumpInputProps) {
  const [value, setValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    const target = Number(value)
    if (!Number.isInteger(target) || target < 1 || target > totalPages) {
      setIsInvalid(true)
      return
    }
    onSubmit(target)
  }

  return (
    <input
      className={`${styles.jumpInput} ${isInvalid ? styles.invalid : ''}`}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={String(totalPages).length}
      title={`Nhập số trang (1-${totalPages}) rồi nhấn Enter`}
      aria-label={`Nhập số trang từ 1 đến ${totalPages}, nhấn Enter để đi tới`}
      aria-invalid={isInvalid}
      value={value}
      autoFocus
      onChange={(event) => {
        setValue(event.target.value.replace(/\D/g, ''))
        setIsInvalid(false)
      }}
      onKeyDown={handleKeyDown}
      onBlur={onClose}
    />
  )
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const [editingGap, setEditingGap] = useState<PageGap | null>(null)

  if (totalPages <= 1) {
    return null
  }

  const jumpTo = (target: number) => {
    setEditingGap(null)
    onChange(target)
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
        ) : editingGap === item ? (
          <PageJumpInput
            key={item}
            totalPages={totalPages}
            onSubmit={jumpTo}
            onClose={() => setEditingGap(null)}
          />
        ) : (
          <button
            key={item}
            type="button"
            className={styles.gap}
            aria-label="Nhập số trang để đi tới"
            title="Nhập số trang"
            onClick={() => setEditingGap(item)}
          >
            …
          </button>
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
