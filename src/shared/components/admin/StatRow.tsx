import { fmtNumber } from '../../utils/admin-format'

// [giá trị, nhãn, filter?, tone?] — có filter thì thẻ là nút lọc (aria-pressed).
export type StatCard = [value: number | null | undefined, label: string, filter?: string, tone?: string]

type StatRowProps = {
  cards: StatCard[]
  active?: string
  onFilter?: (filter: string) => void
}

export function StatRow({ cards, active, onFilter }: StatRowProps) {
  return (
    <div className="stat-row">
      {cards.map(([value, label, filter, tone]) => {
        const className = `stat${tone ? ` stat--${tone}` : ''}`
        const content = (
          <>
            <strong>{value === null || value === undefined ? '—' : fmtNumber(value)}</strong>
            <span>{label}</span>
          </>
        )
        if (filter === undefined) {
          return (
            <div key={label} className={className}>
              {content}
            </div>
          )
        }
        return (
          <button
            key={label}
            type="button"
            className={className}
            aria-pressed={filter === active}
            onClick={() => onFilter?.(filter)}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
