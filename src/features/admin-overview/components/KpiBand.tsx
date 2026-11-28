import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { fmtNumber, sourceLabel } from '../../../shared/utils/admin-format'
import type { ChartRow, Overview } from '../types/overview.types'
import { countOf, dayLabel, isLastDayOfMonth, sumBy } from './chart'

type KpiBandProps = {
  overview: Overview
  dayRows: ChartRow[]
  days: number
}

type Kpi = { label: string; value: string; note: string; to: string }

// Dải chỉ số: N ngày, hôm nay, tháng này, tỉ lệ từng nguồn. Mỗi thẻ là link sang trang Việc làm.
export function KpiBand({ overview, dayRows, days }: KpiBandProps) {
  const { sources, today } = overview
  const todayRow = dayRows.find((row) => row.key === today) ?? dayRows.at(-1)
  const month = Number(today.slice(5, 7))
  const range = dayRows.length ? `${dayRows[0].label} – ${dayRows.at(-1)?.label}` : ''
  const windowTotal = overview.totalWindow

  const kpis: Kpi[] = [
    { label: `${days} ngày`, value: fmtNumber(windowTotal), note: range, to: '/jobs' },
    {
      label: 'Hôm nay',
      value: fmtNumber(overview.totalToday),
      note: todayRow
        ? sources.map((domain) => `${sourceLabel(domain)} ${fmtNumber(countOf(todayRow, domain))}`).join(' · ')
        : '',
      to: '/jobs?crawled=today',
    },
    {
      label: `Tháng ${month}`,
      value: fmtNumber(overview.totalMonth),
      note: isLastDayOfMonth(today) ? 'Cả tháng' : `Đến ${dayLabel(today)}, chưa hết tháng`,
      to: '/jobs?crawled=month',
    },
    ...sources.map((domain) => {
      const count = sumBy(dayRows, domain)
      const share = windowTotal ? Math.round((count / windowTotal) * 100) : 0
      return {
        label: sourceLabel(domain),
        value: `${share}%`,
        note: `${fmtNumber(count)} dòng trong ${days} ngày`,
        to: `/jobs?source=${encodeURIComponent(domain)}`,
      }
    }),
  ]

  return (
    <div
      className="metric-band adm-overview-kpis"
      aria-label="Chỉ số"
      style={{ '--adm-overview-cols': kpis.length - 1 } as CSSProperties}
    >
      {kpis.map((kpi) => (
        <Link key={kpi.label} className="metric" to={kpi.to}>
          <span>{kpi.label}</span>
          <strong>{kpi.value}</strong>
          <small>{kpi.note}</small>
        </Link>
      ))}
    </div>
  )
}
