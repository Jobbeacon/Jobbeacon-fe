import { fmtNumber } from '../../utils/admin-format'

type PagerProps = {
  page: number
  size: number
  total: number
  // Đơn vị đếm, vd. "tin", "công ty"
  unit: string
  onChange: (page: number) => void
}

// Danh sách trang rút gọn: 1 … 4 5 6 … 20
function pageList(current: number, total: number) {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
  const out: (number | '…')[] = []
  pages.forEach((page, index) => {
    if (index && page - pages[index - 1] > 1) {
      out.push('…')
    }
    out.push(page)
  })
  return out
}

export function Pager({ page, size, total, unit, onChange }: PagerProps) {
  const pages = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * size
  const end = Math.min(start + size, total)
  const range = total
    ? `${fmtNumber(start + 1)}–${fmtNumber(end)} / ${fmtNumber(total)} ${unit}`
    : `0 ${unit}`

  return (
    <div className="pager">
      <span className="count">{range}</span>
      <nav className="pages" aria-label="Phân trang">
        <button type="button" disabled={current === 1} aria-label="Trang trước" onClick={() => onChange(current - 1)}>
          ‹
        </button>
        {pageList(current, pages).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`}>…</span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === current ? 'page' : undefined}
              onClick={() => item !== current && onChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" disabled={current === pages} aria-label="Trang sau" onClick={() => onChange(current + 1)}>
          ›
        </button>
      </nav>
    </div>
  )
}
