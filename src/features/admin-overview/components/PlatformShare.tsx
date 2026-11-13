import { fmtNumber, sourceLabel } from '../../../shared/utils/admin-format'
import type { ChartRow } from '../types/overview.types'
import { sourceColor, sumBy } from './chart'

type PlatformShareProps = {
  rows: ChartRow[]
  sources: string[]
  caption: string
}

// Tỉ lệ ghi nhận theo nguồn trong khung đang xem (ngày hoặc tháng).
export function PlatformShare({ rows, sources, caption }: PlatformShareProps) {
  const totals = sources.map((domain) => ({ domain, value: sumBy(rows, domain) }))
  const total = totals.reduce((count, row) => count + row.value, 0)
  const percent = (value: number) => (total ? (value / total) * 100 : 0)

  return (
    <div className="split-pane">
      <h2>Theo nền tảng</h2>
      <div className="plats">
        <div className="share">
          {totals.map((row, index) => (
            <span key={row.domain} style={{ width: `${percent(row.value)}%`, background: sourceColor(index) }} />
          ))}
        </div>
        {totals.map((row, index) => (
          <div key={row.domain} className="plat">
            <div className="plat-name">
              <i data-domain={row.domain} style={{ background: sourceColor(index) }} />
              {sourceLabel(row.domain)}
              <em>{row.domain}</em>
            </div>
            <b>{fmtNumber(row.value)}</b>
            <b>{Math.round(percent(row.value))}%</b>
          </div>
        ))}
        {sources.length ? null : <p className="unwired">Chưa có nguồn crawl nào.</p>}
      </div>
      <p className="fine">{caption}</p>
    </div>
  )
}
